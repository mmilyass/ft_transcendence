export default function NotificationSettingsCard() {
  return (
    <div className="bg-surface-container-low rounded-3xl p-6">
      <h2 className="text-xl font-bold mb-6">
        Notifications
      </h2>

      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <span>New Doctor Applications</span>
          <input type="checkbox" defaultChecked />
        </label>

        <label className="flex items-center justify-between">
          <span>User Reports</span>
          <input type="checkbox" defaultChecked />
        </label>

        <label className="flex items-center justify-between">
          <span>System Alerts</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
    </div>
  );
}