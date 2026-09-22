interface UsersStatsGridProps {
  stats: {
    TotalUsers: number;
    ActiveDoctors: number;
    PendingPatients: number;
    SystemHealth: number;
    NewlyOnboardedDoctors: number;
    MonthlyGrowth: number;
  };
}

export default function UsersStatsGrid({ stats }: UsersStatsGridProps) {
  const data = [
    {
      title: "Total Users",
      value: stats?.TotalUsers ?? 0,
      trend: stats?.MonthlyGrowth > 0 ? `${stats.MonthlyGrowth}% increase` : `${Math.abs(stats.MonthlyGrowth)}% decrease`,
      trendColor: stats?.MonthlyGrowth > 0 ? "text-green-500" : "text-red-500",
      trendIcon: stats?.MonthlyGrowth > 0 ? "trending_up" : "trending_down",
    },
    {
      title: "Active Doctors",
      value: stats?.ActiveDoctors ?? 0,
      trend: stats?.NewlyOnboardedDoctors ? `${stats.NewlyOnboardedDoctors} newly onboarded` : "No new doctors",
      trendColor: "text-slate-500",
      trendIcon: "",
    },
    {
      title: "Pending Patients",
      value: stats?.PendingPatients ?? 0,
      trend: "Requires review",
      trendColor: "text-tertiary",
      trendIcon: "",
    },
    {
      title: "System Health",
      value: stats?.SystemHealth ?? 0,
      trend: "Security: High",
      trendColor: "text-primary",
      trendIcon: "",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {data.map((stat) => (
        <div
          key={stat.title}
          className="p-6 bg-surface-container-low rounded-xl"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            {stat.title}
          </p>

          <p className="text-4xl font-extrabold text-on-surface font-headline">
            {stat.value}
          </p>

          <div
            className={`mt-4 flex items-center gap-1 text-xs font-medium ${stat.trendColor}`}
          >
            {stat.trendIcon && (
              <span className="material-symbols-outlined text-xs">
                {stat.trendIcon}
              </span>
            )}

            {stat.trend}
          </div>
        </div>
      ))}
    </div>
  );
}