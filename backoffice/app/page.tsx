"use client";

import { useEffect, useState } from "react";
import {
  Package,
  PackageCheck,
  PackageX,
  Pin,
  Store,
  Users,
  Calendar,
  Image as ImageIcon,
  DollarSign,
  Guitar,
  Tag,
  MapPin,
} from "lucide-react";

import PageSection from "@/app/components/PageSection";

import { StoreMetrics } from "@/infrastracture/domain/store-metrics.entity";

import { StoreClient } from "./common/store.client";
import { StoreCommand } from "./api/store/store.command";

import MetricSection from "./components/Dashboard/MetricSection";
import MetricGrid from "./components/Dashboard/MetricGrid";
import { MetricCard } from "./components/Dashboard/MetricCard";
import MetricTable from "./components/Dashboard/MetricTable";
import { DataSyncButton } from "./components/Dashboard/DataSyncButton";

const storeClient = new StoreClient();

export default function Home() {
  const [metrics, setMetrics] = useState<StoreMetrics>({
    generatedAt: "",
    totalProducts: 0,
    totalActiveProducts: 0,
    totalDisabledProducts: 0,
    totalPinnedProducts: 0,
    totalBrands: 0,
    brandsWithProducts: 0,
    totalMerchants: 0,
    activeMerchants: 0,
    merchantsWithoutProducts: 0,
    productsByBrand: {},
    productsByType: {},
    productsByCondition: {},
    price: {
      min: 0,
      max: 0,
      average: 0,
      median: 0,
      byCurrency: {},
      averageByBrand: {},
      averageByType: {},
    },
    pinnedRatio: 0,
    premiumRatio: 0,
    vintageAndRareCount: 0,
    publish: {
      latest: null,
      oldest: null,
      last7Days: 0,
      last30Days: 0,
      perWeek: 0,
    },
    merchantLocation: {
      byCity: {},
      byDistrict: {},
    },
    images: {
      averagePerProduct: 0,
      withSixImages: 0,
      withLessThanThree: 0,
    },
    productCompleteness: {
      withCompleteSpecs: 0,
      withIncompleteSpecs: 0,
    },
    valueSignals: {
      fixedPriceCount: 0,
      negotiablePriceCount: 0,
      productsWithHighCondition: 0,
      averageConditionScore: 0,
    },
    merchants: {
      productsPerMerchant: {
        min: 0,
        max: 0,
        average: 0,
      },
      topMerchantsByListings: [],
    },
    brands: {
      topBrandsByListings: [],
      brandMarketValue: {},
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storeClient
      .execute<StoreMetrics>(StoreCommand.StoreMetricsFind, {
        cacheTtlSeconds: 60,
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
      actions={<DataSyncButton />}
    >
      <div className="space-y-14">
        {/* ================= PRODUCTS ================= */}
        <MetricSection title="Products">
          <MetricGrid>
            <MetricCard
              label="Total products"
              value={metrics?.totalProducts}
              icon={<Package size={18} />}
            />
            <MetricCard
              label="Active products"
              value={metrics?.totalActiveProducts}
              variant="success"
              icon={<PackageCheck size={18} />}
            />
            <MetricCard
              label="Disabled products"
              value={metrics?.totalDisabledProducts}
              variant="warning"
              icon={<PackageX size={18} />}
            />
            <MetricCard
              label="Pinned products"
              value={metrics?.totalPinnedProducts}
              variant="info"
              icon={<Pin size={18} />}
            />
          </MetricGrid>
        </MetricSection>

        {/* ================= BRANDS ================= */}
        <MetricSection title="Brands">
          <MetricGrid cols={2}>
            <MetricCard
              label="Total brands"
              value={metrics?.totalBrands}
              icon={<Store size={18} />}
            />
            <MetricCard
              label="Brands with products"
              value={metrics?.brandsWithProducts}
              variant="success"
              icon={<Store size={18} />}
            />
          </MetricGrid>

          <MetricGrid cols={2}>
            <MetricTable
              title="Products by brand"
              data={metrics?.productsByBrand}
              iconResolver={() => Guitar}
            />
          </MetricGrid>
        </MetricSection>

        {/* ================= CLASSIFICATION ================= */}
        <MetricSection title="Product classification">
          <MetricGrid cols={2}>
            <MetricTable
              title="Products by type"
              data={metrics?.productsByType}
              iconResolver={() => Tag}
            />

            <MetricTable
              title="Products by condition"
              data={metrics?.productsByCondition}
              iconResolver={() => Package}
            />
          </MetricGrid>
        </MetricSection>

        {/* ================= MERCHANTS ================= */}
        <MetricSection title="Merchants">
          <MetricGrid>
            <MetricCard
              label="Total merchants"
              value={metrics?.totalMerchants}
              icon={<Users size={18} />}
            />
            <MetricCard
              label="Active merchants"
              value={metrics?.activeMerchants}
              variant="success"
              icon={<Users size={18} />}
            />
            <MetricCard
              label="Without products"
              value={metrics?.merchantsWithoutProducts}
              variant="warning"
              icon={<Users size={18} />}
            />
          </MetricGrid>

          <MetricGrid cols={2}>
            <MetricTable
              title="Merchants by city"
              data={metrics?.merchantLocation.byCity}
              iconResolver={() => MapPin}
            />
          </MetricGrid>
        </MetricSection>

        {/* ================= PRICING ================= */}
        <MetricSection title="Pricing">
          <MetricGrid>
            <MetricCard
              label="Min price"
              value={metrics?.price.min}
              icon={<DollarSign size={18} />}
            />
            <MetricCard
              label="Max price"
              value={metrics?.price.max}
              icon={<DollarSign size={18} />}
            />
            <MetricCard
              label="Average price"
              value={Math.round(metrics?.price.average)}
              icon={<DollarSign size={18} />}
            />
            <MetricCard
              label="Median price"
              value={metrics?.price.median}
              icon={<DollarSign size={18} />}
            />
          </MetricGrid>

          <MetricGrid cols={2}>
            <MetricTable
              title="Products by currency"
              data={metrics?.price.byCurrency}
              iconResolver={() => DollarSign}
            />
          </MetricGrid>
        </MetricSection>

        {/* ================= CONTENT QUALITY ================= */}
        <MetricSection title="Content quality">
          <MetricGrid cols={2}>
            <MetricCard
              label="Avg images / product"
              value={Number(metrics?.images.averagePerProduct.toFixed(1))}
              icon={<ImageIcon size={18} />}
            />
            <MetricCard
              label="With 6 images"
              value={metrics?.images.withSixImages}
              variant="success"
              icon={<ImageIcon size={18} />}
            />
          </MetricGrid>

          <MetricGrid cols={2}>
            <MetricCard
              label="Less than 3 images"
              value={metrics?.images.withLessThanThree}
              variant="warning"
              icon={<ImageIcon size={18} />}
            />
          </MetricGrid>
        </MetricSection>

        {/* ================= ACTIVITY ================= */}
        <MetricSection title="Publishing activity">
          <MetricGrid cols={2}>
            <MetricCard
              label="Last 7 days"
              value={metrics?.publish.last7Days}
              icon={<Calendar size={18} />}
            />
            <MetricCard
              label="Last 30 days"
              value={metrics?.publish.last30Days}
              icon={<Calendar size={18} />}
            />
          </MetricGrid>

          <MetricGrid cols={2}>
            <MetricCard
              label="Products / week"
              value={Number(metrics?.publish.perWeek.toFixed(1))}
              variant="info"
              icon={<Calendar size={18} />}
            />
          </MetricGrid>
        </MetricSection>
      </div>
    </PageSection>
  );
}
