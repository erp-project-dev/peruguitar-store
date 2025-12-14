"use client";

import { useMemo, useState } from "react";

import {
  CatalogGetCommand,
  CatalogGetCommandProps,
} from "@/app/commands/catalog/index.command";
import { BrandGetCommand } from "@/app/commands/brand/index.command";
import { ProductTypeGetCommand } from "@/app/commands/types/index.command";

import CatalogProduct from "./components/CatalogProduct";
import CatalogFilters from "./components/CatalogFilters/CatalogFilters";

export default function Catalog() {
  const [filters, setFilters] = useState<CatalogGetCommandProps>({
    sort: "latest",
    brand: null,
    type: null,
    minPrice: null,
    maxPrice: null,
  });

  const baseCatalog = useMemo(() => {
    return CatalogGetCommand.handle({
      sort: "latest",
      brand: null,
      type: null,
      minPrice: null,
      maxPrice: null,
    });
  }, []);

  const filteredCatalog = useMemo(() => {
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

  const prices = baseCatalog.items.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return (
    <section className="space-y-6">
      <CatalogFilters
        brands={brands.map((b) => ({ label: b.name, value: b.id }))}
        types={types.map((t) => ({ label: t.name, value: t.id }))}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onChange={setFilters}
      />

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
        "
      >
        {filteredCatalog.items.map((product) => (
          <CatalogProduct key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
