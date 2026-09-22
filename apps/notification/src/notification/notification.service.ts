import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AppointmentCreatedEvent } from './notification.controller';
import { DoctorRegisteredEvent } from './notification.controller';

@Injectable()
export class NotificationService {
  constructor(private readonly mailService: MailerService) {}
  async handleUserCreatedEvent(data: {
    id: string;
    email: string;
    name: string;
    token: string;
  }) {
    console.log('Handling user.created event for:', data.email);
    try {
      const url = `${process.env.FRONTEND_URL}/verification-email?token=${encodeURIComponent(
        data.token,
      )}`;

      await this.mailService.sendMail({
        to: data.email,
        subject: 'Verify your email',
        text: `Please click the following link to verify your email: ${url}`,
        html: `
          <h2>Welcome ${data.name}</h2>
          <p>Please verify your email by clicking the link below:</p>
          <p>
            <a href="${url}">
              Verify Email
            </a>
          </p>
        `,
      });
    } catch (error) {
      console.error('Failed to process user.created event:', error);
    }
  }

  async handleUserForgetPasswordEvent(data: { email: string; token: string }) {
    try {
      const url = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(
        data.token,
      )}`;

      await this.mailService.sendMail({
        to: data.email,
        subject: 'Reset your password',
        text: `Please click the following link to reset your password: ${url}`,
        html: `
          <h2>Password Reset Request</h2>
          <p>Please reset your password by clicking the link below:</p>
          <p>
            <a href="${url}">
              Reset Password
            </a>
          </p>
        `,
      });
    } catch (error) {
      console.error('Failed to process user.forget_password event:', error);
    }
  }

  // Appointment event handlers
  async handleAppointmentCreated(data: AppointmentCreatedEvent) {
    try {
      await this.mailService.sendMail({
        to: data.patientEmail,
        subject: 'Appointment Request Submitted',
        html: `
        <h2>Appointment Request Submitted</h2>
        <p>Hello ${data.patientName},</p>
        <p>Your appointment request with <strong>Dr. ${data.doctorName}</strong> has been submitted successfully.</p>
        <p>Requested time: <strong>${data.appointmentTime}</strong></p>
        <p>You will be notified once the doctor reviews your request.</p>
      `,
      });

      await this.mailService.sendMail({
        to: data.doctorEmail,
        subject: 'New Appointment Request',
        html: `
        <h2>New Appointment Request</h2>
        <p>Hello Dr. ${data.doctorName},</p>
        <p><strong>${data.patientName}</strong> has requested an appointment.</p>
        <p>Requested time: <strong>${data.appointmentTime}</strong></p>
        <p>Please review the request from your dashboard.</p>
      `,
      });
    } catch (error) {
      console.error('Failed to process appointment.created event:', error);
    }
  }

  async handleAppointmentCanceled(data: AppointmentCreatedEvent) {
    try {
      await this.mailService.sendMail({
        to: data.patientEmail,
        subject: 'Appointment Canceled',
        html: `
        <h2>Appointment Canceled</h2>
        <p>Hello ${data.patientName},</p>
        <p>Your appointment with <strong>Dr. ${data.doctorName}</strong> has been canceled.</p>
        <p>Thank you for your understanding.</p>
      `,
      });

      await this.mailService.sendMail({
        to: data.doctorEmail,
        subject: 'Appointment Canceled',
        html: `
        <h2>Appointment Canceled</h2>
        <p>Hello Dr. ${data.doctorName},</p>
        <p>Your appointment with <strong>${data.patientName}</strong> has been canceled.</p>
        <p>Thank you for your understanding.</p>
      `,
      });
    } catch (error) {
      console.error('Failed to process appointment.canceled event:', error);
    }
  }

  async handleAppointmentCompleted(data: AppointmentCreatedEvent) {
    try {
      await this.mailService.sendMail({
        to: data.patientEmail,
        subject: 'Appointment Completed',
        html: `
        <h2>Appointment Completed</h2>
        <p>Hello ${data.patientName},</p>
        <p>Your appointment with <strong>Dr. ${data.doctorName}</strong> has been completed.</p>
        <p>Thank you for choosing our service!</p>
      `,
      });

      await this.mailService.sendMail({
        to: data.doctorEmail,
        subject: 'Appointment Completed',
        html: `
        <h2>Appointment Completed</h2>
        <p>Hello Dr. ${data.doctorName},</p>
        <p>Your appointment with <strong>${data.patientName}</strong> has been completed.</p>
        <p>Thank you for your service!</p>
      `,
      });
    } catch (error) {
      console.error('Failed to process appointment.completed event:', error);
    }
  }

  async handleAppointmentRejected(data: AppointmentCreatedEvent) {
    try {
      await this.mailService.sendMail({
        to: data.patientEmail,
        subject: 'Appointment Rejected',
        html: `
        <h2>Appointment Rejected</h2>
        <p>Hello ${data.patientName},</p>
        <p>Your appointment with <strong>Dr. ${data.doctorName}</strong> has been rejected.</p>
        <p>Thank you for your understanding.</p>
      `,
      });

      await this.mailService.sendMail({
        to: data.doctorEmail,
        subject: 'Appointment Rejected',
        html: `
        <h2>Appointment Rejected</h2>
        <p>Hello Dr. ${data.doctorName},</p>
        <p>You have rejected the appointment request from <strong>${data.patientName}</strong>.</p>
        <p>Thank you for your response!</p>
      `,
      });
    } catch (error) {
      console.error('Failed to process appointment.rejected event:', error);
    }
  }

  async handleAppointmentReminder(data: AppointmentCreatedEvent) {
    try {
      await this.mailService.sendMail({
        to: data.patientEmail,
        subject: 'Appointment Reminder',
        html: `
        <h2>Appointment Reminder</h2>
        <p>Hello ${data.patientName},</p>
        <p>This is a reminder about your upcoming appointment with <strong>Dr. ${data.doctorName}</strong>.</p>
        <p>Appointment time: <strong>${data.appointmentTime}</strong></p>
        <p>Thank you for choosing our service!</p>
      `,
      });

      await this.mailService.sendMail({
        to: data.doctorEmail,
        subject: 'Appointment Reminder',
        html: `
        <h2>Appointment Reminder</h2>
        <p>Hello Dr. ${data.doctorName},</p>
        <p>This is a reminder about your upcoming appointment with <strong>${data.patientName}</strong>.</p>
        <p>Appointment time: <strong>${data.appointmentTime}</strong></p>
        <p>Thank you for your service!</p>
      `,
      });
    } catch (error) {
      console.error('Failed to process appointment.reminder event:', error);
    }
  }

  async handleDoctorApproved(data: { email: string; name: string }) {
    try {
      await this.mailService.sendMail({
        to: data.email,
        subject: 'Doctor Approved',
        html: `
        <h2>Doctor Approved</h2>
        <p>Hello Dr. ${data.name},</p>
        <p>Your doctor profile has been approved.</p>
        <p>Thank you for your cooperation!</p>
      `,
      });
    } catch (error) {
      console.error('Failed to process doctor.approved event:', error);
    }
  }

  async handleDoctorRejected(data: { email: string; name: string }) {
    try {
      await this.mailService.sendMail({
        to: data.email,
        subject: 'Doctor Rejected',
        html: `
        <h2>Doctor Rejected</h2>
        <p>Hello Dr. ${data.name},</p>
        <p>Your doctor profile has been rejected.</p>
        <p>Thank you for your understanding.</p>
      `,
      });
    } catch (error) {
      console.error('Failed to process doctor.rejected event:', error);
    }
  }

  async handleDoctorRegistered(data: DoctorRegisteredEvent) {
    try {
      await this.mailService.sendMail({
        to: data.email,
        subject: 'New Doctor Registration',
        html: `
        <h2>New Doctor Registration</h2>
        <p>Hello Admin,</p>
        <p>A new doctor <strong>${data.name}</strong> has registered.</p>
        <p>Please review and approve the registration.</p>
        <a href="${data.licenseUrl}" target="_blank">Review Doctor Registration</a>
      `,
      });
    } catch (error) {
      console.error('Failed to process doctor.registered event:', error);
    }
  }

  async handleDoctorCreated(data: DoctorRegisteredEvent) {
    try {
      await this.mailService.sendMail({
        to: data.email,
        subject: 'Doctor Profile Created',
        html: `
        <h2>Doctor Profile Created</h2>
        <p>Hello Dr. ${data.name},</p>
        <p>Your doctor profile has been successfully created.</p>
        <p>Thank you for joining our platform!</p>
      `,
      });
    } catch (error) {
      console.error('Failed to process doctor.created event:', error);
    }
  }

  // GDPR: confirmation emails for data operations.
  async handleUserDataExported(data: { email: string; name: string }) {
    try {
      await this.mailService.sendMail({
        to: data.email,
        subject: 'Your data export is ready',
        html: `
        <h2>Data Export Confirmation</h2>
        <p>Hello ${data.name},</p>
        <p>As requested, a copy of your account data was just generated and downloaded from your browser.</p>
        <p>If you didn't request this, please secure your account and contact support immediately.</p>
      `,
      });
    } catch (error) {
      console.error('Failed to process user.data_exported event:', error);
    }
  }

  async handleUserAccountDeleted(data: { email: string; name: string }) {
    try {
      await this.mailService.sendMail({
        to: data.email,
        subject: 'Your account has been deleted',
        html: `
        <h2>Account Deletion Confirmation</h2>
        <p>Hello ${data.name},</p>
        <p>This confirms that your account and associated data have been permanently deleted, as requested.</p>
        <p>If you didn't request this, please contact support immediately.</p>
      `,
      });
    } catch (error) {
      console.error('Failed to process user.account_deleted event:', error);
    }
  }
}
