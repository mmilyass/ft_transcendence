import Img from "next/image";
import { Review } from "@/types";

type ReviewsTeaserProps = {
  reviews: Review[];
  rating: number;
};

export default function ReviewsTeaser({
  reviews,
  rating,
}: ReviewsTeaserProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-surface-container-low p-6 rounded-3xl text-center">
        <span className="material-symbols-outlined text-3xl text-outline">
          rate_review
        </span>
        <p className="text-sm font-semibold text-on-surface mt-2">
          No reviews yet
        </p>
        <p className="text-xs text-on-surface-variant mt-1">
          Be the first patient to leave one after your visit.
        </p>
      </div>
    );
  }

  return (
    <a
      href="#reviews"
      className="bg-surface-container-low p-6 rounded-3xl flex items-center justify-between hover:bg-surface-container transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="flex -space-x-3">
          {reviews.slice(0, 4).map((review) => (
            <Img
              key={review.id}
              src={`https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(
                review.user.name
              )}`}
              alt={review.user.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          ))}
        </div>

        <div>
          <div className="font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-primary">
              star
            </span>
            {rating.toFixed(1)}
            <span className="text-on-surface-variant font-medium">
              ({reviews.length} review{reviews.length === 1 ? "" : "s"})
            </span>
          </div>
          <div className="text-sm text-on-surface-variant">
            See what patients are saying
          </div>
        </div>
      </div>

      <span className="text-primary font-semibold shrink-0 ml-2">
        View all
      </span>
    </a>
  );
}
