export default function GeneralSettingsCard() {
  return (
    <div className="bg-surface-container-low rounded-3xl p-6">
      <h2 className="text-xl font-bold mb-6">
        General Settings
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Platform Name
          </label>

          <input
            defaultValue="Maou3idy"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Support Email
          </label>

          <input
            defaultValue="support@maou3idy.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
          />
        </div>
      </div>
    </div>
  );
}