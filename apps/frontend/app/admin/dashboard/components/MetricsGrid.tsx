import MetricCard from './MetricGrid';

// Used to be a module-level `const responce = await axios.get(...)` — that
// call ran exactly once, the moment Next.js first loaded this module, and
// every request after that (from every admin, forever, until the container
// restarted) got served the same frozen numbers. Now it's a plain
// presentational component fed fresh data from the page's own per-request
// server fetch — see `page.tsx`.
type DashboardStats = {
  TotalUsers: number;
  TotalDoctors: number;
  PendingDoctorApprovals: number;
  MonthlyGrowth: number | string;
};

export default function MetricsGrid({ stats }: { stats: DashboardStats }) {
  const metrics = [
    {
      title: 'Total Users',
      value: String(stats.TotalUsers),
      icon: 'person',
      badge: '+12%',
    },
    {
      title: 'Total Doctors',
      value: String(stats.TotalDoctors),
      icon: 'medical_information',
      badge: 'Active',
    },
    {
      title: 'Pending Applications',
      value: String(stats.PendingDoctorApprovals),
      icon: 'pending_actions',
      badge: 'Urgent',
      cardClassName: 'bg-tertiary-fixed',
      iconContainerClassName: 'bg-tertiary-container',
      iconClassName: 'text-white',
    },
    {
      title: 'Monthly Growth',
      value: String(stats.MonthlyGrowth),
      icon: 'trending_up',
      iconContainerClassName: 'bg-green-100',
      iconClassName: 'text-green-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}
