import Img from "next/image";
import { Review } from "@/types";

type Props = {
  reviews: Review[];
  rating: number;
  reviewCount: number;
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className="material-symbols-outlined text-lg"
          style={{
            color: n <= Math.round(rating) ? "#f59e0b" : "var(--color-outline-variant, #cbd5e1)",
            fontVariationSettings: n <= Math.round(rating) ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function formatReviewDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function DoctorReviews({ reviews, rating, reviewCount }: Props) {
  return (
    <section id="reviews" className="scroll-mt-28">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-headline font-bold text-on-surface">
          Patient Reviews
        </h3>
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <StarRow rating={rating} />
            <span className="font-bold text-on-surface">{rating.toFixed(1)}</span>
            <span className="text-sm text-on-surface-variant">
              ({reviewCount} review{reviewCount === 1 ? "" : "s"})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="bg-surface-container-lowest p-8 rounded-3xl text-center">
          <span className="material-symbols-outlined text-4xl text-outline">
            rate_review
          </span>
          <p className="mt-2 font-semibold text-on-surface">No reviews yet</p>
          <p className="text-sm text-on-surface-variant">
            Reviews from patients who&apos;ve completed an appointment will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-surface-container-lowest p-6 rounded-3xl"
            >
              <div className="flex items-start gap-4">
                <Img
                  src={`https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(
                    review.user.name
                  )}`}
                  alt={review.user.name}
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="font-bold text-on-surface truncate">
                      {review.user.name}
                    </p>
                    <span className="text-xs text-on-surface-variant shrink-0">
                      {formatReviewDate(review.createdAt)}
                    </span>
                  </div>
                  <StarRow rating={review.rating} />
                  {review.comment && (
                    <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
