'use client';

import Navbar from '@/components/Navbar';
import InformationFooter from '@/components/InformationFooter';
import AppointmentsHeader from './components/AppointmentsHeader';
import AppointmentFilters from './components/AppointmentFilters';
import AppointmentsList from './components/AppointmentHistoryList';
import { useState } from 'react';
import LeaveReviewModal from './components/LeaveReviewModal';

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

export default function AppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [reviewOpen, setReviewOpen] = useState(false);

  const appointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. John Smith',
      specialty: 'Cardiology',
      date: '2026-08-05',
      time: '10:00',
      status: 'CONFIRMED',
    },
    {
      id: '2',
      doctorName: 'Dr. Emily Johnson',
      specialty: 'Dermatology',
      date: '2026-08-10',
      time: '14:30',
      status: 'PENDING',
    },
    {
      id: '3',
      doctorName: 'Dr. David Brown',
      specialty: 'Neurology',
      date: '2026-07-20',
      time: '09:00',
      status: 'COMPLETED',
    },
  ];

  const filteredAppointments =
    statusFilter === 'ALL'
      ? appointments
      : appointments.filter(
          (appointment) =>
            appointment.status === statusFilter
        );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12 space-y-6">
        <AppointmentsHeader />

        <AppointmentFilters
          selected={statusFilter}
          onChange={setStatusFilter}
        />

        <AppointmentsList
          appointments={filteredAppointments}
          setReviewOpen={setReviewOpen}
        />
        { reviewOpen && (
            <LeaveReviewModal
            doctorName="Dr. John Smith"
            onClose={() => setReviewOpen(false)}
            onSubmit={(rating, comment) => {
                console.log({
                rating,
                comment,
                });
            }}
            />
        )}
      </main>

      <InformationFooter />
    </div>
  );
}