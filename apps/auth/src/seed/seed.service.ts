import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { RabbitMqService } from "src/rabbitmq/rabbitmq.service";
import { JwtPayload } from "src/auth/guards/jwt.guard";

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitMqService: RabbitMqService,
    private readonly jwtService: JwtService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin().catch((error) => {
      this.logger.error("Admin seed failed", error);
    });
  }

  private async seedAdmin() {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;

    if (!email || !password || !name) {
      this.logger.warn(
        "ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME not all set — skipping admin seed",
      );
      return;
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (existing.role !== "ADMIN") {
        this.logger.warn(
          `A user already exists at ${email} but isn't ADMIN (role=${existing.role}) — leaving it alone. Change ADMIN_EMAIL or promote them manually if this was meant to be the admin account.`,
        );
      } else {
        this.logger.log(
          `Admin account ${email} already exists — nothing to seed.`,
        );
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "ADMIN",
          verified: true,
        },
      });

      await tx.auditlog.create({
        data: {
          user_id: created.id,
          action: "Admin account seeded on startup",
        },
      });

      const stats = await tx.stats.findFirst();
      if (!stats) {
        await tx.stats.create({ data: { TotalUsers: 1 } });
      } else {
        await tx.stats.update({
          where: { id: stats.id },
          data: { TotalUsers: { increment: 1 } },
        });
      }

      return created;
    });

    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = this.jwtService.sign(payload, { expiresIn: "1d" } as any);

    this.rabbitMqService
      .emit("user.created", {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
        role: String(user.role),
        verified: user.verified,
      })
      .subscribe();

    this.logger.log(`Seeded admin account: ${email}`);
  }
}
