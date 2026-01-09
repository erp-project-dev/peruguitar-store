/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Undo } from "lucide-react";

import { Product } from "@/infrastracture/domain/product.entity";

import PageSection from "@/app/components/PageSection";
import Button from "@/app/components/Form/Button";

import { StoreCommand } from "@/app/api/store/store.command";
import { StoreClient } from "@/app/common/store.client";

import OrderForm from "./components/OrderForm";
import { orderEntryForm, OrderEntryForm } from "../shared/order.entry";
import { Order } from "@/infrastracture/domain/order.entity";

const storeClient = new StoreClient();

export default function CreateOrderPage() {
  const router = useRouter();

  const [form, setForm] = useState<OrderEntryForm>(() => ({
    ...orderEntryForm,
  }));

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const _products = await storeClient.execute<Product[]>(
          StoreCommand.CatalogFindAll,
          {
            query: { onlyStoreProducts: true },
          }
        );

        setProducts(_products);
      } catch {
        toast.error("Error loading initial data");
      }
    };

    loadInitialData();
  }, []);

  const [loading, setLoading] = useState(false);

  /* ---------------- UPDATE ---------------- */
  const update = <K extends keyof OrderEntryForm>(
    key: K,
    value: OrderEntryForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const newOrder = await storeClient.execute<Order>(
        StoreCommand.OrderCreate,
        {
          payload: form,
        }
      );

      toast.success("Order created");
      router.push(`/orders/${newOrder._id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error creating order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageSection
      title="Create Order"
      description="Create a new order in the store"
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
            disabled={loading}
          >
            Create order
          </Button>
        </>
      }
    >
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <OrderForm
            mode="create"
            order={form}
            onChange={update}
            products={products}
          />
        </div>
      </div>
    </PageSection>
  );
}
