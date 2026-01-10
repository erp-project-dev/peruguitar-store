import { ProductOrderItem } from "../domain/order.entity";
import { Product } from "../domain/product.entity";
import { MongoRepository } from "../repositories/mongo.repository";

import { ProductSchema } from "../schema/product.schema";

export class ProductOrderItemService {
  private readonly merchantsFromStore = ["erpproject", "peruguitar"];
  private readonly defaultListingPrice = 50;

  private productRepository = new MongoRepository<Product>(
    "catalog",
    ProductSchema
  );

  async findAll(): Promise<ProductOrderItem[]> {
    const storeItems = await this.findStoreItems();
    const listingItems = await this.findListingItems();

    return [...storeItems, ...listingItems];
  }

  private async findStoreItems(): Promise<ProductOrderItem[]> {
    const result = await this.productRepository.findAll({
      merchant_id: { $in: this.merchantsFromStore },
    });

    return result.map((product) => ({
      type: "store",
      product_id: product._id,
      name: product.name,
      price: product.price!,
      currency: product.currency!,
    }));
  }

  private async findListingItems(): Promise<ProductOrderItem[]> {
    return this.productRepository.aggregate<ProductOrderItem>([
      {
        $match: {
          merchant_id: { $nin: this.merchantsFromStore },
        },
      },

      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "items.product_id",
          as: "orders",
        },
      },

      {
        $match: {
          orders: { $eq: [] },
        },
      },

      {
        $project: {
          _id: 0,
          type: { $literal: "listing" },
          product_id: "$_id",
          name: "$name",
          price: { $literal: this.defaultListingPrice },
          currency: "$currency",
        },
      },
    ]);
  }
}
