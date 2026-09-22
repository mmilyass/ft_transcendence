type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: string;
  bg: string;
};

export default function SummaryCard({
  title,
  value,
  description,
  icon,
  bg,
}: SummaryCardProps) {
  return (
    <div className={`p-6 rounded-3xl ${bg} flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
          <span className="material-symbols-outlined">
            {icon}
          </span>
        </div>

        <span className="text-xs font-bold uppercase tracking-widest">
          {title}
        </span>
      </div>

      <div>
        <h3 className="text-4xl font-extrabold">
          {value}
        </h3>

        <p className="text-sm text-on-surface-variant mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}