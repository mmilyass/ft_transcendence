export default function AppointmentSettingsCard() {
  return (
    <div className="bg-surface-container-low rounded-3xl p-6">
      <h2 className="text-xl font-bold mb-6">
        Appointment Settings
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Default Appointment Duration (minutes)
          </label>

          <input
            type="number"
            defaultValue={30}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Max Future Booking Days
          </label>

          <input
            type="number"
            defaultValue={60}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
          />
        </div>
      </div>
    </div>
  );
}