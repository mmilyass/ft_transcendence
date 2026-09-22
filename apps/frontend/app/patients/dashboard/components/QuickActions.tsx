'use client';

import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: 'Find Doctor',
      description: 'Browse available doctors',
      icon: 'medical_services',
      action: () => router.push('/'),
    },
    {
      title: 'Book Appointment',
      description: 'Schedule a new consultation',
      icon: 'calendar_add_on',
      action: () => router.push('/'),
    },
    {
      title: 'My Appointments',
      description: 'Manage your appointments',
      icon: 'event_note',
      action: () => router.push('/patients/appointments'),
    },
    {
      title: 'Specialties',
      description: 'Explore medical specialties',
      icon: 'stethoscope',
      action: () =>
        router.push('/specialties'),
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-xl font-bold text-slate-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Frequently used actions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={action.action}
            className="group rounded-xl border border-slate-200 p-5 text-left hover:border-blue-200 hover:bg-blue-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-blue-100">
                <span className="material-symbols-outlined text-slate-700 group-hover:text-blue-700">
                  {action.icon}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  {action.title}
                </h3>

                <p className="text-sm text-slate-500">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}