import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import type { RequestWithUser } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "@prisma/client";
import { SlotsService } from "./slots.service";

// Separate controller (not a method on SlotsController) purely so this
// lands at /appointments/trends instead of /slots/appointments/trends —
// that's the path the doctor dashboard's AppointmentChart already calls.
// Backed by SlotsService since Appointment/doctor lookups already live
// there alongside the rest of the booking logic.
@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly slotsService: SlotsService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Get("trends")
  getTrends(@Req() req: RequestWithUser, @Query("period") period?: string) {
    const normalizedPeriod = period === "weekly" ? "weekly" : "monthly";
    return this.slotsService.getAppointmentTrendsForCurrentDoctor(
      req.user.sub,
      normalizedPeriod,
    );
  }
}
