import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AppointmentEventData } from "./auth-event-listener.controller";
import { DoctorService } from "src/doctor/doctor.service";

@Injectable()
export class AuthEventListenerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly doctorService: DoctorService,
  ) {}

  async handleAppointmentCreated(data: AppointmentEventData) {
    const user = await this.prismaService.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error(`User with ID ${data.userId} not found`);
    }
    const doctor = await this.prismaService.user.findUnique({
      where: { id: data.doctorId },
    });

    if (!doctor) {
      throw new Error(`Doctor with ID ${data.doctorId} not found`);
    }
    await this.prismaService.$transaction(async (tx) => {
      await tx.auditlog.create({
        data: {
          user_id: user.id,
          action: `Requested appointment with Dr. ${doctor.name}`,
        },
      });

      await tx.auditlog.create({
        data: {
          user_id: doctor.id,
          action: `Received appointment request from ${user.name}`,
        },
      });
      await tx.notification.create({
        data: {
          user_id: doctor.id,
          message: `You have a new appointment request from ${user.name}.`,
          title: "New Appointment Request",
          isRead: false,
        },
      });
    });
  }

  async handleAppointmentCanceled(data: AppointmentEventData) {
    const user = await this.prismaService.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error(`User with ID ${data.userId} not found`);
    }
    const doctor = await this.prismaService.user.findUnique({
      where: { id: data.doctorId },
    });

    if (!doctor) {
      throw new Error(`Doctor with ID ${data.doctorId} not found`);
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.auditlog.create({
        data: {
          user_id: user.id,
          action: `Canceled appointment with Dr. ${doctor.name}`,
        },
      });
      await tx.auditlog.create({
        data: {
          user_id: doctor.id,
          action: `Appointment canceled with ${user.name}`,
        },
      });

      await tx.userStats.upsert({
        where: {
          user_id: user.id,
        },
        update: {
          cancelledAppointments: {
            increment: 1,
          },
        },
        create: {
          user_id: user.id,
          cancelledAppointments: 1,
        },
      });

      await tx.userStats.upsert({
        where: {
          user_id: doctor.id,
        },
        update: {
          cancelledAppointments: {
            increment: 1,
          },
        },
        create: {
          user_id: doctor.id,
          cancelledAppointments: 1,
        },
      });

      await tx.notification.create({
        data: {
          user_id: doctor.id,
          message: `${user.name} has canceled their appointment with you.`,
          title: "Appointment Canceled",
          isRead: false,
        },
      });
    });
  }
  async handleAppointmentCompleted(data: AppointmentEventData) {
    const user = await this.prismaService.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error(`User with ID ${data.userId} not found`);
    }
    const doctor = await this.prismaService.user.findUnique({
      where: { id: data.doctorId },
    });

    if (!doctor) {
      throw new Error(`Doctor with ID ${data.doctorId} not found`);
    }

    const doctorPatient = await this.prismaService.doctorPatient.findUnique({
      where: {
        doctor_id_patient_id: {
          doctor_id: doctor.id,
          patient_id: user.id,
        },
      },
    });

    await this.prismaService.$transaction(async (tx) => {
      if (!doctorPatient) {
        await tx.doctorPatient.create({
          data: {
            doctor_id: doctor.id,
            patient_id: user.id,
          },
        });
        await tx.doctor.update({
          where: { id: doctor.id },
          data: {
            totalPatients: {
              increment: 1,
            },
          },
        });
      }

      await tx.doctor.update({
        where: { id: doctor.id },
        data: {
          totalAppointments: {
            increment: 1,
          },
        },
      });

      await tx.auditlog.create({
        data: {
          user_id: user.id,
          action: `Appointment with Dr. ${doctor.name} was completed`,
        },
      });

      await tx.auditlog.create({
        data: {
          user_id: doctor.id,
          action: `Appointment with ${user.name} was completed`,
        },
      });

      await tx.userStats.upsert({
        where: {
          user_id: user.id,
        },
        update: {
          Appointments: {
            increment: 1,
          },
        },
        create: {
          user_id: user.id,
          Appointments: 1,
        },
      });

      await tx.userStats.upsert({
        where: {
          user_id: doctor.id,
        },
        update: {
          Appointments: {
            increment: 1,
          },
        },
        create: {
          user_id: doctor.id,
          Appointments: 1,
        },
      });
      await tx.notification.create({
        data: {
          user_id: user.id,
          message: `Your appointment with Dr. ${doctor.name} has been marked as completed.`,
          title: "Appointment Completed",
          isRead: false,
        },
      });
      await this.doctorService.updateDoctorScore(doctor.id);
    });
  }

  async handleAppointmentRejected(data: AppointmentEventData) {
    const user = await this.prismaService.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error(`User with ID ${data.userId} not found`);
    }
    const doctor = await this.prismaService.user.findUnique({
      where: { id: data.doctorId },
    });

    if (!doctor) {
      throw new Error(`Doctor with ID ${data.doctorId} not found`);
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.auditlog.create({
        data: {
          user_id: user.id,
          action: `Dr. ${doctor.name} rejected your appointment request`,
        },
      });

      await tx.auditlog.create({
        data: {
          user_id: doctor.id,
          action: `You rejected an appointment request from ${user.name}`,
        },
      });

      await tx.notification.create({
        data: {
          user_id: user.id,
          message: `Dr. ${doctor.name} has rejected your appointment request.`,
          title: "Appointment Rejected",
          isRead: false,
        },
      });
    });
  }
}
