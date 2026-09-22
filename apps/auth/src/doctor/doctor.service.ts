import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDoctorDto } from "./dto/createDoctor.dto";
import { GetDoctorsDto } from "./dto/GetDoctorsDto.dto";
import { DoctorLocation } from "src/doctor-location/type";
import { RabbitMqService } from "src/rabbitmq/rabbitmq.service";

@Injectable()
export class DoctorService {
  constructor(
    private prisma: PrismaService,
    private readonly rabbitMQService: RabbitMqService,
  ) {}

  async create(body: CreateDoctorDto, userId: string) {
    await this.prisma.doctor.create({
      data: {
        speciality: body.speciality,
        bio: body.bio,
        license_number: body.license_number,
        languages: body.languages,
        medical_license_url: body.medical_license_url,

        location: {
          create: {
            address: body.location.address,
            city: body.location.city,
            state: body.location.state,
            zip_code: body.location.zip_code,
            country: body.location.country,
            latitude: body.location.latitude ?? 0,
            longitude: body.location.longitude ?? 0,
          },
        },

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.doctor.findMany({
      where: {
        verified: true,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
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
        },
        location: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async update(id: string, data: Partial<CreateDoctorDto>) {
    const { location, ...rest } = data;
    await this.prisma.auditlog.create({
      data: {
        action: "Dr Profile Updated",
        user_id: id,
        timestamp: new Date(),
      },
    });
    return await this.prisma.doctor.update({
      where: { id },
      data: {
        ...rest,
        ...(location && {
          location: {
            create: {
              address: location.address,
              city: location.city,
              state: location.state,
              zip_code: location.zip_code,
              country: location.country,
              latitude: location.latitude ?? 0,
              longitude: location.longitude ?? 0,
            },
          },
        }),
      },
    });
  }

  async remove(id: string) {
    await this.prisma.auditlog.create({
      data: {
        action: "Dr Profile Deleted",
        user_id: id,
        timestamp: new Date(),
      },
    });
    return this.prisma.doctor.delete({ where: { id } });
  }

  async search(specialty: string, location: DoctorLocation) {
    return await this.prisma.doctor.findMany({
      where: {
        speciality: specialty,
        location: {
          some: {
            city: location.city,
            state: location.state,
            country: location.country,
          },
        },
        verified: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findFeatured() {
    return await this.prisma.doctor.findMany({
      where: {
        verified: true,
      },
      orderBy: {
        score: "desc",
      },
      select: {
        id: true,
        rating: true,
        score: true,
        speciality: true,
        verified: true,
        location: {
          select: {
            address: true,
            city: true,
            state: true,
            country: true,
            zip_code: true,
            latitude: true,
            longitude: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
          },
        },
      },
    });
  }
  async approve(id: string) {
    return await this.prisma.doctor.update({
      where: { id },
      data: { verified: true, user: { update: { verified: true } } },
    });
  }

  async getDoctors(query: GetDoctorsDto) {
    const { search, location, page = 1 } = query;

    const limit = 12;
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search
          ? {
              OR: [
                {
                  user: {
                    name: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
                {
                  speciality: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {},
        location
          ? {
              location: {
                some: {
                  OR: [
                    {
                      city: {
                        contains: location,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      state: {
                        contains: location,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      country: {
                        contains: location,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      address: {
                        contains: location,
                        mode: "insensitive" as const,
                      },
                    },
                  ],
                },
              },
            }
          : {},
      ],
    };

    const [doctors, total] = await Promise.all([
      this.prisma.doctor.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          location: true,
        },
        orderBy: [
          {
            score: "desc",
          },
          {
            rating: "desc",
          },
        ],
        skip,
        take: limit,
      }),

      this.prisma.doctor.count({
        where,
      }),
    ]);

    return {
      doctors: doctors.map((doctor) => ({
        id: doctor.id,
        name: doctor.user.name,
        image: doctor.user.image,
        speciality: doctor.speciality,
        experience: doctor.experience,
        rating: Number(doctor.rating.toFixed(1)),
        reviewCount: doctor.reviewCount,
        location: doctor.location,
        score: doctor.score,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateDoctorScore(doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return;
    }

    const score =
      doctor.rating * 40 +
      Math.log10(doctor.totalPatients + 1) * 20 +
      Math.log10(doctor.totalAppointments + 1) * 30 +
      doctor.experience * 2;

    await this.prisma.doctor.update({
      where: { id: doctorId },
      data: {
        score,
      },
    });
  }

  async getSpecialties() {
    const specialties = await this.prisma.doctor.findMany({
      distinct: ["speciality"],
      select: {
        speciality: true,
      },
    });

    return specialties.map((s) => s.speciality);
  }

  async findMyData(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { user_id: id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return {
      id: doctor.id,
      speciality: doctor.speciality,
      user: {
        name: doctor.user.name,
        image: doctor.user.image,
      },
    };
  }

  async updateProfessionalInfo(userId: string, data: Partial<CreateDoctorDto>) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { user_id: userId },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const { location, ...rest } = data;
    const responce = await this.prisma.$transaction(async (tx) => {
      const result = await tx.doctor.update({
        where: { id: doctor.id },
        data: {
          ...rest,
          ...(location && {
            location: {
              create: {
                address: location.address,
                city: location.city,
                state: location.state,
                zip_code: location.zip_code,
                country: location.country,
                latitude: location.latitude ?? 0,
                longitude: location.longitude ?? 0,
              },
            },
          }),
        },
      });
      await tx.auditlog.create({
        data: {
          action: "Dr Profile Updated",
          user_id: userId,
          timestamp: new Date(),
        },
      });
      return result;
    });

    this.rabbitMQService.emit("doctor.updated", {
      doctorId: doctor.id,
      userId: userId,
      updatedFields: Object.keys(data),
    });
    return responce;
  }

  async updateProfile(userId: string, data: Partial<CreateDoctorDto>) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { user_id: userId },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const { location, ...rest } = data;
    const responce = await this.prisma.$transaction(async (tx) => {
      const result = await tx.doctor.update({
        where: { id: doctor.id },
        data: {
          ...rest,
          ...(location && {
            location: {
              create: {
                address: location.address,
                city: location.city,
                state: location.state,
                zip_code: location.zip_code,
                country: location.country,
                latitude: location.latitude ?? 0,
                longitude: location.longitude ?? 0,
              },
            },
          }),
        },
      });
      await tx.auditlog.create({
        data: {
          action: "Dr Profile Updated",
          user_id: userId,
          timestamp: new Date(),
        },
      });
      return result;
    });

    this.rabbitMQService.emit("doctor.updated", {
      doctorId: doctor.id,
      userId: userId,
      updatedFields: Object.keys(data),
    });
    return responce;
  }
}
