import { UserBooking } from "@/lib/api";

export function formatDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function statusBadgeConfig(status: UserBooking["status"]) {
  switch (status) {
    case "BOOKED":
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
        dot: "bg-emerald-500",
        label: "Confirmed",
      };

    case "COMPLETED":
      return {
        bg: "bg-sky-50 text-sky-700 border-sky-200/60",
        dot: "bg-sky-500",
        label: "Completed",
      };

    case "CANCELLED":
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-200/60",
        dot: "bg-rose-500",
        label: "Cancelled",
      };

    default:
      return {
        bg: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
        label: status,
      };
  }
}