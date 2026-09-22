import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { DoctorService } from "src/doctor/doctor.service";

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly doctorService: DoctorService,
  ) {}

  async getReviewsForDoctor(doctorId: string) {
    return this.prisma.review.findMany({
      where: { doctorId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async upsertReview(doctorId: string, userId: string, dto: CreateReviewDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    const existing = await this.prisma.review.findFirst({
      where: { doctorId, userId },
    });

    const review = await this.prisma.$transaction(async (tx) => {
      if (existing) {
        const newRating =
          doctor.reviewCount > 0
            ? (doctor.rating * doctor.reviewCount -
                existing.rating +
                dto.rating) /
              doctor.reviewCount
            : dto.rating;

        const updated = await tx.review.update({
          where: { id: existing.id },
          data: { rating: dto.rating, comment: dto.comment },
        });

        await tx.doctor.update({
          where: { id: doctorId },
          data: { rating: Number(newRating.toFixed(1)) },
        });

        await tx.notification.create({
          data: {
            user_id: doctor.user_id,
            title: "Review Updated",
            message: "A patient updated their review of you",
            isRead: false,
          },
        });

        return updated;
      }

      const newCount = doctor.reviewCount + 1;
      const newRating =
        (doctor.rating * doctor.reviewCount + dto.rating) / newCount;

      const created = await tx.review.create({
        data: {
          doctorId,
          userId,
          rating: dto.rating,
          comment: dto.comment,
        },
      });

      await tx.doctor.update({
        where: { id: doctorId },
        data: {
          rating: Number(newRating.toFixed(1)),
          reviewCount: newCount,
        },
      });

      await tx.userStats.upsert({
        where: { user_id: userId },
        update: { Reviews: { increment: 1 } },
        create: { user_id: userId, Reviews: 1 },
      });

      await tx.notification.create({
        data: {
          user_id: doctor.user_id,
          title: "New Review",
          message: "You have a new patient review",
          isRead: false,
        },
      });

      await tx.auditlog.create({
        data: {
          user_id: userId,
          action: `Reviewed Dr. ${doctor.user_id}`,
        },
      });

      return created;
    });

    await this.doctorService.updateDoctorScore(doctorId);
    return review;
  }

  async update(id: string, callerUserId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException("Review not found");
    }
    if (review.userId !== callerUserId) {
      throw new ForbiddenException("You can only edit your own review");
    }
    if (dto.rating == null) {
      return this.prisma.review.update({
        where: { id },
        data: { comment: dto.comment },
      });
    }

    return this.upsertReview(review.doctorId, callerUserId, {
      rating: dto.rating,
      comment: dto.comment ?? review.comment ?? undefined,
    });
  }

  async remove(id: string, callerUserId: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException("Review not found");
    }
    if (review.userId !== callerUserId) {
      throw new ForbiddenException("You can only delete your own review");
    }

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: review.doctorId },
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id } });

      if (doctor) {
        const newCount = Math.max(doctor.reviewCount - 1, 0);
        const newRating =
          newCount > 0
            ? (doctor.rating * doctor.reviewCount - review.rating) / newCount
            : 0;

        await tx.doctor.update({
          where: { id: review.doctorId },
          data: {
            rating: Number(newRating.toFixed(1)),
            reviewCount: newCount,
          },
        });
      }

      await tx.userStats.upsert({
        where: { user_id: callerUserId },
        update: { Reviews: { decrement: 1 } },
        create: { user_id: callerUserId, Reviews: 0 },
      });

      await tx.auditlog.create({
        data: {
          user_id: callerUserId,
          action: `Deleted your review of Dr. ${doctor?.user_id ?? review.doctorId}`,
        },
      });

      if (doctor) {
        await tx.notification.create({
          data: {
            user_id: doctor.user_id,
            title: "Review Removed",
            message: "A patient removed their review of you",
            isRead: false,
          },
        });
      }
    });

    await this.doctorService.updateDoctorScore(review.doctorId);
    return { success: true };
  }
}
