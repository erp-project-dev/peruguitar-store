import { Service } from "./interfaces/service.interface";
import { MongoRepository } from "../repositories/mongo.repository";
import { ApplicationError } from "../shared/error";
import { toSlug } from "../helpers/slug.helper";
import { ProductType } from "../domain/product-type.entity";
import { ProductTypeSchema } from "../schema/product-type.schema";

export class ProductTypeService implements Service {
  private repository = new MongoRepository<ProductType>(
    "types",
    ProductTypeSchema
  );

  async findById(id: string): Promise<ProductType> {
    return this.repository.findById(id);
  }

  async findAll(): Promise<ProductType[]> {
    return this.repository.findAll();
  }

  async create(entry: Omit<ProductType, "_id">): Promise<ProductType> {
    const id = toSlug(entry.name);

    await this.validateUniqueId(id);

    return this.repository.create({
      ...entry,
      _id: id,
    });
  }

  async update(id: string, entry: Partial<ProductType>): Promise<ProductType> {
    return this.repository.update(id, entry);
  }

  async remove(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  private async validateUniqueId(id: string): Promise<void> {
    const isUnique = await this.repository.isUnique("_id", id);

    if (!isUnique) {
      throw new ApplicationError(
        "taken",
        "A Product type with the same name already exists"
      );
    }
  }
}
