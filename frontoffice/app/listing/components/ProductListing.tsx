/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { Eye, ArrowUpDown, Pin } from "lucide-react";

import {
  getCatalogImagePath,
  translateProductCondition,
} from "@/features/helpers/product.helper";
import { ProductViewModel } from "@/features/commands/catalog/index.type";

import ProductDetails from "./ProductDetails";

type SortKey =
  | "name"
  | "type"
  | "price"
  | "statusScore"
  | "publishDate"
  | "isPinned";
type SortDir = "asc" | "desc";

export default function ProductListing({
  items,
}: {
  items: ProductViewModel[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("publishDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    setSortDir((prev) =>
      key === sortKey ? (prev === "asc" ? "desc" : "asc") : "asc"
    );
    setSortKey(key);
  }

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let aVal: any = a[sortKey as keyof ProductViewModel];
      let bVal: any = b[sortKey as keyof ProductViewModel];

      if (sortKey === "publishDate") {
        aVal = new Date(a.publishDate).getTime();
        bVal = new Date(b.publishDate).getTime();
      }

      if (typeof aVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [items, sortKey, sortDir]);

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {/* COLUMN WIDTHS */}
        <colgroup>
          <col style={{ width: 64 }} />
          <col />
          <col style={{ width: 120 }} />
          <col style={{ width: 80 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 160 }} />
          <col style={{ width: 120 }} />
          <col style={{ width: 56 }} />
        </colgroup>

        {/* HEADER */}
        <thead className="text-md sticky top-0 z-10 bg-black text-white">
          <tr>
            <th />

            <th className="px-4 py-4 text-left">
              <button
                onClick={() => toggleSort("name")}
                className="flex w-full items-center gap-1 cursor-pointer"
              >
                Nombre <ArrowUpDown size={14} />
              </button>
            </th>

            <th>
              <button
                onClick={() => toggleSort("type")}
                className="flex w-full items-center gap-1 cursor-pointer"
              >
                Cualidad <ArrowUpDown size={14} />
              </button>
            </th>

            <th className="text-center">Fotos</th>

            <th className="text-center">
              <button
                onClick={() => toggleSort("statusScore")}
                className="flex w-full items-center justify-center gap-1 cursor-pointer"
              >
                Score <ArrowUpDown size={14} />
              </button>
            </th>

            <th className="text-left">
              <button
                onClick={() => toggleSort("publishDate")}
                className="flex w-full items-center gap-1 cursor-pointer"
              >
                Publicado <ArrowUpDown size={14} />
              </button>
            </th>

            <th className="text-right">
              <button
                onClick={() => toggleSort("price")}
                className="flex w-full items-center justify-end gap-1 cursor-pointer"
              >
                Precio <ArrowUpDown size={14} />
              </button>
            </th>

            <th />
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {sortedItems.map((product) => {
            const isOpen = openId === product.id;

            return (
              <>
                <tr
                  key={product.id}
                  onClick={() => setOpenId(isOpen ? null : product.id)}
                  className="cursor-pointer border-b border-slate-800 bg-gray-900 hover:bg-slate-800"
                >
                  <td className="px-2">
                    <a
                      href={getCatalogImagePath(product.card_pic)}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="relative inline-block h-12 w-12 overflow-hidden rounded bg-slate-700"
                      title="Descargar card"
                    >
                      <Image
                        src={getCatalogImagePath(product.images[0])}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </a>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-100 text-lg">
                      {product.name}
                      {product.isPinned && (
                        <Pin size={16} className="text-purple-500" />
                      )}
                    </div>

                    <div className="text-xs uppercase text-slate-400">
                      {product.brand.name} / {product.model}
                      <span className="mx-1 opacity-40">—</span>
                      <span className="text-slate-500">
                        {product.merchant.fullName}
                      </span>
                    </div>
                  </td>

                  <td className="text-slate-100">{product.type.name}</td>

                  <td className="text-center text-slate-100">
                    {product.images.length}
                  </td>

                  <td className="text-center text-white">
                    {product.conditionScore}/5
                  </td>

                  <td className="text-slate-300">
                    {new Date(product.publishDate).toLocaleString()}
                  </td>

                  <td className="text-right">
                    <div className="font-medium text-slate-100">
                      {product.price.toLocaleString("es-PE", {
                        currency: product.currency,
                        style: "currency",
                      })}
                    </div>
                    <div className="text-slate-500">
                      {translateProductCondition(product.condition)}
                    </div>
                  </td>

                  <td className="text-center">
                    <a
                      href={`/${product.id}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex rounded p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                    >
                      <Eye size={18} />
                    </a>
                  </td>
                </tr>

                {isOpen && (
                  <tr>
                    <td colSpan={8}>
                      <ProductDetails key={product.id} product={product} />
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
