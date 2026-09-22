'use client';

interface ProfileMenuItemProps {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export default function ProfileMenuItem({
  icon,
  label,
  onClick,
  danger = false,
}: ProfileMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 text-left
        transition-colors hover:bg-slate-100
        ${danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700'}
      `}
    >
      <span className="material-symbols-outlined">
        {icon}
      </span>

      <span className="font-medium">
        {label}
      </span>
    </button>
  );
}