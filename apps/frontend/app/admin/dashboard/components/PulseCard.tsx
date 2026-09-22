type PulseCardProps = {
  title: string;
  value: string;
  unit: string;
  icon: string;
  bg: string;
};

export default function PulseCard({
  title,
  value,
  unit,
  icon,
  bg,
}: PulseCardProps) {
  return (
    <div
      className={`p-6 rounded-2xl ${bg} relative overflow-hidden group`}
    >
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-4">
          {title}
        </p>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold">
            {value}
          </span>

          <span className="text-xs font-bold">
            {unit}
          </span>
        </div>
      </div>

      <div className="absolute -right-4 -bottom-4 opacity-10">
        <span className="material-symbols-outlined text-[120px]">
          {icon}
        </span>
      </div>
    </div>
  );
}