interface UserStats {
  Appointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
  Reviews: number;
}

export default function DashboardStats({
  stats,
}: {
  stats: UserStats | null;
}) {
  const cards = [
    {
      title: 'Appointments',
      value: stats?.Appointments ?? 0,
      icon: 'calendar_month',
    },
    {
      title: 'Completed',
      value: stats?.completedAppointments ?? 0,
      icon: 'check_circle',
    },
    {
      title: 'Pending',
      value: stats?.pendingAppointments ?? 0,
      icon: 'schedule',
    },
    {
      title: 'Reviews',
      value: stats?.Reviews ?? 0,
      icon: 'star',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant">
                {card.title}
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {card.value}
              </h3>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">
                {card.icon}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}