import { MongoRepository } from "../repositories/mongo.repository";
import { ApplicationError } from "../shared/error";
import { toSlug } from "../helpers/slug.helper";
import { Brand } from "../domain/brand.entity";
import { BrandSchema } from "../schema/brand.schema";
import { CategoryId } from "../domain/category.entity";

export class BrandService {
  private repository = new MongoRepository<Brand>("brands", BrandSchema);

  async findById(id: string): Promise<Brand> {
    return this.repository.findById(id);
  }

  async findAll(categoryId?: CategoryId): Promise<Brand[]> {
    const filter = categoryId
      ? {
          categories: {
            $in: [categoryId],
          },
        }
      : {};

    return this.repository.findAll(filter);
  }

  async create(entry: Omit<Brand, "_id">): Promise<Brand> {
    const id = toSlug(entry.name);

    await this.validateUniqueId(id);

    return this.repository.create({
      ...entry,
      _id: id,
    });
  }

  async update(id: string, entry: Partial<Brand>): Promise<Brand> {
    return this.repository.update(id, entry);
  }

  async remove(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  private async validateUniqueId(_id: string): Promise<void> {
    const isUnique = await this.repository.isUnique({ _id });

    if (!isUnique) {
      throw new ApplicationError(
        "taken",
        "A brand with the same name already exists"
      );
    }
  }
}
