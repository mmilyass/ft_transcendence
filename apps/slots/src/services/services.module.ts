import { Module } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { ServicesController } from "./services.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  // AuthModule is what actually provides JwtService for JwtGuard — without
  // it, adding @UseGuards(JwtGuard, ...) to the controller crashes at boot
  // with "Nest can't resolve dependencies of the JwtGuard".
  imports: [PrismaModule, AuthModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
