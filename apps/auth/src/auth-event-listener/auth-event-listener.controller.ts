import { Controller } from "@nestjs/common";
import { AuthEventListenerService } from "./auth-event-listener.service";
import { EventPattern } from "@nestjs/microservices";

export interface AppointmentEventData {
  userId: string;
  doctorId: string;
}

@Controller("auth-event-listener")
export class AuthEventListenerController {
  constructor(
    private readonly authEventListenerService: AuthEventListenerService,
  ) {}

  // Appointment event handlers
  @EventPattern("appointment.created")
  async handleAppointmentCreated(data: AppointmentEventData) {
    await this.authEventListenerService.handleAppointmentCreated(data);
  }

  @EventPattern("appointment.canceled")
  async handleAppointmentCanceled(data: AppointmentEventData) {
    await this.authEventListenerService.handleAppointmentCanceled(data);
  }

  @EventPattern("appointment.completed")
  async handleAppointmentCompleted(data: AppointmentEventData) {
    await this.authEventListenerService.handleAppointmentCompleted(data);
  }
  @EventPattern("appointment.rejected")
  async handleAppointmentRejected(data: AppointmentEventData) {
    await this.authEventListenerService.handleAppointmentRejected(data);
  }
}
