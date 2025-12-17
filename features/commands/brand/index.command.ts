import DATA from "@/app/data";

import { Brand } from "@/features/types/brand.type";

import { CatalogGetCommand } from "../catalog/index.command";

interface BrandGetCommandProps {
  onlyInCatalog?: boolean;
}

export class BrandGetCommand {
  static handle(input: BrandGetCommandProps = {}): Brand[] {
    const { Brands } = DATA;

    let result = [...Brands].sort((a, b) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" })
    );

    if (input?.onlyInCatalog) {
      const { items } = CatalogGetCommand.handle();
      const brandIdSet = new Set(items.map((item) => item.brand.id));

      result = result.filter((brand) => brandIdSet.has(brand.id));
    }

    return result;
  }
}
