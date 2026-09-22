import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSlotsDto } from "./dto/create-slots.dto";
import { UpdateSlotDto } from "./dto/update-slots.dto";
import { BookServiceSlotDto } from "./dto/book-service-slot.dto";
import { Prisma } from "@prisma/client";
import { RabbitMqService } from "../rabbitmq/rabbitmq.service";

const REMINDER_LEAD_TIME_MINUTES = 30;
const REMINDER_POLL_INTERVAL_MS = 60_000;

@Injectable()
export class SlotsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SlotsService.name);
  private reminderInterval?: ReturnType<typeof setInterval>;

  constructor(
    private prisma: PrismaService,
    private readonly rabbitMqService: RabbitMqService,
  ) {}

  onModuleInit() {
    this.reminderInterval = setInterval(() => {
      this.sendDueAppointmentReminders().catch((error) =>
        this.logger.error("Reminder sweep failed", error),
      );
    }, REMINDER_POLL_INTERVAL_MS);
  }

  onModuleDestroy() {
    if (this.reminderInterval) clearInterval(this.reminderInterval);
  }

  private async sendDueAppointmentReminders() {
    const now = new Date();
    const windowEnd = new Date(
      now.getTime() + REMINDER_LEAD_TIME_MINUTES * 60_000,
    );

    const candidates = await this.prisma.slots.findMany({
      where: {
        status: "BOOKED",
        reminder_sent: false,
        date: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          lte: windowEnd,
        },
      },
      include: { doctor: { include: { user: true } }, user: true },
    });

    for (const slot of candidates) {
      const startDateTime = this.combineDateAndTime(slot.date, slot.start_time);
      if (startDateTime < now || startDateTime > windowEnd) continue;
      if (!slot.user || !slot.doctor?.user) continue;

      const claimed = await this.prisma.slots.updateMany({
        where: { id: slot.id, reminder_sent: false },
        data: { reminder_sent: true },
      });
      if (claimed.count === 0) continue;

      this.rabbitMqService.emit("appointment.reminder", {
        userId: slot.user.id,
        doctorId: slot.doctor.user.id,
        patientEmail: slot.user.email,
        patientName: slot.user.name,
        doctorEmail: slot.doctor.user.email,
        doctorName: slot.doctor.user.name,
        appointmentTime: `${this.toLocalDateStr(slot.date)} ${slot.start_time}`,
      });
    }
  }

  private async emitAppointmentEvent(pattern: string, appointmentId: string) {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { doctor: { include: { user: true } }, user: true },
      });

      if (!appointment || !appointment.user || !appointment.doctor?.user) {
        this.logger.warn(
          `Skipped emitting ${pattern} for appointment ${appointmentId}: missing patient/doctor relation`,
        );
        return;
      }

      this.rabbitMqService.emit(pattern, {
        userId: appointment.user.id,
        doctorId: appointment.doctor.user.id,
        patientEmail: appointment.user.email,
        patientName: appointment.user.name,
        doctorEmail: appointment.doctor.user.email,
        doctorName: appointment.doctor.user.name,
        appointmentTime: `${this.toLocalDateStr(appointment.date)} ${appointment.start_time}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to emit ${pattern} for appointment ${appointmentId}`,
        error,
      );
    }
  }

  private async getDoctorByUserId(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { user_id: userId },
    });

    if (doctor) return doctor;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(
        "User not found locally — auth sync may not have run yet",
      );
    }

    throw new NotFoundException(
      "Doctor profile not synced yet. Please wait a moment and retry.",
    );
  }

  /** Parse a "YYYY-MM-DD" string as local midnight (avoids UTC shift bug). */
  private parseLocalDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  /** Format a Date to "YYYY-MM-DD" using local time (avoids toISOString() UTC shift). */
  private toLocalDateStr(date: Date): string {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  private parseTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new BadRequestException("Invalid time format. Expected HH:MM");
    }

    return hours * 60 + minutes;
  }

  private minutesToTime(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  private combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  }

  private async mergeDoctorAvailableSlots(
    tx: Prisma.TransactionClient | PrismaService,
    doctorId: string,
    date: Date,
  ) {
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const nextDay = new Date(dateOnly);
    nextDay.setDate(dateOnly.getDate() + 1);

    const slots = await tx.slots.findMany({
      where: {
        doctor_id: doctorId,
        date: { gte: dateOnly, lt: nextDay },
        is_booked: false,
        status: "AVAILABLE",
      },
      orderBy: { start_time: "asc" },
    });

    if (slots.length <= 1) return;

    let currentSlot = slots[0];

    for (let i = 1; i < slots.length; i++) {
      const nextSlot = slots[i];
      const currentEndMinutes = this.parseTimeToMinutes(currentSlot.end_time);
      const nextStartMinutes = this.parseTimeToMinutes(nextSlot.start_time);
      const nextEndMinutes = this.parseTimeToMinutes(nextSlot.end_time);

      if (nextStartMinutes <= currentEndMinutes) {
        const newEndMinutes = Math.max(currentEndMinutes, nextEndMinutes);
        const newEndTimeStr = this.minutesToTime(newEndMinutes);

        currentSlot = await tx.slots.update({
          where: { id: currentSlot.id },
          data: { end_time: newEndTimeStr },
        });

        await tx.slots.delete({
          where: { id: nextSlot.id },
        });
      } else {
        currentSlot = nextSlot;
      }
    }
  }

    async generateSlots(doctorId: string, dto: CreateSlotsDto) {
  const { start_date, number_of_days, shifts } = dto;

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = this.parseLocalDate(start_date);
  if (startDate < today) {
    throw new BadRequestException("Start date cannot be in the past");
  }

  return await this.prisma.$transaction(async (tx) => {
    await tx.slots.deleteMany({
      where: {
        doctor_id: doctorId,
        is_booked: false,
        date: { gte: startDate },
      },
    });

    const slotsToCreate: Prisma.SlotsCreateManyInput[] = [];

    for (let d = 0; d < number_of_days; d++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + d);

      const dateOnly = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
      );

      const existingBookings = await tx.slots.findMany({
        where: {
          doctor_id: doctorId,
          date: dateOnly,
          is_booked: true,
        },
        orderBy: { start_time: "asc" },
      });

      for (const shift of shifts) {
        const shiftStartMin = this.parseTimeToMinutes(shift.start_hour);
        const shiftEndMin = this.parseTimeToMinutes(shift.end_hour);

        if (shiftStartMin >= shiftEndMin) {
          throw new BadRequestException(
            "End time must be after start time in shifts",
          );
        }

        let availableWindows = [{ start: shiftStartMin, end: shiftEndMin }];

        for (const booking of existingBookings) {
          const bookStartMin = this.parseTimeToMinutes(booking.start_time);
          const bookEndMin = this.parseTimeToMinutes(booking.end_time);

          const nextWindows: { start: number; end: number }[] = [];

          for (const window of availableWindows) {
            if (bookStartMin < window.end && bookEndMin > window.start) {
              if (window.start < bookStartMin) {
                nextWindows.push({ start: window.start, end: bookStartMin });
              }
              if (window.end > bookEndMin) {
                nextWindows.push({ start: bookEndMin, end: window.end });
              }
            } else {
              nextWindows.push(window);
            }
          }
          availableWindows = nextWindows;
        }

        for (const window of availableWindows) {
          const startStr = this.minutesToTime(window.start);
          const endStr = this.minutesToTime(window.end);
          const shiftEnd = this.combineDateAndTime(day, endStr);

          const status = shiftEnd <= now ? "UNAVAILABLE" : "AVAILABLE";

          slotsToCreate.push({
            doctor_id: doctorId,
            date: dateOnly,
            start_time: startStr,
            end_time: endStr,
            is_booked: false,
            status: status,
          });
        }
      }
    }

    const created = await tx.slots.createMany({
      data: slotsToCreate,
      skipDuplicates: true,
    });

    for (let d = 0; d < number_of_days; d++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + d);
      await this.mergeDoctorAvailableSlots(tx, doctorId, day);
    }

    return { created: created.count };
  });
}

  async getAvailableWindowsForService(
    doctorId: string,
    serviceId: string,
    dateStr: string,
  ) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) throw new NotFoundException("Service not found");
    if (service.doctor_id !== doctorId) {
      throw new BadRequestException("Service does not belong to this doctor");
    }

    const date = this.parseLocalDate(dateStr);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const shiftBlocks = await this.prisma.slots.findMany({
      where: {
        doctor_id: doctorId,
        date: { gte: date, lt: nextDay },
        status: "AVAILABLE",
        is_booked: false,
      },
      orderBy: { start_time: "asc" },
    });

    const serviceDurationMinutes = service.duration;
    const windows: { start_time: string; end_time: string; slot_id: string }[] =
      [];

    const now = new Date();
    const todayStr = this.toLocalDateStr(now);
    const isToday = dateStr === todayStr;
    const currentMinutesNow = now.getHours() * 60 + now.getMinutes();

    for (const block of shiftBlocks) {
      let currentMinutes = this.parseTimeToMinutes(block.start_time);
      const blockEndMinutes = this.parseTimeToMinutes(block.end_time);

      while (currentMinutes + serviceDurationMinutes <= blockEndMinutes) {
        if (isToday && currentMinutes < currentMinutesNow) {
          currentMinutes += serviceDurationMinutes;
          continue;
        }

        const windowStartStr = this.minutesToTime(currentMinutes);
        const windowEndStr = this.minutesToTime(
          currentMinutes + serviceDurationMinutes,
        );

        windows.push({
          start_time: windowStartStr,
          end_time: windowEndStr,
          slot_id: block.id,
        });

        currentMinutes += serviceDurationMinutes;
      }
    }

    return {
      date: dateStr,
      service_id: serviceId,
      available: windows.length > 0,
      windows,
    };
  }

  async generateSlotsForCurrentDoctor(userId: string, dto: CreateSlotsDto) {
    const doctor = await this.getDoctorByUserId(userId);
    return await this.generateSlots(doctor.id, dto);
  }

  findAll() {
    return this.prisma.slots.findMany({
      orderBy: [{ date: "asc" }, { start_time: "asc" }],
    });
  }

  findOneSlot(id: string) {
    return this.prisma.slots.findUnique({ where: { id } });
  }

  findByDoctorId(doctorId: string) {
    return this.prisma.slots.findMany({
      where: { doctor_id: doctorId },
      orderBy: [{ date: "asc" }, { start_time: "asc" }],
    });
  }

  async updateSlot(id: string, dto: UpdateSlotDto, doctorId?: string) {
    const slot = await this.prisma.slots.findUnique({ where: { id } });

    if (!slot) throw new NotFoundException("Slot not found");

    if (doctorId && slot.doctor_id !== doctorId) {
      throw new ForbiddenException("You can only modify your own slots");
    }

    if (slot.is_booked || slot.status === "BOOKED") {
      throw new BadRequestException("Booked slots cannot be modified");
    }

    const data: Prisma.SlotsUpdateInput = {};
    if (dto.date) data.date = this.parseLocalDate(dto.date);
    if (dto.start_time) data.start_time = dto.start_time;
    if (dto.end_time) data.end_time = dto.end_time;

    const updated = await this.prisma.slots.update({ where: { id }, data });

    if (slot.doctor_id) {
      await this.mergeDoctorAvailableSlots(
        this.prisma,
        slot.doctor_id,
        updated.date,
      );
    }

    return updated;
  }

  async deleteSlot(id: string, doctorId?: string) {
    const slot = await this.prisma.slots.findUnique({ where: { id } });

    if (!slot) throw new NotFoundException("Slot not found");

    if (doctorId && slot.doctor_id !== doctorId) {
      throw new ForbiddenException("You can only delete your own slots");
    }

    if (slot.is_booked || slot.status === "BOOKED") {
      throw new BadRequestException("Booked slot cannot be deleted");
    }

    await this.prisma.slots.delete({ where: { id } });
    return { success: true };
  }

  async findCurrentDoctorSlots(userId: string) {
    const doctor = await this.getDoctorByUserId(userId);
    return this.findByDoctorId(doctor.id);
  }

  async clearCurrentDoctorSlots(userId: string) {
    const doctor = await this.getDoctorByUserId(userId);
    return this.clearDoctorSlots(doctor.id);
  }

  async updateCurrentDoctorSlot(
    userId: string,
    id: string,
    dto: UpdateSlotDto,
  ) {
    const doctor = await this.getDoctorByUserId(userId);
    return this.updateSlot(id, dto, doctor.id);
  }

  async deleteCurrentDoctorSlot(userId: string, id: string) {
    const doctor = await this.getDoctorByUserId(userId);
    return this.deleteSlot(id, doctor.id);
  }

  async releaseCurrentDoctorSlot(userId: string, id: string) {
    const doctor = await this.getDoctorByUserId(userId);
    const slot = await this.prisma.slots.findUnique({ where: { id } });

    if (!slot) {
      throw new NotFoundException("Slot not found");
    }

    if (slot.doctor_id !== doctor.id) {
      throw new ForbiddenException("You can only modify your own slots");
    }

    if (slot.status !== "BOOKED" && slot.is_booked !== true) {
      throw new BadRequestException("Only booked slots can be released");
    }

    const appointment = await this.findAppointmentForReservedSlot(slot);
    if (appointment) {
      await this.prisma.appointment.update({
        where: { id: appointment.id },
        data: { status: "CANCELLED" },
      });
      await this.emitAppointmentEvent("appointment.canceled", appointment.id);
    }

    const released = await this.prisma.slots.update({
      where: { id },
      data: {
        is_booked: false,
        status: "AVAILABLE",
        user_id: null,
        service_id: null,
        reminder_sent: false,
      },
    });

    await this.mergeDoctorAvailableSlots(this.prisma, doctor.id, released.date);
    return released;
  }

  async bookSlot(id: string) {
    const slot = await this.prisma.slots.findUnique({ where: { id } });
    if (!slot) throw new NotFoundException("Slot not found");

    const slotStart = this.combineDateAndTime(slot.date, slot.start_time);
    if (slotStart < new Date()) {
      throw new BadRequestException("Past slots cannot be booked");
    }

    const result = await this.prisma.slots.updateMany({
      where: { id, is_booked: false, status: { not: "BOOKED" } },
      data: { is_booked: true, status: "BOOKED" },
    });

    if (result.count === 0) {
      throw new BadRequestException("Slot is already booked");
    }

    const updated = await this.prisma.slots.findUnique({ where: { id } });
    return { success: true, slot: updated };
  }

  async clearDoctorSlots(doctorId: string) {
    const result = await this.prisma.slots.deleteMany({
      where: {
        doctor_id: doctorId,
        is_booked: false,
        status: { notIn: ["BOOKED", "COMPLETED"] },
      },
    });
    return { deleted: result.count };
  }

  async findCurrentUserBookings(userId: string) {
    return this.prisma.appointment.findMany({
      where: {
        user_id: userId,
        status: { in: ["BOOKED", "COMPLETED", "CANCELLED"] },
      },
      include: {
        doctor: { include: { user: true } },
        service: true,
      },
      orderBy: [{ date: "asc" }, { start_time: "asc" }],
    });
  }

  async findCurrentDoctorBookings(userId: string) {
    const doctor = await this.getDoctorByUserId(userId);
    return this.prisma.appointment.findMany({
      where: {
        doctor_id: doctor.id,
        status: { in: ["BOOKED", "COMPLETED", "CANCELLED"] },
      },
      include: {
        user: true,
        service: true,
      },
      orderBy: [{ date: "asc" }, { start_time: "asc" }],
    });
  }

  async findNextSessionForCurrentUser(userId: string) {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const doctor = await this.prisma.doctor.findUnique({
      where: { user_id: userId },
    });

    if (doctor) {
      const upcoming = await this.prisma.slots.findMany({
        where: {
          doctor_id: doctor.id,
          status: "BOOKED",
          date: { gte: todayStart },
        },
        include: { user: true, service: true },
        orderBy: [{ date: "asc" }, { start_time: "asc" }],
        take: 20,
      });

      const next = upcoming.find(
        (slot) => this.combineDateAndTime(slot.date, slot.start_time) >= now,
      );

      if (!next || !next.user) return null;

      return {
        viewerRole: "DOCTOR" as const,
        date: this.combineDateAndTime(next.date, next.start_time).toISOString(),
        serviceName: next.service?.name ?? null,
        with: {
          id: next.user.id,
          name: next.user.name,
          email: next.user.email,
        },
      };
    }

    const upcoming = await this.prisma.slots.findMany({
      where: {
        user_id: userId,
        status: "BOOKED",
        date: { gte: todayStart },
      },
      include: { doctor: { include: { user: true } }, service: true },
      orderBy: [{ date: "asc" }, { start_time: "asc" }],
      take: 20,
    });

    const next = upcoming.find(
      (slot) => this.combineDateAndTime(slot.date, slot.start_time) >= now,
    );

    if (!next || !next.doctor?.user) return null;

    return {
      viewerRole: "PATIENT" as const,
      date: this.combineDateAndTime(next.date, next.start_time).toISOString(),
      serviceName: next.service?.name ?? null,
      with: {
        id: next.doctor.user.id,
        doctorId: next.doctor.id,
        name: next.doctor.user.name,
        email: next.doctor.user.email,
      },
    };
  }

  private async findReservedSlotForAppointment(appointment: {
    doctor_id: string;
    date: Date;
    start_time: string;
    end_time: string;
  }) {
    return this.prisma.slots.findFirst({
      where: {
        doctor_id: appointment.doctor_id,
        date: appointment.date,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        status: "BOOKED",
      },
    });
  }

  private async findAppointmentForReservedSlot(slot: {
    doctor_id: string | null;
    date: Date;
    start_time: string;
    end_time: string;
  }) {
    if (!slot.doctor_id) return null;
    return this.prisma.appointment.findFirst({
      where: {
        doctor_id: slot.doctor_id,
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        status: "BOOKED",
      },
    });
  }

  async cancelCurrentUserBooking(userId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id,
        user_id: userId,
        status: { in: ["BOOKED", "COMPLETED"] },
      },
    });

    if (!appointment) {
      throw new NotFoundException("Booking not found");
    }

    if (appointment.status === "COMPLETED") {
      throw new BadRequestException(
        "Completed appointments cannot be cancelled",
      );
    }

    await this.emitAppointmentEvent("appointment.canceled", appointment.id);

    const cancelled = await this.prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    const slot = await this.findReservedSlotForAppointment(appointment);
    if (slot) {
      await this.prisma.slots.update({
        where: { id: slot.id },
        data: {
          is_booked: false,
          status: "AVAILABLE",
          user_id: null,
          service_id: null,
          reminder_sent: false,
        },
      });
      await this.mergeDoctorAvailableSlots(
        this.prisma,
        appointment.doctor_id,
        appointment.date,
      );
    } else {
      this.logger.warn(
        `No reserved Slots block found for cancelled appointment ${appointment.id} — time wasn't freed back up`,
      );
    }

    return cancelled;
  }

  async completeCurrentDoctorBooking(userId: string, id: string) {
    const doctor = await this.getDoctorByUserId(userId);
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id,
        doctor_id: doctor.id,
        status: "BOOKED",
      },
    });

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    const completed = await this.prisma.appointment.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    const slot = await this.findReservedSlotForAppointment(appointment);
    if (slot) {
      await this.prisma.slots.update({
        where: { id: slot.id },
        data: { status: "COMPLETED" },
      });
    }

    await this.emitAppointmentEvent("appointment.completed", appointment.id);

    return completed;
  }

  async cancelCurrentDoctorBooking(userId: string, id: string) {
    const doctor = await this.getDoctorByUserId(userId);
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id,
        doctor_id: doctor.id,
        status: "BOOKED",
      },
    });

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    await this.emitAppointmentEvent("appointment.canceled", appointment.id);

    const cancelled = await this.prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    const slot = await this.findReservedSlotForAppointment(appointment);
    if (slot) {
      await this.prisma.slots.update({
        where: { id: slot.id },
        data: {
          is_booked: false,
          status: "AVAILABLE",
          user_id: null,
          service_id: null,
          reminder_sent: false,
        },
      });
      await this.mergeDoctorAvailableSlots(
        this.prisma,
        doctor.id,
        appointment.date,
      );
    } else {
      this.logger.warn(
        `No reserved Slots block found for cancelled appointment ${appointment.id} — time wasn't freed back up`,
      );
    }

    return cancelled;
  }

  private static readonly WEEKDAY_LABELS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  private static readonly MONTH_LABELS = [
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

  async getAppointmentTrendsForCurrentDoctor(
    userId: string,
    period: "weekly" | "monthly",
  ): Promise<{ label: string; count: number }[]> {
    const doctor = await this.getDoctorByUserId(userId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (period === "weekly") {
      const rangeStart = new Date(today);
      rangeStart.setDate(today.getDate() - 6);

      const appointments = await this.prisma.appointment.findMany({
        where: {
          doctor_id: doctor.id,
          status: { in: ["BOOKED", "COMPLETED"] },
          date: { gte: rangeStart, lte: today },
        },
        select: { date: true },
      });

      const counts = new Map<string, number>();
      for (const appt of appointments) {
        const key = this.toLocalDateStr(appt.date);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }

      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(rangeStart);
        day.setDate(rangeStart.getDate() + i);
        return {
          label: SlotsService.WEEKDAY_LABELS[day.getDay()],
          count: counts.get(this.toLocalDateStr(day)) ?? 0,
        };
      });
    }

    const rangeStart = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctor_id: doctor.id,
        status: { in: ["BOOKED", "COMPLETED"] },
        date: { gte: rangeStart },
      },
      select: { date: true },
    });

    const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
    const counts = new Map<string, number>();
    for (const appt of appointments) {
      const key = monthKey(appt.date);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return Array.from({ length: 6 }, (_, i) => {
      const month = new Date(
        rangeStart.getFullYear(),
        rangeStart.getMonth() + i,
        1,
      );
      return {
        label: SlotsService.MONTH_LABELS[month.getMonth()],
        count: counts.get(monthKey(month)) ?? 0,
      };
    });
  }

  async bookServiceSlot(userId: string, dto: BookServiceSlotDto) {
    const { doctorId, serviceId, date: dateStr, start_time } = dto;

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { user_id: true },
    });

    if(!doctor) throw new NotFoundException("Doctor not found");
    if (doctor.user_id === userId) {
      throw new BadRequestException("Doctors cannot book their own services");
    }

    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) throw new NotFoundException("Service not found");
    if (service.doctor_id !== doctorId) {
      throw new BadRequestException("Service does not belong to this doctor");
    }

    const date = this.parseLocalDate(dateStr);
    const bookingStartMinutes = this.parseTimeToMinutes(start_time);
    const bookingEndMinutes = bookingStartMinutes + service.duration;
    const bookingEndStr = this.minutesToTime(bookingEndMinutes);

    const now = new Date();
    const bookingStartDateTime = this.combineDateAndTime(date, start_time);
    if (bookingStartDateTime < now) {
      throw new BadRequestException("Cannot book slots in the past");
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      const blocks = await tx.slots.findMany({
        where: {
          doctor_id: doctorId,
          date: { gte: date, lt: nextDay },
          is_booked: false,
          status: "AVAILABLE",
        },
      });

      const targetBlock = blocks.find((block) => {
        const bStart = this.parseTimeToMinutes(block.start_time);
        const bEnd = this.parseTimeToMinutes(block.end_time);
        return bStart <= bookingStartMinutes && bEnd >= bookingEndMinutes;
      });

      if (!targetBlock) {
        throw new BadRequestException("This time slot is no longer available.");
      }

      const blockStartMinutes = this.parseTimeToMinutes(targetBlock.start_time);
      const blockEndMinutes = this.parseTimeToMinutes(targetBlock.end_time);

      const bookedSlot = await tx.slots.update({
        where: { id: targetBlock.id },
        data: {
          start_time: start_time,
          end_time: bookingEndStr,
          is_booked: true,
          status: "BOOKED",
          user_id: userId,
          service_id: serviceId,
        },
      });

      const appointment = await tx.appointment.upsert({
        where: {
          doctor_id_date_start_time: {
            doctor_id: doctorId,
            date: targetBlock.date,
            start_time: start_time,
          },
        },
        create: {
          user_id: userId,
          doctor_id: doctorId,
          service_id: serviceId,
          date: targetBlock.date,
          start_time: start_time,
          end_time: bookingEndStr,
          status: "BOOKED",
        },
        update: {
          user_id: userId,
          service_id: serviceId,
          end_time: bookingEndStr,
          status: "BOOKED",
        },
      });

      if (blockStartMinutes < bookingStartMinutes) {
        await tx.slots.create({
          data: {
            doctor_id: doctorId,
            date: targetBlock.date,
            start_time: targetBlock.start_time,
            end_time: start_time,
            is_booked: false,
            status: "AVAILABLE",
          },
        });
      }

      if (bookingEndMinutes < blockEndMinutes) {
        await tx.slots.create({
          data: {
            doctor_id: doctorId,
            date: targetBlock.date,
            start_time: bookingEndStr,
            end_time: targetBlock.end_time,
            is_booked: false,
            status: "AVAILABLE",
          },
        });
      }

      return { success: true, appointment, booked_slot: bookedSlot };
    });

    await this.emitAppointmentEvent(
      "appointment.created",
      result.appointment.id,
    );

    return result;
  }
}
