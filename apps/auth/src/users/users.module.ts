import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY || "Yassir_SecretKey",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtGuard],
  exports: [UsersService], // <-- add this
})
export class UsersModule {}
