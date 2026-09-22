import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createNotificationDto: CreateNotificationDto) {
    await this.prisma.notification.create({
      data: {
        user_id: createNotificationDto.userId,
        message: createNotificationDto.message,
        title: createNotificationDto.title,
        isRead: createNotificationDto.isRead,
      },
    });
  }

  async findAll() {
    return await this.prisma.notification.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return await this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        user_id: updateNotificationDto.userId,
        message: updateNotificationDto.message,
        title: updateNotificationDto.title,
        isRead: updateNotificationDto.isRead,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.notification.delete({
      where: {
        id,
      },
    });
  }

  async findMine(userId: string) {
    return await this.prisma.notification.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async latest(userId: string) {
    return await this.prisma.notification.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
  }

  async getUnreadCount(userId: string) {
    return await this.prisma.notification.count({
      where: {
        user_id: userId,
        isRead: false,
      },
    });
  }

  async getUnreadNotifications(userId: string) {
    return await this.prisma.notification.findMany({
      where: {
        user_id: userId,
        isRead: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async markRead(id: string) {
    return await this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllRead(userId: string) {
    return await this.prisma.notification.updateMany({
      where: {
        user_id: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}
