import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { Role, User } from "@prisma/client/edge";
import { UpdateUser } from "./users.controller";
import { RabbitMqService } from "src/rabbitmq/rabbitmq.service";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private readonly rabbitMQService: RabbitMqService,
  ) {}

  async getStats(id: string) {
    return this.prisma.userStats.findUnique({ where: { user_id: id } });
  }
  create(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  update(id: string, data: Partial<CreateUserDto>) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    await this.prisma.auditlog.create({
      data: {
        action: "DELETE_USER",
        user_id: id,
        timestamp: new Date(),
      },
    });

    const deleted = await this.prisma.user.delete({ where: { id } });

    if (user) {
      this.rabbitMQService.emit("user.account_deleted", {
        email: user.email,
        name: user.name,
      });
    }

    return deleted;
  }

  async exportMyData(userId: string) {
    const [user, doctor, reviews, notifications, stats, auditlog] =
      await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true,
            verified: true,
            createdAt: true,
          },
        }),
        this.prisma.doctor.findUnique({
          where: { user_id: userId },
          include: { location: true },
        }),
        this.prisma.review.findMany({ where: { userId } }),
        this.prisma.notification.findMany({ where: { user_id: userId } }),
        this.prisma.userStats.findUnique({ where: { user_id: userId } }),
        this.prisma.auditlog.findMany({ where: { user_id: userId } }),
      ]);

    if (!user) {
      throw new BadRequestException("User not found");
    }

    this.rabbitMQService.emit("user.data_exported", {
      email: user.email,
      name: user.name,
    });

    return {
      exportedAt: new Date().toISOString(),
      account: user,
      doctorProfile: doctor,
      reviews,
      notifications,
      stats,
      activityLog: auditlog,
    };
  }
  async updateProfileImage(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No image provided");
    }

    const imageUrl = await this.cloudinaryService.uploadImage(file.buffer);

    await this.prisma.$transaction(async (tx) => {
      await tx.auditlog.create({
        data: {
          action: "UPDATE_PROFILE_IMAGE",
          user_id: userId,
          timestamp: new Date(),
        },
      });

      return await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          image: imageUrl,
        },
      });
    });
  }

  async getLandingPageData() {
    const totalPatients = await this.prisma.user.count({
      where: {
        role: Role.USER,
      },
    });

    const specialties = await this.prisma.doctor.findMany({
      distinct: ["speciality"],
      select: {
        speciality: true,
      },
    });

    const featuredDoctors = await this.prisma.doctor.findMany({
      take: 3,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        rating: "desc",
      },
    });

    return {
      totalPatients,
      totalSpecialists: specialties.length,
      featuredDoctors,
    };
  }

  async updateMyData(userId: string, data: UpdateUser) {
    await this.prisma.$transaction(async (tx) => {
      await tx.auditlog.create({
        data: {
          user_id: userId,
          action: "UPDATE_MY_DATA",
          timestamp: new Date(),
        },
      });

      this.rabbitMQService.emit("user.update", {
        userId,
        data,
      });

      return tx.user.update({
        where: { id: userId },
        data: {
          name: data?.name,
          phone: data?.phone,
        },
      });
    });
  }
}
