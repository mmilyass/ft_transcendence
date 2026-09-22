"use client";

type AppointmentsHeaderProps = {
  bookedCount: number;
  completedCount: number;
};

export default function AppointmentsHeader({
  bookedCount,
  completedCount,
}: AppointmentsHeaderProps) {
  return (
    <header className="px-8 pt-10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">
          Appointments
        </h1>
        <p className="text-on-surface-variant font-medium">
          Manage your patient schedule and consultation requests.
        </p>
      </div>
      {/* Quick Stats */}
      <div className="flex gap-4">
        <div className="bg-surface-container-lowest px-6 py-4 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              pending_actions
            </span>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              Booked
            </p>
            <p className="text-2xl font-black text-on-surface">{bookedCount}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest px-6 py-4 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
              Completed
            </p>
            <p className="text-2xl font-black text-on-surface">
              {completedCount}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
