"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import PageSection from "@/app/components/PageSection";
import DataTable from "../components/Form/DataTable/DataTable";

import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { Review } from "@/infrastracture/domain/review.entity";
import Button from "../components/Form/Button";
import { Plus } from "lucide-react";

const storeClient = new StoreClient();

export default function Reviews() {
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await storeClient.execute<Review[]>(
          StoreCommand.ReviewFindAll
        );
        setReviews(data);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Error loading reviews";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (id: string, row: Partial<Review>) => {
    try {
      const updated = await storeClient.execute<Review>(
        StoreCommand.ReviewUpdate,
        {
          id,
          payload: row,
        }
      );

      setReviews((prev) => prev.map((r) => (r._id === id ? updated : r)));
    } catch (e) {
      toast.error("Error updating review");
    }
  };

  const handleInsert = async (row: Partial<Review>) => {
    try {
      const created = await storeClient.execute<Review>(
        StoreCommand.ReviewCreate,
        {
          payload: row,
        }
      );

      setReviews((prev) => [created, ...prev]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error creating review";
      toast.error(message);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await storeClient.execute(StoreCommand.ReviewRemove, { id });
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Error removing review");
    }
  };

  return (
    <PageSection
      title="Reviews"
      description="Customer reviews for store products"
      loading={loading}
      actions={
        <Button
          onClick={() => router.push("/reviews/create")}
          variant="info"
          icon={Plus}
          size="lg"
        >
          New review
        </Button>
      }
    >
      <DataTable<Review>
        data={reviews}
        actions={["edit", "remove"]}
        onSave={handleSave}
        onInsert={handleInsert}
        onRemove={handleRemove}
        columns={[
          {
            key: "order_id",
            label: "Order ID",
            width: 160,
            sortable: true,
            render: (value) => (
              <span className="font-mono text-xs text-neutral-400">
                {value}
              </span>
            ),
          },
          {
            key: "product_id",
            label: "Product ID",
            width: 160,
            sortable: true,
            render: (value) => (
              <span className="font-mono text-xs text-neutral-400">
                {value}
              </span>
            ),
          },
          {
            key: "customer_name",
            label: "Customer",
            width: 180,
            sortable: true,
          },
          {
            key: "rating",
            label: "Rating",
            width: 100,
            editable: true,
            render: (value) => (
              <span className="text-sm font-semibold">{value ?? "-"} / 5</span>
            ),
          },
          {
            key: "comment",
            label: "Comment",
            editable: true,
            truncate: false,
          },
          {
            key: "review_date",
            label: "Review Date",
            width: 160,
            sortable: true,
            render: (value) => (
              <span className="text-xs text-neutral-500">
                {value ? new Date(value).toLocaleDateString() : "-"}
              </span>
            ),
          },
        ]}
      />
    </PageSection>
  );
}
