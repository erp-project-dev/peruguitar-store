/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Pin } from "lucide-react";

import { ProductViewModel } from "@/app/handlers/catalog/index.type";

import {
  getCatalogImagePath,
  translateProductStatus,
} from "@/app/helpers/product.helper";

export default function Product(product: ProductViewModel) {
  const pinnedClass = product.isPinned
    ? "border-2 border-dashed border-purple-700 shadow-purple-200"
    : "";

  return (
    <Link
      href={product.id}
      className={`relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer group ${pinnedClass}`}
    >
      {/* Badge Lucide cuando está pineado */}
      {product.isPinned && (
        <div className="absolute top-3 left-3 z-20 bg-purple-700/80 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
          <Pin className="w-4 h-4 text-white" />
        </div>
      )}

      <img
        src={getCatalogImagePath(product.merchant.id, product.pic_1)}
        alt={product.name}
        className="w-full h-auto 2xl:h-[450px] xl:h-[350px] md:h-[350px] sm:h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
      />

      <div className="absolute bottom-0 left-0 w-full p-4 bg-linear-to-t from-black/70 via-black/40 to-transparent">
        <h2 className="text-white font-semibold text-lg mb-1 drop-shadow-md">
          {product.name}
        </h2>

        <div className="flex items-center gap-3 drop-shadow-md">
          <p className="text-yellow-400 font-bold text-xl whitespace-nowrap">
            {product.price.toLocaleString("es-PE", {
              minimumFractionDigits: 0,
              currency: "PEN",
              style: "currency",
            })}
          </p>

          <span className="text-gray-300">-</span>

          <span className="text-green-300 text-sm font-medium whitespace-nowrap">
            {translateProductStatus(product.status)}
          </span>
        </div>
      </div>
    </Link>
  );
}
