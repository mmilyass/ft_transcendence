import ApplicationRow from './ApplicationRow';
import { Application } from '../page';

export default function ApplicationsTable({ applications }: { applications: Application[] }) {
  return (
    <div className="bg-surface-container-low rounded-3xl p-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Practitioner Name</th>
              <th className="px-6 py-4">Specialization</th>
              <th className="px-6 py-4">Date Applied</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">
                Action Cluster
              </th>
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <ApplicationRow
                key={application.email}
                {...application}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}