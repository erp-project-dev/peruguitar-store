"use client";

import { useMemo, useState } from "react";

import {
  CatalogGetCommand,
  CatalogGetCommandProps,
  SortType,
} from "@/features/commands/catalog/index.command";
import { BrandGetCommand } from "@/features/commands/brand/index.command";
import { ProductTypeGetCommand } from "@/features/commands/types/index.command";

import CatalogProduct from "@/features/components/Catalog/components/CatalogProduct";
import CatalogFilters from "@/features/components/Catalog/components/CatalogFilters/CatalogFilters";

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
  const [filters, setFilters] = useState<CatalogGetCommandProps>({
    sort,
    brand: null,
    type: null,
    minPrice: null,
    maxPrice: null,
    notIn,
    limit,
  });

  const catalog = useMemo(() => {
    return CatalogGetCommand.handle(filters);
  }, [filters]);

  const brands = useMemo(
    () => BrandGetCommand.handle({ onlyInCatalog: true }),
    []
  );

  const types = useMemo(
    () => ProductTypeGetCommand.handle({ onlyInCatalog: true }),
    []
  );

  const prices = catalog.items.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return (
    <section className="space-y-6">
      {/* <CatalogFilters
        defaultSort={sort}
        brands={brands.map((b) => ({ label: b.name, value: b.id }))}
        types={types.map((t) => ({ label: t.name, value: t.id }))}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onChange={(next) =>
          setFilters((prev) => ({
            ...prev,
            ...next,
            notIn,
            limit,
          }))
        }
      /> */}

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
