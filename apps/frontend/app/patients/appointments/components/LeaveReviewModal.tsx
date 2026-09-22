'use client';

import { useState } from 'react';

interface LeaveReviewModalProps {
  doctorName: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export default function LeaveReviewModal({
  doctorName,
  onClose,
  onSubmit,
}: LeaveReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;

    onSubmit(rating, comment);

    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Review {doctorName}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          How was your experience?
        </p>

        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="text-3xl transition-transform hover:scale-110"
            >
              <span
                className={
                  star <= (hovered || rating)
                    ? 'text-yellow-400'
                    : 'text-slate-300'
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
          placeholder="Share your experience..."
          className="mt-6 h-32 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}