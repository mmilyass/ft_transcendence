// src/app.module.ts
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "@nestjs/config";
import { SlotsModule } from "./slots/slots.module";
import { RabbitMqModule } from "./rabbitmq/rabbitmq.module";
import { AuthSyncController } from "./auth/auth-sync.controller";
import { ServicesModule } from "./services/services.module";
import { CategoriesModule } from "./categories/categories.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UsersModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
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
    SlotsModule,
    RabbitMqModule,
    ServicesModule,
    CategoriesModule,
  ],
  controllers: [AuthSyncController, AppController],
  providers: [AppService],
})
export class AppModule {}
