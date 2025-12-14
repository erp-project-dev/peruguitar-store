import DATA from "@/app/data";
import { ProductType } from "@/app/types/product-type";
import { CatalogGetCommand } from "../catalog/index.command";

interface ProductTypeGetCommandProps {
  onlyInCatalog?: boolean;
}

export class ProductTypeGetCommand {
  static handle(input: ProductTypeGetCommandProps = {}): ProductType[] {
    const { Types } = DATA;

    let result = [...Types].sort((a, b) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" })
    );

    if (input?.onlyInCatalog) {
      const { items } = CatalogGetCommand.handle();
      const typeIdSet = new Set(items.map((item) => item.type.id));

      result = result.filter((type) => typeIdSet.has(type.id));
    }

    return result;
  }
}
