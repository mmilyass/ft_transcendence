import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserStatDto } from "./user-stats.controller";

@Injectable()
export class UserStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserStatDto: CreateUserStatDto) {
    return this.prisma.userStats.upsert({
      where: {
        user_id: createUserStatDto.user_id,
      },
      update: {
        ...createUserStatDto,
      },
      create: {
        ...createUserStatDto,
      },
    });
  }

  async findAll() {
    return this.prisma.userStats.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.userStats.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.userStats.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, updateUserStatDto: Partial<CreateUserStatDto>) {
    return this.prisma.userStats.update({
      where: {
        id,
      },
      data: updateUserStatDto,
    });
  }

  async remove(id: string) {
    return this.prisma.userStats.delete({
      where: {
        id,
      },
    });
  }
}
