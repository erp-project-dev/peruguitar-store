import { MongoRepository } from "../repositories/mongo.repository";

import { Order } from "../domain/order.entity";
import { OrderSchema } from "../schema/order.schema";
import { ProductReview } from "../domain/review.entity";

export class ProductReviewService {
  private orderRepository = new MongoRepository<Order>("orders", OrderSchema);

  async findProductsWithoutReview(): Promise<ProductReview[]> {
    return this.orderRepository.aggregate<ProductReview>([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "reviews",
          localField: "items.product_id",
          foreignField: "product_id",
          as: "review",
          pipeline: [{ $limit: 1 }],
        },
      },
      {
        $match: {
          review: { $eq: [] },
        },
      },
      {
        $project: {
          _id: 0,
          order_id: "$_id",

          product_id: "$items.product_id",
          product_name: "$items.name",

          customer_id: "$customer_id",
          customer_name: "$customer_name",
        },
      },
      {
        $sort: {
          order_id: -1,
        },
      },
      {
        $limit: 50,
      },
    ]);
  }
}
