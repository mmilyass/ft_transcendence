"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { submitReviewApi, type DoctorReview } from "@/lib/api";

type Props = {
  doctorId: string;
  doctorName: string;
  existingReview: DoctorReview | null;
  onClose: () => void;
  onSaved: (review: DoctorReview) => void;
};

export default function ReviewModal({
  doctorId,
  doctorName,
  existingReview,
  onClose,
  onSaved,
}: Props) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    try {
      setSubmitting(true);
      const review = await submitReviewApi(doctorId, {
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success(existingReview ? "Review updated" : "Review submitted — thank you!");
      onSaved(review);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">
            {existingReview ? "Edit your review" : "Leave a review"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          How was your visit with Dr. {doctorName}?
        </p>

        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="text-3xl transition-transform hover:scale-110"
              aria-label={`${star} star${star === 1 ? "" : "s"}`}
            >
              <span
                className={
                  star <= (hovered || rating) ? "text-amber-400" : "text-slate-200"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with other patients (optional)..."
          maxLength={1000}
          className="mt-6 h-32 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-slate-900"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-sm text-white disabled:opacity-50"
          >
            {submitting ? "Saving..." : existingReview ? "Update Review" : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
