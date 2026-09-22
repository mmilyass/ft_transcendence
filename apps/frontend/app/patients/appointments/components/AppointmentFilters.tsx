interface Props {
  selected: string;
  onChange: (value: string) => void;
}

export default function AppointmentFilters({
  selected,
  onChange,
}: Props) {
  const filters = [
    'ALL',
    'PENDING',
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED',
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            selected === filter
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}