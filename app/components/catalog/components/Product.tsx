/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Pin } from "lucide-react";

import { ProductViewModel } from "@/app/commands/catalog/index.type";
import {
  getCatalogImagePath,
  translateProductType,
} from "@/app/helpers/product.helper";

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

export default function Product(product: ProductViewModel) {
  const pinnedClass = product.isPinned
    ? "border-2 border-dashed border-purple-700 shadow-purple-200"
    : "";

  const badge = PRODUCT_TYPE_BADGE[product.type];

  return (
    <Link
      href={product.id}
      className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-sm transition cursor-pointer group ${pinnedClass}`}
    >
      {product.isPinned && (
        <div className="absolute top-3 left-3 z-20 bg-purple-700/80 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
          <Pin className="w-4 h-4 text-white" />
        </div>
      )}

      {product.type !== "standard" && badge && (
        <div
          className={`absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-xs tracking-wide shadow-md backdrop-blur-sm ${badge} opacity-90`}
        >
          {translateProductType(product.type)}
        </div>
      )}

      <img
        src={getCatalogImagePath(product.merchant.id, product.pic_1)}
        alt={product.name}
        className="w-full h-auto 2xl:h-[450px] xl:h-[350px] md:h-[350px] sm:h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
      />

      <div className="absolute bottom-0 left-0 w-full p-4 bg-linear-to-t from-black/70 via-black/40 to-transparent">
        <div className="relative h-14">
          <h2 className="absolute bottom-0 left-0 right-24 text-white font-semibold text-lg leading-none line-clamp-2 drop-shadow-md">
            {product.name}
          </h2>

          <p className="absolute bottom-0 right-0 inline-flex items-end text-yellow-400 font-bold text-lg leading-none whitespace-nowrap drop-shadow-md tabular-nums">
            {product.price.toLocaleString("es-PE", {
              minimumFractionDigits: 0,
              currency: product.currency,
              style: "currency",
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}
