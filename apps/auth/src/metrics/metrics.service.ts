import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MetricsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const stats = await this.prisma.stats.findUnique({
      where: { id: "default" },
    });

    if (!stats) {
      await this.prisma.stats.create({
        data: {
          id: "default",
          ResponceTime: 0,
          totalrequests: 0,
          activeSessions: 0,
        },
      });
    }
  }

  async recordRequest(responseTime: number) {
    const stats = await this.prisma.stats.findUnique({
      where: { id: "default" },
    });

    if (!stats) return;

    const totalrequests = stats.totalrequests + 1;

    const averageResponseTime =
      ((stats.ResponceTime || 0) * stats.totalrequests + responseTime) /
      totalrequests;

    await this.prisma.stats.update({
      where: { id: "default" },
      data: {
        totalrequests,
        ResponceTime: averageResponseTime,
      },
    });
  }

  async incrementSession() {
    await this.prisma.stats.update({
      where: { id: "default" },
      data: {
        activeSessions: {
          increment: 1,
        },
      },
    });
  }

  async decrementSession() {
    const stats = await this.prisma.stats.findUnique({
      where: { id: "default" },
    });

    if (!stats || stats.activeSessions <= 0) {
      return;
    }

    await this.prisma.stats.update({
      where: { id: "default" },
      data: {
        activeSessions: {
          decrement: 1,
        },
      },
    });
  }

  async getMetrics() {
    const stats = await this.prisma.stats.findUnique({
      where: { id: "default" },
    });

    if (!stats) {
      return {
        ActiveSessions: 0,
        ApiResponseTime: 0,
        ServerUptime: Number((process.uptime() / 3600).toFixed(2)),
        Totalrequests: 0,
      };
    }

    return {
      ActiveSessions: stats.activeSessions,
      ApiResponseTime: Number(stats.ResponceTime.toFixed(2)),
      ServerUptime: Number((process.uptime() / 3600).toFixed(2)),
      Totalrequests: stats.totalrequests,
    };
  }
}
