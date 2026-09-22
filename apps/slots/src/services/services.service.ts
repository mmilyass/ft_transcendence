import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  private async resolveDoctor(doctorIdentifier: string) {
    const doctor = await this.prisma.doctor.findFirst({
      where: {
        OR: [{ id: doctorIdentifier }, { user_id: doctorIdentifier }],
      },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    return doctor;
  }

  // create/update/remove take doctorId from the URL/body, which used to be
  // trusted with no check at all — any authenticated user could create,
  // edit, or delete services under a doctorId that wasn't their own. This
  // verifies the caller actually IS the doctor they're claiming to act as.
  private assertIsOwnDoctor(doctor: { user_id: string }, callerUserId: string) {
    if (doctor.user_id !== callerUserId) {
      throw new ForbiddenException("You can only manage your own services");
    }
  }

  async createService(
    doctorId: string,
    createServiceDto: CreateServiceDto,
    callerUserId: string,
  ) {
    const doctor = await this.resolveDoctor(doctorId);
    this.assertIsOwnDoctor(doctor, callerUserId);

    const category = await this.prisma.category.findUnique({
      where: { id: createServiceDto.category_id },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return await this.prisma.service.create({
      data: {
        name: createServiceDto.name,
        price: createServiceDto.price,
        duration: createServiceDto.duration,
        category_id: createServiceDto.category_id,
        description: createServiceDto.description,
        doctor_id: doctor.id,
      },
      include: {
        category: true,
        doctor: true,
      },
    });
  }

  async findAllServices(doctorId: string) {
    const doctor = await this.resolveDoctor(doctorId);

    return await this.prisma.service.findMany({
      where: {
        doctor_id: doctor.id,
      },
      include: {
        category: true,
        doctor: true,
      },
    });
  }

  async findServiceById(doctorId: string, serviceId: string) {
    const doctor = await this.resolveDoctor(doctorId);

    const service = await this.prisma.service.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        category: true,
        doctor: true,
      },
    });

    if (!service || service.doctor_id !== doctor.id) {
      throw new NotFoundException("Service not found");
    }

    return service;
  }

  async updateService(
    doctorId: string,
    serviceId: string,
    updateServiceDto: UpdateServiceDto,
    callerUserId: string,
  ) {
    const doctor = await this.resolveDoctor(doctorId);
    this.assertIsOwnDoctor(doctor, callerUserId);

    const service = await this.prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service || service.doctor_id !== doctor.id) {
      throw new NotFoundException("Service not found");
    }

    const { category_id, ...rest } = updateServiceDto;

    if (category_id) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: category_id,
        },
      });

      if (!category) {
        throw new NotFoundException("Category not found");
      }
    }

    return await this.prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        ...rest,
        ...(category_id && { category: { connect: { id: category_id } } }),
      },
      include: {
        category: true,
        doctor: true,
      },
    });
  }

  async removeService(
    doctorId: string,
    serviceId: string,
    callerUserId: string,
  ) {
    const doctor = await this.resolveDoctor(doctorId);
    this.assertIsOwnDoctor(doctor, callerUserId);

    const service = await this.prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service || service.doctor_id !== doctor.id) {
      throw new NotFoundException("Service not found");
    }

    return await this.prisma.service.delete({
      where: {
        id: serviceId,
      },
    });
  }
}
