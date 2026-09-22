import AdminHeader from '../components/AdminHeader';
import AdminShell from '../components/AdminShell';

import SettingsPageHeader from './components/SettingsPageHeader';
import GeneralSettingsCard from './components/GeneralSettingsCard';
import SecuritySettingsCard from './components/SecuritySettingsCard';
import NotificationSettingsCard from './components/NotificationSettingsCard';
import AppointmentSettingsCard from './components/AppointmentSettingsCard';
import MaintenanceSettingsCard from './components/MaintenanceSettingsCard';

export default function AdminSettingsPage() {
  return (
    <AdminShell activePage="settings">
      <AdminHeader />
      <section className="mt-16 p-4 sm:p-8 flex-1">
        <div className="max-w-6xl mx-auto space-y-8">
          <SettingsPageHeader />
          <GeneralSettingsCard />
          <SecuritySettingsCard />
          <NotificationSettingsCard />
          <AppointmentSettingsCard />
          <MaintenanceSettingsCard />
        </div>
      </section>
    </AdminShell>
  );
}