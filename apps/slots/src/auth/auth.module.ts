import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtGuard } from "./guards/jwt.guard";
import { PrismaModule } from "src/prisma/prisma.module";

import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY || "Yassir_SecretKey",
      signOptions: { expiresIn: "1h" },
    }),
    PrismaModule,
    UsersModule,
  ],
  providers: [
    {
      provide: "APP_GUARD",
      useClass: JwtGuard,
    },
    JwtGuard,
  ],
  exports: [JwtModule, JwtGuard],
})
export class AuthModule {}
