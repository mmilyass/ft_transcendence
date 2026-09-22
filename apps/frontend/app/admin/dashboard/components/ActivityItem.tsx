import Image from 'next/image';

type ActivityItemProps = {
  title: string;
  description: string;
  time: string;
  image?: string | null;
  icon?: string;
  iconBg?: string;
};

export default function ActivityItem({
  title,
  description,
  time,
  image,
  icon = 'assignment_late',
  iconBg = 'bg-tertiary-container',
}: ActivityItemProps) {
  return (
    <div className="flex gap-4">
      {image ? (
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Image
            src={image}
            alt={title}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
        >
          <span className="material-symbols-outlined text-white">
            {icon}
          </span>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-on-surface">
          {title}
        </p>

        <p className="text-xs text-on-surface-variant mb-1">
          {description}
        </p>

        <span className="text-[10px] text-outline font-medium">
          {time}
        </span>
      </div>
    </div>
  );
}