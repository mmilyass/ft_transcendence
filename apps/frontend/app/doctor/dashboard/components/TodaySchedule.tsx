import Img from 'next/image';
import Link from 'next/link';

type ScheduleItem = {
  id: string;
  patientName: string;
  type: string;
  time: string;
  avatar: string | null;
  border?: string;
};

interface TodayScheduleProps {
  scheduleItems: ScheduleItem[];
}

export default function TodaySchedule({
  scheduleItems,
}: TodayScheduleProps) {
  return (
    <div className="bg-surface-container-low p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold font-manrope">
          Today&apos;s Schedule
        </h3>

        <Link
          className="text-primary text-xs font-bold hover:underline"
          href="/doctor/appointments"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {scheduleItems.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-6">
            No appointments scheduled for today.
          </p>
        )}
        {scheduleItems.map((appointment) => (
          <div
            key={appointment.id}
            className={`bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 hover:bg-surface-bright transition-colors border-l-4 ${
              appointment.border || 'border-blue-500'
            }`}
          >
            {appointment.avatar ? (
              <Img
                alt="Patient"
                src={appointment.avatar}
                width={40}
                height={40}
                className="w-10 h-10 rounded-l-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined">
                  person
                </span>
              </div>
            )}

            <div className="grow">
              <h4 className="text-sm font-bold">
                {appointment.patientName}
              </h4>

              <p className="text-[11px] text-slate-500 font-medium">
                {appointment.type} • {appointment.time}
              </p>
            </div>

            <button className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">
                more_vert
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}