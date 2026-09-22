type MetricCardProps = {
  title: string;
  value: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  cardClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

export default function MetricCard({
  title,
  value,
  icon,
  badge,
  badgeColor = 'bg-primary/10 text-primary',
  cardClassName = 'bg-surface-container-lowest',
  iconContainerClassName = 'bg-primary-fixed',
  iconClassName = 'text-on-primary-fixed-variant',
}: MetricCardProps) {
  return (
    <div
      className={`p-6 rounded-xl ${cardClassName} flex flex-col justify-between h-40`}
    >
      <div className="flex justify-between items-start">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconContainerClassName}`}
        >
          <span
            className={`material-symbols-outlined ${iconClassName}`}
          >
            {icon}
          </span>
        </div>

        {badge && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${badgeColor}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
          {title}
        </p>

        <p className="text-3xl font-extrabold text-on-surface">
          {value}
        </p>
      </div>
    </div>
  );
}