"use client";

import { DoctorReview, UserBooking } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  formatDate,
  formatTime,
  statusBadgeConfig,
} from "../utils";

type Props = {
  booking: UserBooking;
  cancelingId: string | null;
  onCancel: (booking: UserBooking) => void;
  existingReview?: DoctorReview;
  onReview?: (booking: UserBooking) => void;
};

export default function AppointmentCard({
  booking,
  cancelingId,
  onCancel,
  existingReview,
  onReview,
}: Props) {
  const router = useRouter();

  const doctorName = booking.doctor?.user?.name || "Medical Professional";

  const serviceName =
    booking.service?.name || "Consultation Service";

  const badge = statusBadgeConfig(booking.status);
  const doctorId = booking.doctor?.id;
  return (
    <article className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex justify-between flex-wrap gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Ref: #{booking.id.slice(0, 8)}
            </span>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}
              />
              {badge.label}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold">
              Dr. {doctorName}
            </h2>

            <p className="text-slate-600 text-sm">
              {serviceName}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <span>{formatDate(booking.date)}</span>

            <span>
              {formatTime(booking.start_time)} -{" "}
              {formatTime(booking.end_time)}
            </span>

            <span className="font-bold text-slate-900">
              ${booking.service?.price ?? 0}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          {booking.status === "BOOKED" && (
            <button
              onClick={() => onCancel(booking)}
              disabled={cancelingId === booking.id}
              className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50"
            >
              {cancelingId === booking.id
                ? "Cancelling..."
                : "Cancel"}
            </button>
          )}

        {booking.status === "COMPLETED" && doctorId && onReview && (
          <button
            onClick={() => onReview(booking)}
            className="px-4 py-2 rounded-xl border border-amber-200 text-amber-700 bg-amber-50 flex items-center gap-1.5"
          >
            <span className="text-base leading-none">
              {existingReview ? "★" : "☆"}
            </span>
            {existingReview ? "Edit Review" : "Leave a Review"}
          </button>
        )}

        {doctorId && (
        <button
            onClick={() =>
            router.push(`/booking?doctorId=${doctorId}`)
            }
            className="px-4 py-2 rounded-xl bg-slate-900 text-white"
        >
            Book Again
        </button>
        )}
        </div>
      </div>
    </article>
  );
}