/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Pin } from "lucide-react";

import { ProductViewModel } from "@/features/commands/catalog/index.type";
import { getCatalogImagePath } from "@/features/helpers/product.helper";

interface CatalogProductProps {
  product: ProductViewModel;
  ignorePinned: boolean;
}

const PRODUCT_TYPE_BADGE = {
  standard: "bg-slate-600 text-white",
  high_end: "bg-amber-600 text-white",
  signature: "bg-indigo-600 text-white",
  rare: "bg-rose-600 text-white",
  discontinued: "bg-gray-800 text-white",
  limited: "bg-emerald-600 text-white",
  vintage: "bg-orange-700 text-white",
  handcrafted: "bg-teal-700 text-white",
  boutique: "bg-purple-700 text-white",
};

export default function CatalogProduct({
  product,
  ignorePinned,
}: CatalogProductProps) {
  const showPinned = product.is_pinned && !ignorePinned;
  const isSold = product.status === "sold";

  const badgeClass = product.type ? PRODUCT_TYPE_BADGE[product.type.id] : "";

  return (
    <Link
      href={`/${product.id}`}
      className={`
        p-2 md:p-4 block rounded-2xl
        bg-white/35 transition-shadow duration-300 cursor-pointer
         ${
           showPinned
             ? "md:outline-2 md:outline-neutral-400 md:outline-dashed"
             : ""
         }
        ${isSold ? "grayscale cursor-defaul opacity-70" : ""}
      `}
    >
      <div className="relative overflow-hidden rounded-xl">
        {showPinned && (
          <div className="absolute top-2 left-2 z-10 bg-purple-600 p-1.5 rounded-full">
            <Pin className="w-4 h-4 text-white" />
          </div>
        )}

        <img
          src={getCatalogImagePath(product.images[0])}
          alt={product.name}
          className={`
            w-full aspect-7/6 object-cover transition-transform duration-300
            ${!isSold ? "group-hover:scale-[1.1]" : ""}
          `}
        />
      </div>

      <div className="space-y-1 py-4">
        <div className="text-[11px] md:text-xs uppercase tracking-wide text-neutral-500">
          {product.category.name}
        </div>

        <h2 className="text-base md:text-lg font-semibold leading-snug line-clamp-2 text-neutral-900">
          {product.name}
        </h2>

        {product.type && (
          <div
            className={`inline-block text-[11px] md:text-xs px-2 py-1 rounded-md font-medium ${badgeClass}`}
          >
            {product.type.name}
          </div>
        )}

        {product.price && (
          <div className="pt-1 md:pt-2 text-xl md:text-2xl font-bold text-neutral-900 tabular-nums">
            {product.price.toLocaleString("es-PE", {
              minimumFractionDigits: 0,
              currency: product.currency,
              style: "currency",
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
