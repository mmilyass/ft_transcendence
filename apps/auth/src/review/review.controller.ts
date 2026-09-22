import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { Public } from "src/auth/decorator/public.decorator";
import type { RequestWithUser } from "src/auth/guards/jwt.guard";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Public — shown on the doctor's profile page, no login needed to read.
  @Public()
  @Get("doctor/:doctorId")
  async getForDoctor(@Param("doctorId") doctorId: string) {
    return this.reviewService.getReviewsForDoctor(doctorId);
  }

  @Get("mine")
  async findMine(@Req() req: RequestWithUser) {
    return this.reviewService.findByUser(req.user.sub);
  }

  @Post("doctor/:doctorId")
  async upsert(
    @Req() req: RequestWithUser,
    @Param("doctorId") doctorId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.upsertReview(doctorId, req.user.sub, dto);
  }

  @Patch(":id")
  async update(
    @Req() req: RequestWithUser,
    @Param("id") id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewService.update(id, req.user.sub, dto);
  }

  @Delete(":id")
  async remove(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.reviewService.remove(id, req.user.sub);
  }
}
