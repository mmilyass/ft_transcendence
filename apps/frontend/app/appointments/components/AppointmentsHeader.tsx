type Props = {
  upcomingCount: number;
  completedCount: number;
  cancelledCount: number;
};

export default function AppointmentsHeader({
  upcomingCount,
  completedCount,
  cancelledCount,
}: Props) {
  return (
    <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
            <span className="material-symbols-outlined text-sm">
              event_note
            </span>
            Patient Portal
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            My Appointments
          </h1>

          <p className="text-slate-500 text-sm max-w-xl">
            Track your active consultations, review medical service histories,
            and manage scheduled clinic visits.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Upcoming",
              value: upcomingCount,
              color: "text-emerald-600",
            },
            {
              label: "Completed",
              value: completedCount,
              color: "text-sky-600",
            },
            {
              label: "Cancelled",
              value: cancelledCount,
              color: "text-rose-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center"
            >
              <p className={`text-2xl font-black ${stat.color}`}>
                {stat.value}
              </p>

              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}