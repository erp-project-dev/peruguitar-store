/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoRepository } from "../repositories/mongo.repository";
import { ApplicationError } from "../shared/error";
import { toSlug } from "../helpers/slug.helper";
import { Product, ProductStatus } from "../domain/product.entity";
import { ProductSchema } from "../schema/product.schema";

type FindAllProps = {
  onlyStoreProducts?: boolean;
  status?: ProductStatus;
};

export class ProductService {
  private merchantsFromStore = ["erpproject", "peruguitar"];

  private repository = new MongoRepository<Product>("catalog", ProductSchema);

  async findById(id: string): Promise<Product> {
    return this.repository.findById(id);
  }

  async findAll(query?: FindAllProps): Promise<Product[]> {
    const filter: any = {};

    if (query?.onlyStoreProducts) {
      filter.merchant_id = { $in: this.merchantsFromStore };
    }

    if (query?.status !== undefined) {
      filter.status = query.status;
    }

    return this.repository.findAll(filter);
  }

  async create(entry: Omit<Product, "_id">): Promise<Product> {
    const id = toSlug(entry.name);

    await this.validateUniqueId(id);

    return this.repository.create({
      ...entry,
      _id: id,
      images: [],
      is_pinned: false,
      publish_date: new Date().toISOString(),
    });
  }

  async update(id: string, entry: Partial<Product>): Promise<Product> {
    return this.repository.update(id, entry);
  }

  private async validateUniqueId(_id: string): Promise<void> {
    const isUnique = await this.repository.isUnique({ _id });

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
