"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import PageSection from "@/app/components/PageSection";
import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { Order, OrderStatus } from "@/infrastracture/domain/order.entity";

import Button from "../components/Form/Button";
import DataTable from "../components/Form/DataTable/DataTable";

const storeClient = new StoreClient();

export default function Orders() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const data = await storeClient.execute<Order[]>(
          StoreCommand.OrderFindAll
        );

        setOrders(data);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Error loading orders";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleRemove = async (id: string) => {
    await storeClient.execute(StoreCommand.OrderRemove, { id });
    setOrders((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <PageSection
      title="Orders"
      description="Orders overview"
      loading={loading}
      actions={
        <Button
          onClick={() => router.push("/orders/create")}
          variant="info"
          icon={Plus}
          size="lg"
        >
          New order
        </Button>
      }
    >
      <DataTable<Order>
        data={orders}
        columns={[
          {
            key: "_id",
            label: "Order ID",
            width: 180,
            render: (value) => (
              <span className="text-xs text-neutral-400">
                {value as string}
              </span>
            ),
          },

          {
            key: "customer_name",
            label: "Customer",
            sortable: true,
            render: (value, row) => (
              <a
                href={`/orders/${row._id}`}
                className="text-blue-900 hover:underline"
              >
                {value}
              </a>
            ),
          },

          {
            key: "status",
            label: "Status",
            sortable: true,
            width: 140,
            align: "center",
            render: (value: OrderStatus) => {
              switch (value) {
                case "pending":
                  return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  );

                case "completed":
                  return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                      Completed
                    </span>
                  );

                case "cancelled":
                  return (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                      Cancelled
                    </span>
                  );

                default:
                  return null;
              }
            },
          },

          {
            key: "items",
            label: "Items",
            width: 90,
            align: "right",
            render: (value) => (Array.isArray(value) ? value.length : 0),
          },

          {
            key: "subtotal",
            label: "Subtotal",
            width: 160,
            align: "right",
            render: (value: number, row) => (
              <span className="font-medium whitespace-nowrap">
                {value.toLocaleString("es-PE", {
                  style: "currency",
                  currency: row.currency,
                  minimumFractionDigits: 2,
                })}
              </span>
            ),
          },

          {
            key: "total",
            label: "Total",
            sortable: true,
            width: 160,
            align: "right",
            render: (value: number, row) => (
              <span className="font-bold whitespace-nowrap">
                {value.toLocaleString("es-PE", {
                  style: "currency",
                  currency: row.currency,
                  minimumFractionDigits: 2,
                })}
              </span>
            ),
          },
        ]}
        actions={["remove"]}
        onRemove={handleRemove}
      />
    </PageSection>
  );
}
