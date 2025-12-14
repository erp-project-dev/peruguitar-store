"use client";

import { useState } from "react";

import {
  CatalogGetCommandProps,
  SortType,
} from "@/app/commands/catalog/index.command";

import CatalogFilterItem from "./components/CatalogFilterItem";

interface CatalogFilterOptions {
  label: string;
  value: string;
}

interface CatalogFiltersProps {
  brands: CatalogFilterOptions[];
  types: CatalogFilterOptions[];
  minPrice: number;
  maxPrice: number;
  onChange: (filters: CatalogGetCommandProps) => void;
}

const DEFAULT_FILTER_OPTIONS: CatalogFilterOptions = {
  label: "Cualquiera",
  value: "",
};

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
  brands,
  types,
  onChange,
  minPrice,
  maxPrice,
}: CatalogFiltersProps) {
  const [sort, setSort] = useState<SortType>("latest");
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
    <div className="flex flex-wrap items-center gap-3 focus:outline-none focus:ring-1 focus:ring-gray-600">
      <CatalogFilterItem label="Ordenar por">
        <select
          value={sort}
          onChange={(e) => {
            const value = e.target.value as SortType;
            setSort(value);
            notifyChange({ sort: value });
          }}
          className="bg-transparent outline-none"
        >
          <option value="latest">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="price_desc">Mayor precio</option>
          <option value="price_asc">Menor precio</option>
        </select>
      </CatalogFilterItem>

      <CatalogFilterItem label="Marcas">
        <select
          value={brand ?? ""}
          onChange={(e) => {
            const value = e.target.value || null;
            setBrand(value);
            notifyChange({ brand: value });
          }}
          className="bg-transparent outline-none"
        >
          {[DEFAULT_FILTER_OPTIONS, ...brands].map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </CatalogFilterItem>

      <CatalogFilterItem label="Cualidad">
        <select
          value={type ?? ""}
          onChange={(e) => {
            const value = e.target.value || null;
            setType(value);
            notifyChange({ type: value });
          }}
          className="bg-transparent outline-none"
        >
          {[DEFAULT_FILTER_OPTIONS, ...types].map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </CatalogFilterItem>

      <CatalogFilterItem label="Rango de precio (S/)">
        <select
          value={rangePrice ?? ""}
          onChange={(e) => {
            const value = e.target.value || null;

            let minPrice = null;
            let maxPrice = null;

            setRangePrice(value);

            if (value) {
              [minPrice, maxPrice] = value.split(":").map(Number);
            }

            notifyChange({
              minPrice,
              maxPrice,
            });
          }}
          className="bg-transparent outline-none"
        >
          {[
            DEFAULT_FILTER_OPTIONS,
            ...generatePriceRange(minPrice, maxPrice),
          ].map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
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
