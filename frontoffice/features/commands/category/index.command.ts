import DATA from "@/app/store";

import { Category } from "@/features/types/category.type";

import { CatalogGetCommand } from "../catalog/index.command";

interface CategoryGetCommandProps {
  onlyInCatalog?: boolean;
}

export class CategoryGetCommand {
  static handle(input: CategoryGetCommandProps = {}): Category[] {
    const { Categories } = DATA;

    let result = [...Categories].sort((a, b) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" })
    );

    if (input?.onlyInCatalog) {
      const { items } = CatalogGetCommand.handle();
      const categoryIdSet = new Set(
        items.map((item) => item.category?.id).filter(Boolean)
      );

      result = result.filter((category) => categoryIdSet.has(category.id));
    }

    return result;
  }
}
