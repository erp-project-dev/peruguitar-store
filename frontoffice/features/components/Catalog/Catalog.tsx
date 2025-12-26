"use client";

import {
  CatalogGetCommand,
  SortType,
} from "@/features/commands/catalog/index.command";

import CatalogProduct from "@/features/components/Catalog/components/CatalogProduct";

type CatalogCols = 2 | 4 | 6;

export interface CatalogProps {
  sort?: SortType;
  notIn?: string[];
  limit?: number;
  parentCategoryId?: string;
  cols?: CatalogCols; // 👈 NUEVO
}

const GRID_BY_COLS: Record<CatalogCols, string> = {
  2: "grid-cols-2 md:grid-cols-2",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
};

export default function Catalog({
  sort = "latest",
  notIn,
  limit,
  parentCategoryId,
  cols = 6,
}: CatalogProps) {
  const catalog = CatalogGetCommand.handle({
    sort,
    notIn,
    limit,
    parentCategoryId,
  });

  return (
    <section className="space-y-6">
      <div className={`grid gap-2 md:gap-8 ${GRID_BY_COLS[cols]}`}>
        {catalog.items.map((product) => (
          <CatalogProduct
            key={product.id}
            product={product}
            ignorePinned={false}
          />
        ))}
      </div>
    </section>
  );
}
