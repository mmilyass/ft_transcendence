export default function AppointmentsEmpty() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined">
          calendar_today
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold">
        No appointments found
      </h3>

      <p className="text-sm text-slate-500 mt-2">
        No appointments match this filter.
      </p>
    </div>
  );
}