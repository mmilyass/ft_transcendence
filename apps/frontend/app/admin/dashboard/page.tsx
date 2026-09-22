import AdminShell from '@/app/admin/components/AdminShell';
import AdminHeader from '@/app/admin/components/AdminHeader';
import { getDashboardStats } from '@/lib/admin/dashboard';

import DashboardHeader from './components/DashboardHeader';
import MetricsGrid from './components/MetricsGrid';
import RecentActivity from './components/RecentActivity';
import PlatformPulse from './components/PlatformPulse';
import UserRegistrationTrends from './components/UserRegistrationTrends';

// Real Server Component: stats are fetched fresh on every request via
// `getDashboardStats()` (cookie-forwarded, same helper `admin/users` uses),
// not once at module load — see MetricsGrid.tsx / PlatformPulse.tsx for
// what that top-level-await bug looked like before this fix.
export default async function AdminDashboard() {
  const { stats } = await getDashboardStats();

  return (
    <AdminShell activePage="dashboard">
      <AdminHeader />
      <main className="mt-16 p-4 sm:p-8 min-h-screen">
        <DashboardHeader />
        <MetricsGrid stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <UserRegistrationTrends />
          <RecentActivity />
        </div>
        <PlatformPulse initialStats={stats} />
      </main>
    </AdminShell>
  );
}