export interface StoreMetrics {
  /**
   * GLOBAL
   */
  generatedAt: string; // ISO date
  totalProducts: number;
  totalActiveProducts: number;
  totalDisabledProducts: number;
  totalPinnedProducts: number;

  totalBrands: number;
  brandsWithProducts: number;

  totalMerchants: number;
  activeMerchants: number;
  merchantsWithoutProducts: number;

  /**
   * PRODUCTS BY CATEGORY
   */
  productsByBrand: Record<string, number>;
  productsByType: Record<string, number>;
  productsByCondition: Record<string, number>;

  /**
   * PRICE METRICS
   */
  price: {
    min: number;
    max: number;
    average: number;
    median: number;

    byCurrency: Record<string, number>;
    averageByBrand: Record<string, number>;
    averageByType: Record<string, number>;
  };

  /**
   * QUALITY / CURATION
   */
  pinnedRatio: number; // 0–1
  premiumRatio: number; // (high_end + boutique + vintage) / total
  vintageAndRareCount: number;

  /**
   * TIME / PUBLISHING
   */
  publish: {
    latest: string | null; // ISO
    oldest: string | null; // ISO

    last7Days: number;
    last30Days: number;

    perWeek: number; // promedio
  };

  merchantLocation: {
    byCity: Record<string, number>;
    byDistrict: Record<string, number>;
  };

  /**
   * CONTENT QUALITY
   */
  images: {
    averagePerProduct: number;
    withSixImages: number;
    withLessThanThree: number;
  };

  /**
   * PRODUCT COMPLETENESS
   * (simple, flexible, future-proof)
   */
  productCompleteness: {
    withCompleteSpecs: number;
    withIncompleteSpecs: number;
  };

  /**
   * VALUE SIGNALS (non-monetary)
   */
  valueSignals: {
    fixedPriceCount: number;
    negotiablePriceCount: number;

    productsWithHighCondition: number; // condition_score >= 4
    averageConditionScore: number;
  };

  /**
   * MERCHANT INSIGHTS
   */
  merchants: {
    productsPerMerchant: {
      min: number;
      max: number;
      average: number;
    };

    topMerchantsByListings: Array<{
      merchant_id: string;
      totalProducts: number;
    }>;
  };

  /**
   * BRAND INSIGHTS
   */
  brands: {
    topBrandsByListings: Array<{
      brand_id: string;
      totalProducts: number;
    }>;

    brandMarketValue: Record<string, number>; // avg price * count
  };
}
