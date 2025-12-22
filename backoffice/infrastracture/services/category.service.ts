import { MongoRepository } from "../repositories/mongo.repository";
import { ApplicationError } from "../shared/error";
import { CategorySchema } from "../schema/category.schema";
import { Category, CategoryId } from "../domain/category.entity";
import { Product } from "../domain/product.entity";
import { ProductType } from "../domain/product-type.entity";
import { Brand } from "../domain/brand.entity";

export class CategoryService {
  private repository = new MongoRepository<Category>(
    "categories",
    CategorySchema
  );

  async findById(id: CategoryId): Promise<Category> {
    return this.repository.findById(id);
  }

  async findAll(): Promise<Category[]> {
    return this.repository.findAll();
  }

  async create(entry: Category): Promise<Category> {
    await this.validateUniqueId(entry._id);

    return this.repository.create(entry);
  }

  async update(id: CategoryId, entry: Partial<Category>): Promise<Category> {
    return this.repository.update(id, entry);
  }

  async remove(id: CategoryId): Promise<void> {
    const referencedInCatalog = await this.repository.isReferencedById<Product>(
      "catalog",
      "category_id",
      id
    );

    const referencedInTypes =
      await this.repository.isReferencedById<ProductType>(
        "types",
        "category_id",
        id
      );

    const referencedInBrands = await this.repository.isReferencedInArray<Brand>(
      "brands",
      "categories",
      id
    );

    if (referencedInCatalog || referencedInTypes || referencedInBrands) {
      throw new ApplicationError(
        "in-use",
        "Category could not be removed, is referenced by another entity"
      );
    }

    return this.repository.delete(id);
  }

  private async validateUniqueId(id: CategoryId): Promise<void> {
    const isUnique = await this.repository.isUnique("_id", id);

    if (!isUnique) {
      throw new ApplicationError(
        "taken",
        "A category with the same id already exists"
      );
    }
  }
}
