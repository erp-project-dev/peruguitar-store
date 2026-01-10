"use client";

import { useEffect, useState } from "react";
import {
  Package,
  PackageCheck,
  PackageX,
  Store,
  Users,
  Calendar,
  DollarSign,
  Receipt,
  Box,
} from "lucide-react";

import PageSection from "@/app/components/PageSection";

import { StoreMetrics } from "@/infrastracture/domain/store-metrics.entity";

import { StoreClient } from "./common/store.client";
import { StoreCommand } from "./api/store/store.command";

import MetricSection from "./components/Dashboard/MetricSection";
import MetricGrid from "./components/Dashboard/MetricGrid";
import { MetricCard } from "./components/Dashboard/MetricCard";
import { MetricChart } from "./components/Dashboard/MetricChart";

const storeClient = new StoreClient();

const EMPTY_METRICS: StoreMetrics = {
  products: {
    total: 0,
    active: 0,
    disabled: 0,
    storeCategoryTotal: 0,
  },
  categories: [],
  merchants: {
    total: 0,
    active: 0,
  },
  store: {
    totalCustomers: 0,
    totalOrders: 0,
    ordersPerWeek: {
      orders: 0,
      avgSale: 0,
    },
  },
  orders: {
    lastOrder: "",
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    refundedOrders: 0,
    ordersPerMonth: [],
  },
};

export default function Home() {
  const [metrics, setMetrics] = useState<StoreMetrics>(EMPTY_METRICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storeClient
      .execute<StoreMetrics>(StoreCommand.StoreMetricsFind, {
        options: { cacheTtlSeconds: 60 * 15 },
      })
      .then(setMetrics)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <PageSection title="Dashboard" description="Store overview">
        <p className="text-sm text-red-500">Failed to load metrics</p>
      </PageSection>
    );
  }

  return (
    <PageSection
      title="Dashboard"
      description="General store metrics"
      loading={loading}
    >
      <div className="space-y-14">
        {/* ================= STORE ================= */}
        <MetricSection title="Store">
          <MetricGrid>
            <MetricCard
              label="Total customers"
              value={metrics.store.totalCustomers}
              icon={<Users size={18} />}
            />
            <MetricCard
              label="Total orders"
              value={metrics.store.totalOrders}
              icon={<Calendar size={18} />}
            />
            <MetricCard
              label="Orders (last 7 days)"
              value={metrics.store.ordersPerWeek.orders}
              variant="info"
              icon={<Calendar size={18} />}
            />
            <MetricCard
              label="Avg sale (last 7 days)"
              value={metrics.store.ordersPerWeek.avgSale.toLocaleString(
                "es-PE",
                {
                  style: "currency",
                  currency: "PEN",
                }
              )}
              variant="success"
              icon={<DollarSign size={18} />}
            />
          </MetricGrid>
        </MetricSection>

        {/* ================= ORDERS ================= */}
        <MetricSection title="Orders">
          <MetricGrid>
            <MetricCard
              label="Pending orders"
              value={metrics.orders.pendingOrders}
              variant="warning"
              icon={<Receipt size={18} />}
            />
            <MetricCard
              label="Completed orders"
              value={metrics.orders.completedOrders}
              variant="success"
              icon={<Receipt size={18} />}
            />
            <MetricCard
              label="Cancelled orders"
              value={metrics.orders.cancelledOrders}
              variant="danger"
              icon={<Receipt size={18} />}
            />
            <MetricCard
              label="Refunded orders"
              value={metrics.orders.refundedOrders}
              variant="info"
              icon={<Receipt size={18} />}
            />
            <MetricCard
              label="Last Order"
              value={metrics.orders.lastOrder}
              icon={<Receipt size={18} />}
            />
          </MetricGrid>

          <MetricGrid cols={2}>
            <MetricChart
              title="Orders per month"
              description="Total number of orders grouped by month"
              data={metrics.orders.ordersPerMonth.map((o) => ({
                label: `${o.month} ${o.year}`,
                value: o.totalOrders,
              }))}
            />

            <MetricChart
              title="Revenue per month"
              description="Total revenue grouped by month (PEN)"
              data={metrics.orders.ordersPerMonth.map((o) => ({
                label: `${o.month} ${o.year}`,
                value: o.totalRevenue,
              }))}
              formatter={(value) =>
                value.toLocaleString("es-PE", {
                  style: "currency",
                  currency: "PEN",
                })
              }
              variant="success"
            />
          </MetricGrid>
        </MetricSection>

        {/* ================= MERCHANTS ================= */}
        <MetricSection title="Merchants">
          <MetricGrid>
            <MetricCard
              label="Total merchants"
              value={metrics.merchants.total}
              icon={<Users size={18} />}
            />
            <MetricCard
              label="Active merchants"
              value={metrics.merchants.active}
              variant="success"
              icon={<Users size={18} />}
            />
          </MetricGrid>
        </MetricSection>

        {/* ================= PRODUCTS ================= */}
        <MetricSection title="Products">
          <MetricGrid>
            <MetricCard
              label="Total products"
              value={metrics.products.total}
              icon={<Package size={18} />}
            />
            <MetricCard
              label="Active products"
              value={metrics.products.active}
              variant="success"
              icon={<PackageCheck size={18} />}
            />
            <MetricCard
              label="Disabled products"
              value={metrics.products.disabled}
              variant="warning"
              icon={<PackageX size={18} />}
            />
            <MetricCard
              label="Store category products"
              value={metrics.products.storeCategoryTotal}
              variant="info"
              icon={<Store size={18} />}
            />
          </MetricGrid>
        </MetricSection>

        {/* ================= CATEGORIES ================= */}
        <MetricSection title="Categories">
          <MetricGrid cols={2}>
            {metrics.categories.map((c) => (
              <MetricCard
                key={c.id}
                label={c.name}
                value={c.products}
                icon={<Box size={18} />}
              />
            ))}
          </MetricGrid>
        </MetricSection>
      </div>
    </PageSection>
  );
}
