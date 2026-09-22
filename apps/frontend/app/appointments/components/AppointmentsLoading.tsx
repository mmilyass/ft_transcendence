export default function AppointmentsLoading() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="mt-4 text-sm text-slate-500">
        Loading appointments...
      </p>
    </div>
  );
}