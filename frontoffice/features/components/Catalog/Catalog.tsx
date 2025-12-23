"use client";

import {
  CatalogGetCommand,
  SortType,
} from "@/features/commands/catalog/index.command";

import CatalogProduct from "@/features/components/Catalog/components/CatalogProduct";

export interface CatalogProps {
  sort?: SortType;
  notIn?: string[];
  limit?: number;
}

export default function Catalog({
  sort = "latest",
  notIn,
  limit,
}: CatalogProps) {
  const catalog = CatalogGetCommand.handle({ sort, notIn, limit });

  return (
    <section className="space-y-6">
      <div className="grid gap-2 md:gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {catalog.items.map((product) => (
          <CatalogProduct
            product={product}
            ignorePinned={false}
            key={product.id}
          />
        ))}
      </div>
    </section>
  );
}
