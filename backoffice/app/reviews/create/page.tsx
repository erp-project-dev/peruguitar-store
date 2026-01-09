"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { ProductReview, Review } from "@/infrastracture/domain/review.entity";

import PageSection from "@/app/components/PageSection";
import Select from "@/app/components/Form/Select";
import Button from "@/app/components/Form/Button";
import Input from "@/app/components/Form/Input";

import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";
import { RATING_OPTIONS } from "@/app/common/data/review-rating.data";

const storeClient = new StoreClient();

export default function ReviewCreate() {
  const [items, setItems] = useState<ProductReview[]>([]);
  const [selected, setSelected] = useState<ProductReview | null>(null);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await storeClient.execute<ProductReview[]>(
          StoreCommand.ProductReviewFindProductsWithoutReview
        );
        setItems(data);
      } catch {
        toast.error("Error loading products pending review");
      } finally {
        setLoaded(true);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    if (!selected) return;

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setLoading(true);

    try {
      await storeClient.execute<Review>(StoreCommand.ReviewCreate, {
        payload: {
          order_id: selected.order_id,
          product_id: selected.product_id,
          product_name: selected.product_name,
          customer_id: selected.customer_id,
          customer_name: selected.customer_name,
          rating,
          comment,
          review_date: new Date().toISOString(),
        },
      });

      toast.success("Review created successfully");

      setItems((prev) =>
        prev.filter((i) => i.product_id !== selected.product_id)
      );

      setSelected(null);
      setRating(5);
      setComment("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error creating review");
    } finally {
      setLoading(false);
    }
  };

  const noPendingReviews = loaded && items.length === 0;

  return (
    <PageSection
      title="Create Review"
      description="Add a review to a sold product"
      actions={
        <Button
          variant="success"
          size="lg"
          icon={Save}
          onClick={handleSave}
          disabled={!selected || loading || noPendingReviews}
        >
          Save review
        </Button>
      }
    >
      <div className="space-y-6 max-w-3xl mx-auto">
        {noPendingReviews ? (
          <div className="rounded-md border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
            There are no products pending review at the moment.
          </div>
        ) : (
          <>
            <div>
              <label className="text-xs font-semibold text-neutral-500">
                Product
              </label>
              <Select
                value={selected?.product_id ?? ""}
                options={items.map((i) => ({
                  label: `${i.order_id}: ${i.product_name}`,
                  value: i.product_id,
                }))}
                onChange={(value) =>
                  setSelected(items.find((i) => i.product_id === value) ?? null)
                }
              />
            </div>

            {selected && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-500">
                      Product
                    </label>
                    <div className="text-sm">{selected.product_name}</div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-500">
                      Customer
                    </label>
                    <div className="text-sm">{selected.customer_name}</div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500">
                    Rating
                  </label>
                  <Select
                    value={rating}
                    options={RATING_OPTIONS.map((v) => ({
                      label: `${v} / 5`,
                      value: v,
                    }))}
                    onChange={(value) => setRating(Number(value))}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500">
                    Comment
                  </label>
                  <Input
                    type="textarea"
                    value={comment}
                    onChange={(value) => setComment(value)}
                    rows={4}
                    placeholder="Customer feedback…"
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </PageSection>
  );
}
