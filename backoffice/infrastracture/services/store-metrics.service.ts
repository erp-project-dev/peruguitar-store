import { Db } from "mongodb";
import { getDbInstance } from "../repositories/database";
import { StoreMetrics } from "../domain/store-metrics.entity";

export class StoreMetricsService {
  private async getCollections(db: Db) {
    const [catalog, merchants, brands] = await Promise.all([
      db.collection("catalog").find().toArray(),
      db.collection("merchants").find().toArray(),
      db.collection("brands").find().toArray(),
    ]);

    return { catalog, merchants, brands };
  }

  async find(): Promise<StoreMetrics | null> {
    const db = await getDbInstance();
    const { catalog, merchants, brands } = await this.getCollections(db);

    const now = new Date();

    const activeProducts = catalog.filter((p) => p.is_enabled);
    const pinnedProducts = catalog.filter((p) => p.is_pinned);

    const prices = catalog
      .map((p) => p.price)
      .filter((p) => typeof p === "number");

    const sortedPrices = [...prices].sort((a, b) => a - b);

    const averagePrice =
      prices.reduce((a, b) => a + b, 0) / (prices.length || 1);

    const medianPrice =
      sortedPrices.length === 0
        ? 0
        : sortedPrices[Math.floor(sortedPrices.length / 2)];

    const countBy = (key: string) =>
      catalog.reduce<Record<string, number>>((acc, item) => {
        const value = key.includes(".")
          ? key.split(".").reduce((o, k) => o?.[k], item)
          : item[key];
        if (!value) return acc;
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});

    const countByDate = (days: number) => {
      const from = new Date();
      from.setDate(from.getDate() - days);
      return catalog.filter(
        (p) => p.publish_date && new Date(p.publish_date) >= from
      ).length;
    };

    const imagesStats = catalog.reduce(
      (acc, p) => {
        const count = p.images?.length || 0;
        acc.total += count;
        if (count === 6) acc.withSix++;
        if (count < 3) acc.withLessThanThree++;
        return acc;
      },
      { total: 0, withSix: 0, withLessThanThree: 0 }
    );

    const merchantsMap = new Map(merchants.map((m) => [m._id, m]));
    const merchantsWithProducts = new Set(catalog.map((p) => p.merchant_id));

    const productsPerMerchantMap = catalog.reduce<Record<string, number>>(
      (acc, p) => {
        acc[p.merchant_id] = (acc[p.merchant_id] || 0) + 1;
        return acc;
      },
      {}
    );

    const productsPerMerchant = Object.values(productsPerMerchantMap);

    const byCity: Record<string, number> = {};
    const byDistrict: Record<string, number> = {};

    for (const product of catalog) {
      const merchant = merchantsMap.get(product.merchant_id);
      if (!merchant) continue;

      if (merchant.city) {
        byCity[merchant.city] = (byCity[merchant.city] || 0) + 1;
      }

      if (merchant.state) {
        byDistrict[merchant.state] = (byDistrict[merchant.state] || 0) + 1;
      }
    }

    // 🔹 PRODUCT COMPLETENESS (specs dinámicos)
    const productsWithCompleteSpecs = catalog.filter(
      (p) => p.specs && Object.keys(p.specs).length > 0
    ).length;

    const metrics: StoreMetrics = {
      generatedAt: now.toISOString(),

      totalProducts: catalog.length,
      totalActiveProducts: activeProducts.length,
      totalDisabledProducts: catalog.length - activeProducts.length,
      totalPinnedProducts: pinnedProducts.length,

      totalBrands: brands.length,
      brandsWithProducts: Object.keys(countBy("brand_id")).length,

      totalMerchants: merchants.length,
      activeMerchants: merchantsWithProducts.size,
      merchantsWithoutProducts: merchants.length - merchantsWithProducts.size,

      productsByBrand: countBy("brand_id"),
      productsByType: countBy("type_id"),
      productsByCondition: countBy("condition"),

      price: {
        min: prices.length ? Math.min(...prices) : 0,
        max: prices.length ? Math.max(...prices) : 0,
        average: Number(averagePrice.toFixed(2)),
        median: medianPrice,

        byCurrency: countBy("currency"),
        averageByBrand: {},
        averageByType: {},
      },

      pinnedRatio:
        catalog.length === 0 ? 0 : pinnedProducts.length / catalog.length,

      premiumRatio:
        catalog.filter((p) =>
          ["high_end", "boutique", "vintage"].includes(p.type_id)
        ).length / (catalog.length || 1),

      vintageAndRareCount: catalog.filter((p) =>
        ["vintage", "rare"].includes(p.type_id)
      ).length,

      publish: {
        latest:
          catalog
            .map((p) => p.publish_date)
            .filter(Boolean)
            .sort()
            .at(-1) || null,

        oldest:
          catalog
            .map((p) => p.publish_date)
            .filter(Boolean)
            .sort()
            .at(0) || null,

        last7Days: countByDate(7),
        last30Days: countByDate(30),
        perWeek: countByDate(30) / 4,
      },

      merchantLocation: {
        byCity,
        byDistrict,
      },

      images: {
        averagePerProduct: imagesStats.total / (catalog.length || 1),
        withSixImages: imagesStats.withSix,
        withLessThanThree: imagesStats.withLessThanThree,
      },

      productCompleteness: {
        withCompleteSpecs: productsWithCompleteSpecs,
        withIncompleteSpecs: catalog.length - productsWithCompleteSpecs,
      },

      valueSignals: {
        fixedPriceCount: catalog.filter((p) => p.price_type === "fixed").length,

        negotiablePriceCount: catalog.filter(
          (p) => p.price_type === "negotiable"
        ).length,

        productsWithHighCondition: catalog.filter((p) => p.condition_score >= 4)
          .length,

        averageConditionScore:
          catalog.reduce((a, p) => a + (p.condition_score || 0), 0) /
          (catalog.length || 1),
      },

      merchants: {
        productsPerMerchant: {
          min: productsPerMerchant.length
            ? Math.min(...productsPerMerchant)
            : 0,
          max: productsPerMerchant.length
            ? Math.max(...productsPerMerchant)
            : 0,
          average:
            productsPerMerchant.reduce((a, b) => a + b, 0) /
            (productsPerMerchant.length || 1),
        },
        topMerchantsByListings: [],
      },

      brands: {
        topBrandsByListings: [],
        brandMarketValue: {},
      },
    };

    return metrics;
  }
}
