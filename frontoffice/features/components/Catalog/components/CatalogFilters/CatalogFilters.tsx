"use client";

import { useState } from "react";

import {
  CatalogGetCommandProps,
  SortType,
} from "@/features//commands/catalog/index.command";

import CatalogFilterSelect from "./components/CatalogFilterSelect";
import CatalogFilterItem from "./components/CatalogFilterItem";

interface CatalogFilterOptions {
  label: string;
  value: string;
}

interface CatalogFiltersProps {
  defaultSort?: SortType;
  brands: CatalogFilterOptions[];
  types: CatalogFilterOptions[];
  minPrice: number;
  maxPrice: number;
  onChange: (filters: CatalogGetCommandProps) => void;
}

export function generatePriceRange(
  minPrice: number,
  maxPrice: number
): CatalogFilterOptions[] {
  if (minPrice >= maxPrice) return [];

  const STEPS = 4;
  const options: CatalogFilterOptions[] = [];

  const roundDown = (v: number) => Math.floor(v / 1000) * 1000;
  const roundUp = (v: number) => Math.ceil(v / 1000) * 1000;

  const formatPrice = (v: number) =>
    v.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const start = roundDown(minPrice);
  const end = roundUp(maxPrice);

  const totalRange = end - start;
  const stepSize = Math.ceil(totalRange / STEPS / 1000) * 1000;

  let currentMin = start;

  for (let i = 0; i < STEPS; i++) {
    const isLast = i === STEPS - 1;
    let currentMax = isLast ? end : currentMin + stepSize - 1;

    currentMax = roundUp(currentMax);

    if (currentMin > end) break;
    if (currentMax > end) currentMax = end;

    options.push({
      label: `Entre ${formatPrice(currentMin)} y ${formatPrice(currentMax)}`,
      value: `${currentMin}:${currentMax}`,
    });

    currentMin = currentMax + 1;
  }

  return options;
}

export default function CatalogFilters({
  defaultSort = "latest",
  brands,
  types,
  onChange,
  minPrice,
  maxPrice,
}: CatalogFiltersProps) {
  const [sort, setSort] = useState<SortType>(defaultSort);
  const [brand, setBrand] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [rangePrice, setRangePrice] = useState<string | null>(null);

  const hasActiveFilters =
    sort !== "latest" || brand !== null || type !== null || rangePrice !== null;

  const notifyChange = (next: Partial<CatalogGetCommandProps>) => {
    onChange({
      sort,
      brand,
      type,
      minPrice,
      maxPrice,
      ...next,
    });
  };

  const resetFilters = () => {
    const defaults = {
      sort: "latest" as SortType,
      brand: null,
      type: null,
      rangePrice: null,
    };

    setSort(defaults.sort);
    setBrand(null);
    setType(null);
    setRangePrice(null);

    onChange(defaults);
  };

  return (
    <div className="hidden md:flex flex-wrap justify-center items-center gap-3 focus:outline-none focus:ring-1 focus:ring-gray-600">
      <CatalogFilterItem label="Ordenar por">
        <CatalogFilterSelect
          options={[
            { label: "Más recientes", value: "latest" },
            { label: "Más antiguos", value: "oldest" },
            { label: "Mayor precio", value: "price_desc" },
            { label: "Menor precio", value: "price_asc" },
          ]}
          value={sort}
          onChange={(value) => {
            const sortValue = value as SortType;
            setSort(sortValue);
            notifyChange({ sort: sortValue });
          }}
          width={120}
          mobileTitle="Ordenamiento"
        />
      </CatalogFilterItem>

      <CatalogFilterItem label="Marcas">
        <CatalogFilterSelect
          options={brands}
          value={brand}
          onChange={(value) => {
            const v = value || null;
            setBrand(v);
            notifyChange({ brand: v });
          }}
          placeholder="Cualquiera"
          width={120}
          mobileTitle="Marcas"
        />
      </CatalogFilterItem>

      <CatalogFilterItem label="Cualidad">
        <CatalogFilterSelect
          options={types}
          value={type}
          onChange={(value) => {
            const v = value || null;
            setType(v);
            notifyChange({ type: v });
          }}
          placeholder="Cualquiera"
          width={140}
          mobileTitle="Cualidad"
        />
      </CatalogFilterItem>

      <CatalogFilterItem label="Rango en (S/)">
        <CatalogFilterSelect
          options={generatePriceRange(minPrice, maxPrice)}
          value={rangePrice}
          onChange={(value) => {
            const v = value || null;

            let min = null;
            let max = null;

            setRangePrice(v);

            if (v) {
              [min, max] = v.split(":").map(Number);
            }

            notifyChange({
              minPrice: min,
              maxPrice: max,
            });
          }}
          placeholder="Cualquiera"
          width={200}
          mobileTitle="Rango de precio"
        />
      </CatalogFilterItem>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="text-sm text-gray-600 underline hover:text-gray-700 cursor-pointer"
        >
          Borrar filtros
        </button>
      )}
    </div>
  );
}
