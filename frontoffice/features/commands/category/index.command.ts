import DATA from "@/app/store";
import { Category } from "@/features/types/category.type";
import { CatalogGetCommand } from "../catalog/index.command";

interface CategoryGetCommandProps {
  onlyInCatalog?: boolean;
  onlyParents?: boolean;
}

export class CategoryGetCommand {
  static handle(input: CategoryGetCommandProps = {}): Category[] {
    const { Categories } = DATA;

    const sorted = [...Categories].sort((a, b) => a.order - b.order);

    return this.applyFilters(sorted, input);
  }

  private static applyFilters(
    categories: Category[],
    input: CategoryGetCommandProps
  ): Category[] {
    let result = categories;

    if (input.onlyInCatalog) {
      const { items } = CatalogGetCommand.handle();

      const categoryIdSet = new Set(
        items
          .map((item) =>
            input.onlyParents ? item.category?.parent_id : item.category?.id
          )
          .filter(Boolean)
      );

      result = result.filter((category) => categoryIdSet.has(category.id));
    }

    if (input.onlyParents) {
      result = result.filter((category) => category.parent_id === null);
    }

    return result;
  }
}
