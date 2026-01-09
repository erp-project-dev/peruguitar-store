"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Undo } from "lucide-react";

import { Product } from "@/infrastracture/domain/product.entity";
import { Order } from "@/infrastracture/domain/order.entity";

import PageSection from "@/app/components/PageSection";
import Button from "@/app/components/Form/Button";

import { StoreCommand } from "@/app/api/store/store.command";
import { StoreClient } from "@/app/common/store.client";

import { orderEntryForm, OrderEntryForm } from "../shared/order.entry";
import OrderForm from "../create/components/OrderForm";

const storeClient = new StoreClient();

/* ================= PAGE ================= */

export default function EditOrderPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();

  const [form, setForm] = useState<OrderEntryForm>(orderEntryForm);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [onlyView, setOnlyView] = useState(false);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        const [order, storeProducts] = await Promise.all([
          storeClient.execute<Order>(StoreCommand.OrderFindById, {
            id: params.orderId,
          }),
          storeClient.execute<Product[]>(StoreCommand.CatalogFindAll, {
            query: { onlyStoreProducts: true },
          }),
        ]);

        if (order.status !== "pending") {
          setOnlyView(true);
        }

        setForm(mapOrderToForm(order));
        setProducts(storeProducts);
      } catch (e) {
        toast.error("Error loading order");
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [params.orderId, router]);

  /* ---------------- UPDATE FORM ---------------- */
  const update = <K extends keyof OrderEntryForm>(
    key: K,
    value: OrderEntryForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- SAVE ---------------- */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      await storeClient.execute(StoreCommand.OrderUpdate, {
        id: form._id,
        payload: form,
      });

      if (form.status !== "pending") {
        setOnlyView(true);
      }

      toast.success("Order updated");
      router.push(`/orders/${form._id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error updating order");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <PageSection
      title={`Edit Order ${form._id ?? ""}`}
      description="Update order information"
      loading={loading}
      actions={
        <>
          <Button
            size="lg"
            icon={Undo}
            onClick={() => router.push("/orders")}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="success"
            size="lg"
            icon={Save}
            onClick={handleSubmit}
            disabled={loading || onlyView}
          >
            Save changes
          </Button>
        </>
      }
    >
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {!loading && (
            <OrderForm
              mode={onlyView ? "view" : "edit"}
              order={form}
              onChange={update}
              products={products}
            />
          )}
        </div>
      </div>
    </PageSection>
  );
}

/* ================= HELPERS ================= */

function mapOrderToForm(order: Order): OrderEntryForm {
  return {
    _id: order._id,
    status: order.status,

    customer_id: order.customer_id,
    customer_name: order.customer_name,

    tax_id: order.tax_id,
    tax_type: order.tax_type,

    items: order.items,

    currency: order.currency,
    subtotal: order.subtotal,
    total: order.total,

    notes: order.notes ?? "",
  };
}
