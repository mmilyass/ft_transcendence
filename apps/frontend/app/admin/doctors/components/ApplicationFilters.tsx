'use client';
import { useRouter } from 'next/navigation';

export default function ApplicationFilters({ role }: { role: string }) {
  const router = useRouter();
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set('page', '1');

    router.push(`/admin/doctors?${params.toString()}`);
  };
  return (
    <div className="flex items-center gap-2 p-1.5 bg-surface-container-low rounded-2xl">
      {[
        { label: "All", value: "" },
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ].map((item) => {
        const isActive = role === item.value || (!role && item.value === "");

        return (
          <button
            key={item.label}
            onClick={() => updateParam("role", item.value)}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}