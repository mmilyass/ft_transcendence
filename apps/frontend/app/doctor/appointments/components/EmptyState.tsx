export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <span className="material-symbols-outlined text-4xl text-outline">
        inbox
      </span>
      <p className="text-on-surface-variant">
        No appointments found
      </p>
    </div>
  );
}