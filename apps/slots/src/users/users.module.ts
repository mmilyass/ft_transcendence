import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { JwtGuard } from "src/auth/guards/jwt.guard";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY || "Yassir_SecretKey",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtGuard],
})
export class UsersModule {}
