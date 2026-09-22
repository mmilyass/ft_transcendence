interface Props {
  status: "Active" | "Inactive";
}

export default function UserStatusBadge({
  status,
}: Props) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-[11px] font-bold rounded-full">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-full">
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
      Inactive
    </span>
  );
}