import AppointmentCard from './AppointmentCard';
import { Appointment } from '../page';

interface Props {
  appointments: Appointment[];
    setReviewOpen: (open: boolean) => void;
}

export default function AppointmentsHistoryList({
  appointments,
  setReviewOpen
}: Props) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center border border-slate-200">
        <p className="text-slate-500">
          No appointments found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          setReviewOpen={setReviewOpen}
        />
      ))}
    </div>
  );
}