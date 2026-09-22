interface Props {
  role: string;
}

export default function UserRoleBadge({ role }: Props) {
  return (
      <span className="px-3 py-1 bg-surface-container-highest text-on-surface text-[11px] font-bold rounded-full">
        {role}      
      </span>
    );
}