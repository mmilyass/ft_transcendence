import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "@nestjs/config";
import { DoctorModule } from "./doctor/doctor.module";
import { AdminModule } from "./admin/admin.module";
import { MetricsModule } from "./metrics/metrics.module";
import { RabbitMqModule } from "./rabbitmq/rabbitmq.module";
import { AuthEventListenerModule } from "./auth-event-listener/auth-event-listener.module";
import { ReviewModule } from "./review/review.module";
import { NotificationModule } from "./notification/notification.module";
import { UserStatsModule } from "./user-stats/user-stats.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SeedModule } from "./seed/seed.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    PrismaModule,
    UsersModule,

    MailerModule.forRootAsync({
      imports: [ConfigModule, MetricsModule, RabbitMqModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>("EMAIL_USER"),
            pass: configService.get<string>("EMAIL_PASS"),
          },
        },
        defaults: {
          from:
            configService.get<string>("EMAIL_FROM") ??
            `"Authentication App" <${configService.get<string>("EMAIL_USER")}>`,
        },
      }),
    }),
    DoctorModule,
    AdminModule,
    AuthEventListenerModule,
    ReviewModule,
    NotificationModule,
    UserStatsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
