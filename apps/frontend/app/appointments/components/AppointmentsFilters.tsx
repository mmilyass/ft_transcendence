const STATUS_FILTERS = [
  "ALL",
  "BOOKED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type StatusFilter = (typeof STATUS_FILTERS)[number];

type Props = {
  filter: StatusFilter;
  onChange: (value: StatusFilter) => void;
};

export default function AppointmentsFilters({
  filter,
  onChange,
}: Props) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-4 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {STATUS_FILTERS.map((status) => {
          const active = filter === status;

          return (
            <button
              key={status}
              onClick={() => onChange(status)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {status === "ALL"
                ? "All Appointments"
                : status.charAt(0) +
                  status.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}