'use client';
import { useRouter } from 'next/navigation';
import AppointmentsCard from './AppointmentCard';

type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'CONFIRMED' | 'PENDING';
};

type Props = {
  appointments: Appointment[];
};

export default function UpcomingAppointments({
  appointments,
}: Props) {
  const router = useRouter();

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Your Upcoming Appointments
        </h2>

        <button
          onClick={() => router.push('/specialties')}
          className="text-primary font-bold hover:underline"
        >
          Book New Appointment
        </button>
      </div>

      <div className="space-y-4">
        <AppointmentsCard appointments={appointments} />
      </div>
    </section>
  );
}