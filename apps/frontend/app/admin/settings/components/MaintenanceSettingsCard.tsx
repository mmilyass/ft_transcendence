export default function MaintenanceSettingsCard() {
  return (
    <div className="bg-surface-container-low rounded-3xl p-6">
      <h2 className="text-xl font-bold mb-6">
        Maintenance
      </h2>

      <div className="flex flex-wrap gap-4">
        <button className="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold">
          Save Settings
        </button>

        <button className="px-6 py-3 rounded-xl bg-error text-white font-semibold">
          Enable Maintenance Mode
        </button>
      </div>
    </div>
  );
}