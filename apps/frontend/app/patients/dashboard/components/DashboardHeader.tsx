'use client';

interface DashboardHeaderProps {
  userName: string;
}

export default function DashboardHeader({
  userName,
}: DashboardHeaderProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good Morning'
      : hour < 18
      ? 'Good Afternoon'
      : 'Good Evening';

  const currentDate = new Date().toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="mb-8 flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-slate-900">
        {greeting}, {userName} 👋
      </h1>

      <p className="text-slate-500">
        Manage your appointments and stay updated.
      </p>

      <p className="text-sm text-slate-400">
        {currentDate}
      </p>
    </div>
  );
}