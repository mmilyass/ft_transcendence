import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

type UserCreatedEvent = {
  id: string;
  email: string;
  name: string;
  token: string;
};

export type AppointmentCreatedEvent = {
  patientEmail: string;
  patientName: string;

  doctorEmail: string;
  doctorName: string;

  appointmentTime: string;
};

export type DoctorRegisteredEvent = {
  email: string;
  name: string;
  doctorName: string;
  doctorEmail: string;
  licenseNumber: string;
  licenseUrl: string;
};

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @EventPattern('user.created')
  async handleUserCreatedEvent(@Payload() data: UserCreatedEvent) {
    await this.notificationService.handleUserCreatedEvent(data);
  }

  @EventPattern('user.forget_password')
  async handleUserForgetPasswordEvent(
    @Payload() data: { email: string; token: string },
  ) {
    await this.notificationService.handleUserForgetPasswordEvent(data);
  }

  // appointment events
  @EventPattern('appointment.created')
  async handleAppointmentCreated(@Payload() data: AppointmentCreatedEvent) {
    await this.notificationService.handleAppointmentCreated(data);
  }

  @EventPattern('appointment.canceled')
  async handleAppointmentCanceled(@Payload() data: AppointmentCreatedEvent) {
    await this.notificationService.handleAppointmentCanceled(data);
  }

  @EventPattern('appointment.completed')
  async handleAppointmentCompleted(@Payload() data: AppointmentCreatedEvent) {
    await this.notificationService.handleAppointmentCompleted(data);
  }

  @EventPattern('appointment.rejected')
  async handleAppointmentRejected(@Payload() data: AppointmentCreatedEvent) {
    await this.notificationService.handleAppointmentRejected(data);
  }

  @EventPattern('appointment.reminder')
  async handleAppointmentReminder(@Payload() data: AppointmentCreatedEvent) {
    await this.notificationService.handleAppointmentReminder(data);
  }

  @EventPattern('doctor.approved')
  async handleDoctorApproved(@Payload() data: { email: string; name: string }) {
    await this.notificationService.handleDoctorApproved(data);
  }

  @EventPattern('doctor.rejected')
  async handleDoctorRejected(@Payload() data: { email: string; name: string }) {
    await this.notificationService.handleDoctorRejected(data);
  }

  @EventPattern('doctor.registered')
  async handleDoctorRegistered(@Payload() data: DoctorRegisteredEvent) {
    await this.notificationService.handleDoctorRegistered(data);
  }

  @EventPattern('doctor.created')
  async handleDoctorCreated(@Payload() data: DoctorRegisteredEvent) {
    await this.notificationService.handleDoctorCreated(data);
  }

  // GDPR confirmation emails
  @EventPattern('user.data_exported')
  async handleUserDataExported(@Payload() data: { email: string; name: string }) {
    await this.notificationService.handleUserDataExported(data);
  }

  @EventPattern('user.account_deleted')
  async handleUserAccountDeleted(@Payload() data: { email: string; name: string }) {
    await this.notificationService.handleUserAccountDeleted(data);
  }
}
