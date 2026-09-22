import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Role } from "@prisma/client";
import { MetricsService } from "../metrics/metrics.service";
import { RabbitMqService } from "src/rabbitmq/rabbitmq.service";

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private metricsService: MetricsService,
    private readonly rabbitMqService: RabbitMqService,
  ) {}

  async getDashboard() {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const totalUsers = await this.prisma.user.count();
    const totalDoctors = await this.prisma.doctor.count();
    const pendingDoctorApprovals = await this.prisma.user.count({
      where: { role: Role.PENDING_DOCTOR },
    });
    const stats = await this.prisma.stats.findFirst();

    const usersThisMonth = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: startOfThisMonth,
        },
      },
    });

    const usersLastMonth = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    let monthlyGrowth = 0;

    if (usersLastMonth > 0) {
      monthlyGrowth =
        ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100;
    }
    const result = await this.metricsService.getMetrics();
    const newlyDoctors = await this.prisma.user.count({
      where: {
        role: Role.DOCTOR,
        createdAt: {
          gte: startOfThisMonth,
        },
      },
    });
    return {
      message: "Welcome to the Admin Dashboard",
      stats: {
        TotalUsers: totalUsers,
        TotalDoctors: totalDoctors,
        PendingPatients: await this.prisma.user.count({
          where: { role: Role.USER, verified: false },
        }),
        PendingDoctorApprovals: pendingDoctorApprovals,
        MonthlyGrowth: Number(monthlyGrowth.toFixed(2)),
        TotalAppointments: stats?.TotalAppointments || 0,
        ActiveDoctors: stats?.ActiveDoctors || 0,
        SystemHealth: stats?.SystemHealth || 0,
        ServerUptime: result?.ServerUptime || 0,
        ApiResponseTime: result?.ApiResponseTime || 0,
        ActiveSessions: result?.ActiveSessions || 0,
        NewlyOnboardedDoctors: newlyDoctors,
      },
    };
  }

  async getDoctorApplications(page = 1, limit = 10, role?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    switch (role) {
      case "pending":
        where.role = Role.PENDING_DOCTOR;
        break;

      case "approved":
        where.role = Role.DOCTOR;
        break;

      case "rejected":
        where.role = Role.REJECTED;
        break;

      default:
        where.role = {
          in: [Role.PENDING_DOCTOR, Role.DOCTOR, Role.REJECTED],
        };
        break;
    }

    const [applications, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where,
        include: {
          doctor: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.user.count({
        where,
      }),
    ]);
    return {
      applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDoctorApplicationSummary() {
    const newSubmissions = await this.prisma.user.count({
      where: {
        role: Role.PENDING_DOCTOR,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const approved = await this.prisma.user.count({
      where: {
        role: Role.DOCTOR,
      },
    });

    const rejected = await this.prisma.user.count({
      where: {
        role: Role.REJECTED,
      },
    });

    const verifiedRate =
      approved + rejected > 0
        ? Math.round((approved / (approved + rejected)) * 100)
        : 0;

    const reviewedDoctors = await this.prisma.doctor.findMany({
      where: {
        user: {
          role: {
            in: [Role.DOCTOR, Role.REJECTED],
          },
        },
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    const averageResponseTime =
      reviewedDoctors.length === 0
        ? 0
        : reviewedDoctors.reduce(
            (sum, doctor) =>
              sum + (doctor.updatedAt.getTime() - doctor.createdAt.getTime()),
            0,
          ) / reviewedDoctors.length;
    return {
      newSubmissions,
      averageResponseTime: averageResponseTime,
      verifiedRate,
    };
  }

  async approveDoctor(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { user_id: id },
      include: { user: true },
    });
    if (!doctor || !doctor.user.verified) {
      return {
        message: `Doctor with ID ${id} not found or not verified.`,
        status: "error",
      };
    }
    if (doctor.user.role === Role.DOCTOR) {
      return {
        message: `Doctor with ID ${id} is already approved.`,
        status: "error",
      };
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: doctor.user_id },
        data: { role: Role.DOCTOR },
      });

      await tx.doctor.update({
        where: { user_id: id },
        data: {
          verified: true,
          user: {
            update: {
              verified: true,
            },
          },
        },
      });

      await tx.auditlog.create({
        data: {
          user_id: doctor.user_id,
          action: `Doctor ${doctor.user.name} approved`,
        },
      });

      await tx.notification.create({
        data: {
          user_id: doctor.user_id,
          message:
            "Congratulations! Your doctor application has been approved. You can now access all the features available to doctors.",
          title: "Doctor Application Approved",
          isRead: false,
        },
      });

      const stats = await tx.stats.findFirst();
      if (stats) {
        await tx.stats.update({
          where: { id: stats?.id },
          data: {
            ActiveDoctors: {
              increment: 1,
            },
          },
        });
      }

      return user;
    });

    this.rabbitMqService.emit("doctor.created", {
      id: doctor.user.id,
      userId: doctor.user.id,
      doctorId: doctor.id,
      email: doctor.user.email,
      name: doctor.user.name,
    });

    this.rabbitMqService.emit("doctor.approved", {
      id: doctor.user.id,
      userId: doctor.user.id,
      doctorId: doctor.id,
      email: doctor.user.email,
      name: doctor.user.name,
    });

    return {
      message: `Doctor with ID ${id} approved.`,
      status: "approved",
      doctor: updatedUser,
    };
  }

  async rejectDoctor(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { user_id: id },
      include: { user: true },
    });

    if (!doctor) {
      return { message: `Doctor with ID ${id} not found.`, status: "error" };
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: doctor.user_id },
        data: { role: Role.REJECTED },
      });

      await tx.auditlog.create({
        data: {
          user_id: doctor.user_id,
          action: `Doctor ${doctor.user.name} rejected`,
        },
      });

      await tx.notification.create({
        data: {
          user_id: doctor.user_id,
          message: `We regret to inform you that your doctor application has been rejected. Please review the feedback provided and consider reapplying in the future.`,
          title: "Doctor Application Rejected",
          isRead: false,
        },
      });
      return user;
    });

    this.rabbitMqService.emit("doctor.rejected", {
      id: doctor.user_id,
      doctorId: doctor.id,
      email: doctor.user.email,
      name: doctor.user.name,
    });
    return {
      message: `Doctor with ID ${id} rejected.`,
      status: "rejected",
      doctor: updatedUser,
    };
  }

  async activateDoctor(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { user_id: id },
      include: { user: true },
    });

    if (!doctor) {
      return { message: `Doctor with ID ${id} not found.`, status: "error" };
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: doctor.user_id },
        data: { role: Role.DOCTOR },
      });

      await tx.doctor.update({
        where: { user_id: id },
        data: {
          verified: true,
        },
      });

      const stats = await tx.stats.findFirst();
      if (stats) {
        await tx.stats.update({
          where: { id: stats?.id },
          data: {
            ActiveDoctors: {
              increment: 1,
            },
          },
        });
      }

      await tx.auditlog.create({
        data: {
          user_id: doctor.user_id,
          action: `Doctor ${doctor.user.name} activated`,
        },
      });

      await tx.notification.create({
        data: {
          user_id: doctor.user_id,
          message: `Your account has been activated. You can now access all the features available to doctors.`,
          title: "Doctor Account Activated",
          isRead: false,
        },
      });

      return user;
    });

    this.rabbitMqService.emit("doctor.created", {
      id: doctor.user_id,
      doctorId: doctor.id,
      email: doctor.user.email,
      name: doctor.user.name,
      speciality: doctor.speciality,
      bio: doctor.bio,
      experience: doctor.experience,
      rating: doctor.rating,
      TotalPatients: doctor.totalPatients,
    });
    return {
      message: `Doctor with ID ${id} activated.`,
      status: "active",
      doctor: updatedUser,
    };
  }

  async getDoctorLicense(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { user_id: id },
      include: { user: true },
    });

    if (!doctor) {
      return { message: `Doctor with ID ${id} not found.`, status: "error" };
    }

    return {
      doctorId: id,
      doctorName: doctor.user.name,
      licenseNumber: doctor.license_number,
      speciality: doctor.speciality,
      verified: doctor.verified,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    };
  }

  async suspendDoctor(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { user_id: id },
      include: { user: true },
    });

    if (!doctor) {
      throw new BadRequestException({
        message: `Doctor with ID ${id} not found.`,
      });
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: doctor.user_id },
        data: { role: Role.BANNED },
      });

      await tx.auditlog.create({
        data: {
          user_id: doctor.user_id,
          action: `Doctor ${doctor.user.name} suspended`,
        },
      });

      await tx.notification.create({
        data: {
          user_id: doctor.user_id,
          message: `Your account has been suspended. Please contact support for more information.`,
          title: "Doctor Account Suspended",
          isRead: false,
        },
      });
      const stats = await tx.stats.findFirst();
      if (stats) {
        await tx.stats.update({
          where: { id: stats?.id },
          data: {
            ActiveDoctors: {
              decrement: 1,
            },
          },
        });
      }
      return user;
    });

    this.rabbitMqService.emit("doctor.suspended", {
      id: doctor.user_id,
      doctorId: doctor.id,
      email: doctor.user.email,
      name: doctor.user.name,
    });

    return {
      message: `Doctor with ID ${id} suspended.`,
      status: "suspended",
      doctor: updatedUser,
    };
  }

  async getAllUsers(page = 1, limit = 10, search?: string, role?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: {
        notIn: [Role.ADMIN, Role.PENDING_DOCTOR, Role.REJECTED],
      },
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (role && Object.values(Role).includes(role as Role)) {
      where.role = role as Role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          verified: true,
          createdAt: true,
          image: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async disableUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return { message: `User with ID ${id} not found.`, status: "error" };
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: { verified: false },
      });

      await tx.auditlog.create({
        data: {
          user_id: id,
          action: `User ${user.name} disabled`,
        },
      });

      await tx.notification.create({
        data: {
          user_id: id,
          message: `Your account has been disabled. Please contact support for more information.`,
          title: "Account Disabled",
          isRead: false,
        },
      });

      const stats = await tx.stats.findFirst();
      if (stats) {
        await tx.stats.update({
          where: { id: stats?.id },
          data: {
            TotalUsers: {
              decrement: 1,
            },
          },
        });
      }
      return user;
    });
    this.rabbitMqService.emit("user.disabled", {
      id: id,
      email: user.email,
      name: user.name,
    });
    return {
      message: `User with ID ${id} disabled.`,
      status: "disabled",
      user: updatedUser,
    };
  }

  async activateUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return { message: `User with ID ${id} not found.`, status: "error" };
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: { role: Role.USER, verified: true },
      });

      await tx.auditlog.create({
        data: {
          user_id: id,
          action: `User ${user.name} activated`,
        },
      });

      await tx.notification.create({
        data: {
          user_id: id,
          message: `Your account has been activated. You can now access all the features available to users.`,
          title: "Account Activated",
          isRead: false,
        },
      });

      const stats = await tx.stats.findFirst();
      if (stats) {
        await tx.stats.update({
          where: { id: stats?.id },
          data: {
            TotalUsers: {
              increment: 1,
            },
          },
        });
      }
      return user;
    });

    this.rabbitMqService.emit("user.activated", {
      id: id,
      email: user.email,
      name: user.name,
    });
    return {
      message: `User with ID ${id} activated.`,
      status: "active",
      user: updatedUser,
    };
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return { message: `User with ID ${id} not found.`, status: "error" };
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.auditlog.create({
        data: {
          user_id: id,
          action: `User ${user.name} deleted`,
        },
      });

      await tx.doctorPatient.deleteMany({ where: { patient_id: id } });
      if (user.role === Role.DOCTOR) {
        await tx.doctor.delete({ where: { user_id: id } });
      }
      await tx.notification.deleteMany({ where: { user_id: id } });
      await tx.user.delete({ where: { id } });

      const stats = await tx.stats.findFirst();
      if (stats) {
        await tx.stats.update({
          where: { id: stats?.id },
          data: {
            TotalUsers: {
              decrement: 1,
            },
          },
        });
      }
    });
    this.rabbitMqService.emit("user.deleted", {
      id: id,
      email: user.email,
      name: user.name,
    });
    return {
      message: `User with ID ${id} deleted.`,
      status: "deleted",
    };
  }

  async banUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return { message: `User with ID ${id} not found.`, status: "error" };
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: { role: Role.BANNED },
      });

      await tx.auditlog.create({
        data: {
          user_id: id,
          action: `User ${user.name} banned`,
        },
      });

      const stats = await tx.stats.findFirst();
      if (stats) {
        await tx.stats.update({
          where: { id: stats?.id },
          data: {
            TotalUsers: {
              decrement: 1,
            },
          },
        });
      }

      return user;
    });
    this.rabbitMqService.emit("user.banned", {
      id: id,
      email: user.email,
      name: user.name,
    });
    return {
      message: `User with ID ${id} banned.`,
      status: "banned",
      user: updatedUser,
    };
  }

  async getAuditLogs() {
    const logs = await this.prisma.auditlog.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    return {
      logs: logs,
      total: logs.length,
    };
  }

  async getReports() {
    const stats = await this.prisma.stats.findFirst();
    const userGrowth = await this.prisma.user.count();
    const doctorGrowth = await this.prisma.doctor.count();

    return {
      reports: [
        {
          id: "1",
          title: "User Statistics",
          totalUsers: userGrowth,
          growth: stats?.MonthlyGrowth || 0,
        },
        {
          id: "2",
          title: "Doctor Statistics",
          totalDoctors: doctorGrowth,
          verified: stats?.verifiedRate || 0,
        },
        {
          id: "3",
          title: "System Health",
          uptime: stats?.ServerUptime || 0,
          responseTime: stats?.ResponceTime || 0,
        },
      ],
    };
  }

  async getUserRegistrationTrends(period: string) {
    const now = new Date();
    let startDate: Date;

    if (period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    } else {
      startDate = new Date();
      startDate.setDate(now.getDate() - 42); // 6 weeks
    }

    const users = await this.prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // MONTHLY
    if (period === "monthly") {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const result: Record<string, number> = {};

      // Initialize last 6 months with 0
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthLabel = monthNames[date.getMonth()];
        result[monthLabel] = 0;
      }

      // Count registrations
      users.forEach((user) => {
        const monthLabel = monthNames[user.createdAt.getMonth()];

        if (monthLabel in result) {
          result[monthLabel]++;
        }
      });

      return Object.entries(result).map(([label, count]) => ({
        label,
        count,
      }));
    }

    // WEEKLY
    const result: Record<string, number> = {
      "Week 1": 0,
      "Week 2": 0,
      "Week 3": 0,
      "Week 4": 0,
      "Week 5": 0,
      "Week 6": 0,
    };

    users.forEach((user) => {
      const diffDays = Math.floor(
        (now.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      const weekIndex = Math.floor(diffDays / 7);

      if (weekIndex >= 0 && weekIndex < 6) {
        const weekLabel = `Week ${6 - weekIndex}`;
        result[weekLabel]++;
      }
    });

    return Object.entries(result).map(([label, count]) => ({
      label,
      count,
    }));
  }

  async getRecentActivities() {
    const activities = await this.prisma.auditlog.findMany({
      orderBy: {
        timestamp: "desc",
      },
      take: 5,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return activities.map((activity) => ({
      title: activity.user?.name,
      description: activity.action,
      time: activity.timestamp,
    }));
  }

  async getActivityLogs(page = 1, limit = 20) {
    const activities = await this.prisma.auditlog.findMany({
      orderBy: {
        timestamp: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const total = await this.prisma.auditlog.count();

    return {
      activities: activities.map((activity) => ({
        title: activity.user?.name ?? "Unknown user",
        description: activity.action,
        time: activity.timestamp.toISOString(),
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}
