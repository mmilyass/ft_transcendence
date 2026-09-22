type DashboardStatsProps = {
  upcomingAppointments: number;
  completedVisits: number;
  pendingResults: number;
  cancelledAppointments: number;
};

export default function DashboardStats({
  upcomingAppointments,
  completedVisits,
  pendingResults,
  cancelledAppointments,
}: DashboardStatsProps) {
  const stats = [
    {
      label: 'Upcoming Appointments',
      value: upcomingAppointments,
      icon: 'event',
    },
    {
      label: 'Completed Visits',
      value: completedVisits,
      icon: 'check_circle',
    },
    {
      label: 'Pending Results',
      value: pendingResults,
      icon: 'pending_actions',
    },
    {
      label: 'Cancelled Appointments',
      value: cancelledAppointments,
      icon: 'cancel',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-surface-container-lowest rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-sm">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-primary">
                {stat.value}
              </p>
            </div>

            <span className="material-symbols-outlined text-4xl text-primary">
              {stat.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}