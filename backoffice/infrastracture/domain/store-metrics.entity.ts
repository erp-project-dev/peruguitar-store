export interface StoreMetrics {
  products: {
    total: number;
    active: number;
    disabled: number;

    storeCategoryTotal: number;
  };

  categories: {
    id: string;
    name: string;
    products: number;
  }[];

  merchants: {
    total: number;
    active: number;
  };

  store: {
    totalCustomers: number;
    totalOrders: number;

    ordersPerWeek: {
      orders: number;
      avgSale: number;
    };
  };

  orders: {
    lastOrder: string;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
    ordersPerMonth: {
      year: number;
      month: string;
      totalOrders: number;
      totalRevenue: number;
    }[];
  };
}
