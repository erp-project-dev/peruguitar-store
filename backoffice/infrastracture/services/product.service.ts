import { MongoRepository } from "../repositories/mongo.repository";
import { ApplicationError } from "../shared/error";
import { toSlug } from "../helpers/slug.helper";
import { Product } from "../domain/product.entity";
import { ProductSchema } from "../schema/product.schema";

export class ProductService {
  private repository = new MongoRepository<Product>("catalog", ProductSchema);

  async findById(id: string): Promise<Product> {
    return this.repository.findById(id);
  }

  async findAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async create(entry: Omit<Product, "_id">): Promise<Product> {
    const id = toSlug(entry.name);

    await this.validateUniqueId(id);

    return this.repository.create({
      ...entry,
      _id: id,
      images: [],
      is_enabled: false,
      is_pinned: false,
      publish_date: new Date().toISOString(),
    });
  }

  async update(id: string, entry: Partial<Product>): Promise<Product> {
    return this.repository.update(id, entry);
  }

  private async validateUniqueId(id: string): Promise<void> {
    const isUnique = await this.repository.isUnique("_id", id);

    if (!isUnique) {
      throw new ApplicationError(
        "taken",
        "A product with the same name already exists"
      );
    }
  }

  async remove(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
