'use client';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'CONFIRMED' | 'PENDING';
}

interface AppointmentsCardProps {
  appointments: Appointment[];
}

export default function AppointmentsCard({
  appointments,
}: AppointmentsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-xl font-bold text-slate-900">
          Upcoming Appointments
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Your next scheduled consultations.
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300">
            event_busy
          </span>

          <h3 className="mt-4 text-lg font-semibold text-slate-700">
            No upcoming appointments
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Book an appointment with a doctor to get started.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6"
            >
              <div>
                <h3 className="font-semibold text-slate-900">
                  {appointment.doctorName}
                </h3>

                <p className="text-sm text-slate-500">
                  {appointment.specialty}
                </p>

                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                  <span>{appointment.date}</span>
                  <span>•</span>
                  <span>{appointment.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    appointment.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {appointment.status}
                </span>

                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                  Reschedule
                </button>

                <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}