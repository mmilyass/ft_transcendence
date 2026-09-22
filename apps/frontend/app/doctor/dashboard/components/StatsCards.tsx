type Stats = {
  totalAppointments: number;
  upcomingToday: number;
  weeklyGrowth: number;
};

interface StatsCardsProps {
  stats: Stats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-surface-container-lowest p-6 rounded-xl transition-all hover:bg-surface-bright group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">list_alt</span>
          </div>
          <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded-full">
            +12%
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-sm font-semibold text-slate-500">
            Total Appointments
          </span>

          <div className="text-3xl font-black font-manrope">
            {stats?.totalAppointments || 0}
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-xl transition-all hover:bg-surface-bright group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-secondary/10 text-secondary rounded-lg group-hover:bg-secondary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>

          <span className="text-blue-600 text-xs font-bold bg-blue-100 px-2 py-1 rounded-full">
            Today
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-sm font-semibold text-slate-500">
            Upcoming Today
          </span>

          <div className="text-3xl font-black font-manrope text-primary">
            {stats?.upcomingToday || 0}
          </div>
        </div>
      </div>

      <div className="bg-primary text-on-primary p-6 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <span className="material-symbols-outlined">
                trending_up
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium text-blue-100">
              Weekly Patient Growth
            </span>

            <div className="text-3xl font-black font-manrope">
              {stats?.weeklyGrowth || 0}%
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>
    </section>
  );
}