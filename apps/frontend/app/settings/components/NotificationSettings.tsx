'use client';

export default function NotificationSettings() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-red-500">
        will be add into the backend and will be used to send notifications to the user in the future. For now, this is just a placeholder to show how the notification settings will look like in the UI.
      </h1>
      <h2 className="text-xl font-bold mb-6">
        Notifications
      </h2>

      <div className="space-y-4">
        <label className="flex justify-between">
          <span>Email Notifications</span>
          <input type="checkbox" defaultChecked />
        </label>

        <label className="flex justify-between">
          <span>Appointment Reminders</span>
          <input type="checkbox" defaultChecked />
        </label>

        <label className="flex justify-between">
          <span>System Updates</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
    </div>
  );
}