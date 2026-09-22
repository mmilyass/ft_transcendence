'use client';
import Navbar from '@/components/Navbar';
import InformationFooter from '@/components/InformationFooter';

import DashboardHeader from './components/DashboardHeader';
import DashboardStats from './components/DashboardStats';
import UpcomingAppointments from './components/AppointmentCard';
import QuickActions from './components/QuickActions';

const appointments = [
  {
    id: '1',
    doctorName: 'Dr. John Smith',
    specialty: 'Cardiology',
    date: '2023-09-15',
    time: '10:00 AM',
    status:  'CONFIRMED' as const,
  },
  {
    id: '2',
    doctorName: 'Dr. Emily Johnson',
    specialty: 'Dermatology',
    date: '2023-09-20',
    time: '2:30 PM',
    status: 'PENDING' as const,
  },
];

export default function DashboardPage() {

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Navbar showAuthButtons />

      <main className="pt-24 pb-12 max-w-screen-2xl mx-auto px-6">
      <DashboardHeader userName="John Doe" />

      <DashboardStats
        upcomingAppointments={3}
        completedVisits={12}
        cancelledAppointments={1}
        pendingResults={0}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <UpcomingAppointments appointments={appointments} />
        </div>
          <QuickActions />
      </div>
        </main>

      <InformationFooter />
    </div>
  );
}