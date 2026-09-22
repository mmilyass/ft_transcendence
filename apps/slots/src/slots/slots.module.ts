import { Module } from "@nestjs/common";
import { SlotsService } from "./slots.service";
import { SlotsController } from "./slots.controller";
import { AppointmentsController } from "./appointments.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [SlotsController, AppointmentsController],
  providers: [SlotsService],
  imports: [PrismaModule, AuthModule],
})
export class SlotsModule {}
