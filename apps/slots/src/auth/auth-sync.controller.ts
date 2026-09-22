import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { Role } from "@prisma/client";
import { Public } from "src/auth/decorator/public.decorator";
import { PrismaService } from "src/prisma/prisma.service";

interface UserPayload {
  id: string;
  name: string;
  email: string;
  role?: Role;
}

interface DoctorEventPayload {
  id?: string;
  userId?: string;
  doctorId?: string;
  name?: string;
  email?: string;
  role?: Role;
  doctor?: {
    id: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    role?: Role;
  };
}

interface UserDeletedPayload {
  id: string;
}

interface DoctorDeletedPayload {
  doctorId?: string;
  userId?: string;
}

@Public()
@Controller()
export class AuthSyncController {
  private readonly logger = new Logger(AuthSyncController.name);

  constructor(private readonly prisma: PrismaService) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }

  private async syncUser(
    payload: UserPayload,
    eventName: string,
  ): Promise<void> {
    if (!payload?.id) {
      this.logger.error(`❌ [${eventName}] Missing user id in payload`);
      return;
    }

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (existingUser) {
        await this.prisma.user.update({
          where: { id: payload.id },
          data: {
            name: payload.name,
            email: payload.email,
            ...(payload.role && { role: payload.role }),
          },
        });
      } else {
        await this.prisma.user.create({
          data: {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role ?? Role.USER,
          },
        });
      }

      this.logger.log(
        `✅ [${eventName}] Successfully synced user ${payload.id}`,
      );
    } catch (error: unknown) {
      this.logger.error(
        `❌ [${eventName}] Failed to sync user ${payload.id}: ${this.getErrorMessage(error)}`,
      );
    }
  }

  private async syncUserAndDoctor(
    payload: DoctorEventPayload,
    eventName: string,
  ): Promise<void> {
    const userId = payload.userId ?? payload.id;
    const doctorId = payload.doctorId ?? payload.doctor?.id;

    if (!userId || !doctorId) {
      this.logger.error(
        `❌ [${eventName}] Missing userId or doctorId in payload`,
      );
      return;
    }

    const userName = payload.name ?? payload.user?.name ?? "User";
    const userEmail =
      payload.email ?? payload.user?.email ?? `${userId}@local.local`;
    const userRole = payload.role ?? payload.user?.role ?? Role.DOCTOR;

    try {
      await this.prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
          where: { id: userId },
        });

        if (existingUser) {
          await tx.user.update({
            where: { id: userId },
            data: {
              name: userName,
              email: userEmail,
              role: userRole,
            },
          });
        } else {
          await tx.user.create({
            data: {
              id: userId,
              name: userName,
              email: userEmail,
              role: userRole,
            },
          });
        }

        const existingDoctor = await tx.doctor.findUnique({
          where: {
            user_id: userId,
          },
        });

        if (existingDoctor) {
          if (existingDoctor.id === doctorId) {
            return;
          }

          await tx.doctor.update({
            where: {
              user_id: userId,
            },
            data: {
              id: doctorId,
            },
          });

          await tx.user.update({
              where: {
                id: userId,
              },
              data: {
                role: Role.DOCTOR,
              },
          });

          this.logger.log(
            `🔄 [${eventName}] Synced doctor id for user ${userId}`,
          );
        } else {
          await tx.doctor.create({
            data: {
              id: doctorId,
              user_id: userId,
            },
          });

          this.logger.log(
            `✨ [${eventName}] Created doctor profile for user ${userId}`,
          );
        }
      });
    } catch (error: unknown) {
      this.logger.error(
        `❌ Failed to sync doctor event ${eventName} for user ${userId}: ${this.getErrorMessage(error)}`,
      );
    }
  }

  @EventPattern("google.user")
  async handleGoogleUser(@Payload() data: UserPayload): Promise<void> {
    await this.syncUser(data, "google.user");
  }

  @EventPattern("user.created")
  async handleUserCreated(@Payload() data: UserPayload): Promise<void> {
    await this.syncUser(data, "user.created");
  }

  @EventPattern("user.updated")
  async handleUserUpdated(@Payload() data: UserPayload): Promise<void> {
    await this.syncUser(data, "user.updated");
  }

  @EventPattern("user.deleted")
  async handleUserDeleted(@Payload() data: UserDeletedPayload): Promise<void> {
    if (!data?.id) {
      this.logger.error(`❌ [user.deleted] Missing user id in payload`);
      return;
    }

    try {
      await this.prisma.user.delete({
        where: {
          id: data.id,
        },
      });

      this.logger.log(`🗑️ [user.deleted] Deleted user ${data.id}`);
    } catch (error: unknown) {
      this.logger.error(
        `❌ Failed to delete user ${data.id}: ${this.getErrorMessage(error)}`,
      );
    }
  }

  @EventPattern("doctor.created")
  async handleDoctorCreated(
    @Payload() data: DoctorEventPayload,
  ): Promise<void> {
    await this.syncUserAndDoctor(data, "doctor.created");
  }

  @EventPattern("doctor.approved")
  async handleDoctorApproved(
    @Payload() data: DoctorEventPayload,
  ): Promise<void> {
    await this.syncUserAndDoctor(data, "doctor.approved");
  }

  @EventPattern("doctor.deleted")
  async handleDoctorDeleted(
    @Payload() data: DoctorDeletedPayload,
  ): Promise<void> {
    if (!data?.doctorId && !data?.userId) {
      this.logger.error(
        `❌ [doctor.deleted] Missing doctorId or userId in payload`,
      );
      return;
    }

    try {
      if (data.doctorId) {
        await this.prisma.doctor.delete({
          where: {
            id: data.doctorId,
          },
        });

        this.logger.log(`🗑️ [doctor.deleted] Deleted doctor ${data.doctorId}`);
      } else if (data.userId) {
        await this.prisma.doctor.delete({
          where: {
            user_id: data.userId,
          },
        });

        this.logger.log(
          `🗑️ [doctor.deleted] Deleted doctor for user ${data.userId}`,
        );
      }
    } catch (error: unknown) {
      this.logger.warn(
        `⚠️ Doctor record may already be deleted: ${this.getErrorMessage(error)}`,
      );
    }
  }
}
