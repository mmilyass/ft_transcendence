import { Module } from "@nestjs/common";
import { AuthEventListenerService } from "./auth-event-listener.service";
import { AuthEventListenerController } from "./auth-event-listener.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { DoctorService } from "src/doctor/doctor.service";

@Module({
  controllers: [AuthEventListenerController],
  providers: [AuthEventListenerService, DoctorService],
  imports: [PrismaModule],
})
export class AuthEventListenerModule {}
