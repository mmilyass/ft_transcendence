import { Appointment } from '../page';

interface Props {
  appointment: Appointment;
  setReviewOpen: (open: boolean) => void;
}

export default function AppointmentCard({
  appointment,
  setReviewOpen
}: Props) {
  const statusColors = {
    PENDING:
      'bg-yellow-100 text-yellow-700',
    CONFIRMED:
      'bg-green-100 text-green-700',
    COMPLETED:
      'bg-blue-100 text-blue-700',
    CANCELLED:
      'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {appointment.doctorName}
          </h3>

          <p className="text-slate-500">
            {appointment.specialty}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusColors[appointment.status]
          }`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="mt-4 flex gap-8 text-sm text-slate-600">
        <div>
          <p className="font-medium">Date</p>
          <p>{appointment.date}</p>
        </div>

        <div>
          <p className="font-medium">Time</p>
          <p>{appointment.time}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {appointment.status === 'CONFIRMED' && (
          <>
            <button className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100">
              Cancel
            </button>

            <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
              Reschedule
            </button>
          </>
        )}

        {appointment.status === 'COMPLETED' && (
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={() => setReviewOpen(true)}>
            Leave Review
          </button>
        )}
      </div>
    </div>
  );
}