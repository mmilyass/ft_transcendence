export default function SecuritySettingsCard() {
  return (
    <div className="bg-surface-container-low rounded-3xl p-6">
      <h2 className="text-xl font-bold mb-6">
        Security
      </h2>

      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <span>Require Email Verification</span>
          <input type="checkbox" defaultChecked />
        </label>

        <label className="flex items-center justify-between">
          <span>Enable Two-Factor Authentication</span>
          <input type="checkbox" />
        </label>

        <label className="flex items-center justify-between">
          <span>Allow Doctor Self Registration</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
    </div>
  );
}