import { MongoRepository } from "../repositories/mongo.repository";
import { ApplicationError } from "../shared/error";

import { Review } from "../domain/review.entity";
import { ReviewSchema } from "../schema/review.schema";
import { ObjectId } from "mongodb";

export class ReviewService {
  private repository = new MongoRepository<Review>("reviews", ReviewSchema);

  async findById(id: string): Promise<Review> {
    return this.repository.findById(id);
  }

  async findByProduct(productId: string): Promise<Review | null> {
    const results = await this.repository.findAll({
      product_id: productId,
    });

    return results[0] ?? null;
  }

  async findAll(): Promise<Review[]> {
    return this.repository.findAll();
  }

  async create(entry: Review): Promise<Review> {
    entry._id = new ObjectId().toString();

    await this.validateUniqueReview(
      entry.order_id,
      entry.product_id,
      entry.customer_id
    );

    return this.repository.create(entry);
  }

  async update(id: string, entry: Partial<Review>): Promise<Review> {
    return this.repository.update(id, entry);
  }

  async remove(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  private async validateUniqueReview(
    orderId: string,
    productId: string,
    customerId: string
  ): Promise<void> {
    const isUnique = await this.repository.isUnique({
      order_id: orderId,
      product_id: productId,
      customer_id: customerId,
    });

    if (!isUnique) {
      throw new ApplicationError(
        "conflict",
        "This customer already reviewed this product"
      );
    }
  }
}
