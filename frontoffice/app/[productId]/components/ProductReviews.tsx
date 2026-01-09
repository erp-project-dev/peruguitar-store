"use client";

import { BadgeCheck, Star, Stars } from "lucide-react";

import { ReviewGetCommand } from "@/features/commands/review/index.command";
import { Review } from "@/features/types/review.type";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const reviews = ReviewGetCommand.handle({
    product_id: productId,
  });

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Stars size={20} />
        Opiniones
      </h2>

      <div className="space-y-4">
        {reviews.map((review: Review) => (
          <div key={review.id} className="rounded-lg bg-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="font-semibold text-sm text-neutral-900">
                  {review.customer_name}
                </div>

                <BadgeCheck className="w-4 h-4 text-blue-800" />
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < Math.round(review.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-neutral-400"
                    }
                  />
                ))}
                <span className="ml-1 text-xs text-neutral-600">
                  {review.rating.toFixed(1)}
                </span>
              </div>
            </div>

            <p className="mt-1 text-sm text-neutral-800 leading-snug">
              {review.comment}
            </p>

            <div className="mt-2 text-xs text-neutral-500">
              {new Date(review.review_date).toLocaleDateString("es-PE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
