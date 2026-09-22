import { Module } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { ReviewController } from "./review.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { DoctorModule } from "src/doctor/doctor.module";

@Module({
  imports: [PrismaModule, DoctorModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
