import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Query,
} from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import type { RequestWithUser } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "@prisma/client";
import { SlotsService } from "./slots.service";
import { CreateSlotsDto } from "./dto/create-slots.dto";
import { UpdateSlotDto } from "./dto/update-slots.dto";
import { BookServiceSlotDto } from "./dto/book-service-slot.dto";
import { Public } from "src/auth/decorator/public.decorator";

@Controller("slots")
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  // Doctor-only: their own generated shift slots.
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Get("me")
  findMySlots(@Req() req: RequestWithUser) {
    return this.slotsService.findCurrentDoctorSlots(req.user.sub);
  }

  @Public()
  @Get("available")
  getAvailable(
    @Query("doctorId") doctorId: string,
    @Query("serviceId") serviceId: string,
    @Query("date") date: string,
  ) {
    return this.slotsService.getAvailableWindowsForService(
      doctorId,
      serviceId,
      date,
    );
  }

  // Dumps every slot for every doctor, including who booked what — not
  // something any logged-in patient should be able to read. Admin only.
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.slotsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get("doctor/:doctorId")
  findByDoctor(@Param("doctorId") doctorId: string) {
    return this.slotsService.findByDoctorId(doctorId);
  }

  // The nearest upcoming booked appointment for whoever's asking (patient or
  // doctor) — powers the landing page's "next session" card. Must come
  // before ":id" below or it'd be swallowed by that route.
  @UseGuards(JwtGuard)
  @Get("me/next")
  findMyNextSession(@Req() req: RequestWithUser) {
    return this.slotsService.findNextSessionForCurrentUser(req.user.sub);
  }

  @UseGuards(JwtGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.slotsService.findOneSlot(String(id));
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Post("generate")
  generate(@Req() req: RequestWithUser, @Body() dto: CreateSlotsDto) {
    return this.slotsService.generateSlotsForCurrentDoctor(req.user.sub, dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Patch(":id")
  update(
    @Req() req: RequestWithUser,
    @Param("id") id: string,
    @Body() dto: UpdateSlotDto,
  ) {
    return this.slotsService.updateCurrentDoctorSlot(
      req.user.sub,
      String(id),
      dto,
    );
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Delete("me")
  clearDoctorSlots(@Req() req: RequestWithUser) {
    return this.slotsService.clearCurrentDoctorSlots(req.user.sub);
  }

  @UseGuards(JwtGuard)
  @Get("me/bookings")
  findMyBookings(@Req() req: RequestWithUser) {
    return this.slotsService.findCurrentUserBookings(req.user.sub);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Get("doctor/me/bookings")
  findMyDoctorBookings(@Req() req: RequestWithUser) {
    return this.slotsService.findCurrentDoctorBookings(req.user.sub);
  }

  @UseGuards(JwtGuard)
  @Post("me/bookings/:id/cancel")
  cancelMyBooking(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.slotsService.cancelCurrentUserBooking(req.user.sub, id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Post("doctor/me/bookings/:id/complete")
  completeDoctorBooking(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.slotsService.completeCurrentDoctorBooking(req.user.sub, id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Post("doctor/me/bookings/:id/cancel")
  cancelDoctorBooking(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.slotsService.cancelCurrentDoctorBooking(req.user.sub, id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Delete(":id")
  remove(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.slotsService.deleteCurrentDoctorSlot(req.user.sub, String(id));
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Post(":id/release")
  release(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.slotsService.releaseCurrentDoctorSlot(req.user.sub, String(id));
  }

  // Legacy path: never sets user_id (no @Req/no auth wiring), kept only so
  // nothing 404s. See mistake.md — the real booking flow is book-service
  // below.
  @Post(":id/book")
  book(@Param("id") id: string) {
    return this.slotsService.bookSlot(String(id));
  }

  @UseGuards(JwtGuard)
  @Post("book-service")
  bookService(@Req() req: RequestWithUser, @Body() dto: BookServiceSlotDto) {
    return this.slotsService.bookServiceSlot(req.user.sub, dto);
  }
}
