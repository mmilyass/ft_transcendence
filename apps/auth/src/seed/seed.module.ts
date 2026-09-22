import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { SeedService } from "./seed.service";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY || "Yassir_SecretKey",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [SeedService],
})
export class SeedModule {}
