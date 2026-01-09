import { Db } from "mongodb";

import { getDbInstance } from "../repositories/database";
import { StoreMetrics } from "../domain/store-metrics.entity";

import { Product } from "../domain/product.entity";
import { Category } from "../domain/category.entity";
import { Merchant } from "../domain/merchant.entity";
import { Customer } from "../domain/customer.entity";
import { Order } from "../domain/order.entity";

export class StoreMetricsService {
  private async getCollections(db: Db) {
    const [catalog, categories, merchants, customers, orders] =
      await Promise.all([
        db.collection<Product>("catalog").find().toArray(),
        db.collection<Category>("categories").find().toArray(),
        db.collection<Merchant>("merchants").find().toArray(),
        db.collection<Customer>("customers").find().toArray(),
        db.collection<Order>("orders").find().toArray(),
      ]);

    return { catalog, categories, merchants, customers, orders };
  }

  async find(): Promise<StoreMetrics> {
    const db = await getDbInstance();
    const data = await this.getCollections(db);

    return {
      products: this.buildProductsMetrics(data.catalog, data.categories),
      categories: this.buildCategoriesMetrics(data.catalog, data.categories),
      merchants: this.buildMerchantsMetrics(data.catalog, data.merchants),
      store: this.buildStoreMetrics(data.orders, data.customers),
      orders: this.buildOrderMetrics(data.orders),
    };
  }

  private buildProductsMetrics(
    catalog: Product[],
    categories: Category[]
  ): StoreMetrics["products"] {
    const total = catalog.length;
    const active = catalog.filter((p) => p.status === "available").length;
    const disabled = catalog.filter((p) => p.status === "disabled").length;

    const storeCategoryTotal = this.countProductsUnderStoreCategory(
      catalog,
      categories
    );

    return {
      total,
      active,
      disabled,
      storeCategoryTotal,
    };
  }

  private buildCategoriesMetrics(
    catalog: Product[],
    categories: Category[]
  ): StoreMetrics["categories"] {
    const parentCategories = categories
      .filter((c) => c.parent_id === null)
      .sort((a, b) => a.order - b.order);

    const childCategories = categories.filter((c) => c.parent_id !== null);

    const productsByCategory = catalog.reduce<Record<string, number>>(
      (acc, product) => {
        if (!product.category_id) return acc;
        acc[product.category_id] = (acc[product.category_id] || 0) + 1;
        return acc;
      },
      {}
    );

    return parentCategories.map((parent) => {
      const childIds = childCategories
        .filter((c) => c.parent_id === parent._id)
        .map((c) => c._id);

      const products = childIds.reduce(
        (sum, id) => sum + (productsByCategory[id] || 0),
        0
      );

      return {
        id: parent._id,
        name: parent.name,
        products,
      };
    });
  }

  private buildMerchantsMetrics(
    catalog: Product[],
    merchants: Merchant[]
  ): StoreMetrics["merchants"] {
    const total = merchants.length;
    const active = new Set(catalog.map((p) => p.merchant_id)).size;

    return { total, active };
  }

  private buildStoreMetrics(
    orders: Order[],
    customers: Customer[]
  ): StoreMetrics["store"] {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const ordersLastWeek = orders.filter(
      (o) => new Date(o.created_at) >= oneWeekAgo
    );

    const totalOrders = orders.length;

    const weeklyRevenue = ordersLastWeek.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );

    return {
      totalCustomers: customers.length,
      totalOrders,

      ordersPerWeek: {
        orders: ordersLastWeek.length,
        avgSale:
          ordersLastWeek.length === 0
            ? 0
            : Number((weeklyRevenue / ordersLastWeek.length).toFixed(2)),
      },
    };
  }

  private buildOrderMetrics(orders: Order[]): StoreMetrics["orders"] {
    const emptyResult: StoreMetrics["orders"] = {
      lastOrder: "",
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      refundedOrders: 0,
      ordersPerMonth: [],
    };

    if (orders.length === 0) {
      return emptyResult;
    }

    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const completedOrders = orders.filter(
      (o) => o.status === "completed"
    ).length;
    const cancelledOrders = orders.filter(
      (o) => o.status === "cancelled"
    ).length;
    const refundedOrders = orders.filter((o) => o.status === "refunded").length;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const lastOrder = orders.sort((a, b) => (a._id < b._id ? 1 : -1))[0];
    const year = new Date(lastOrder.created_at).getFullYear();

    const ordersPerMonthMap = orders.reduce<
      Record<
        string,
        {
          year: number;
          month: string;
          totalOrders: number;
          totalRevenue: number;
        }
      >
    >((acc, order) => {
      const date = new Date(order.created_at);
      const y = date.getFullYear();
      const m = date.toLocaleString("en-US", { month: "short" });

      if (y !== year) return acc;

      if (!acc[m]) {
        acc[m] = {
          year,
          month: m,
          totalOrders: 0,
          totalRevenue: 0,
        };
      }

      acc[m].totalOrders += 1;
      acc[m].totalRevenue += order.total || 0;

      return acc;
    }, {});

    const ordersPerMonth = months.map((month) => ({
      year,
      month,
      totalOrders: ordersPerMonthMap[month]?.totalOrders ?? 0,
      totalRevenue: ordersPerMonthMap[month]?.totalRevenue ?? 0,
    }));

    return {
      lastOrder: lastOrder._id,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      refundedOrders,
      ordersPerMonth,
    };
  }

  private countProductsUnderStoreCategory(
    catalog: Product[],
    categories: Category[]
  ): number {
    const childCategoryIds = categories
      .filter((c) => c.parent_id === "store")
      .map((c) => c._id);

    if (!childCategoryIds) return 0;

    return catalog.filter((p) => childCategoryIds.includes(p.category_id))
      .length;
  }
}
