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
    const categories = await this.repository.findAll();

    const parents = categories.filter((c) => c.parent_id === null);
    const children = categories.filter((c) => c.parent_id !== null);

    const result: Category[] = [];

    const sortByOrder = (a: Category, b: Category) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;

      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
    };

    parents.sort(sortByOrder).forEach((parent) => {
      result.push(parent);

      children
        .filter((child) => child.parent_id === parent._id)
        .sort(sortByOrder)
        .forEach((child) => result.push(child));
    });

    return result;
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

  private async validateUniqueId(_id: CategoryId): Promise<void> {
    const isUnique = await this.repository.isUnique({ _id });

    if (!isUnique) {
      throw new ApplicationError(
        "taken",
        "A category with the same id already exists"
      );
    }
  }
}
