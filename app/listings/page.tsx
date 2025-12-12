"use client";

import { useState } from "react";
import Image from "next/image";

import { CatalogGetCommand } from "../commands/catalog/index.command";
import ProductDetails from "./components/ProductDetails";
import { ProductHeader } from "./components/ProductHeader";
import {
  getCatalogImagePath,
  translateProductStatus,
} from "../helpers/product.helper";
import { Eye } from "lucide-react";

export default function Listings() {
  const catalog = CatalogGetCommand.handle({ sort: "latest" });
  const [openId, setOpenId] = useState<string | null>(null);

  const total = catalog.items.length;
  const pinned = catalog.items.filter((p) => p.isPinned).length;
  const inactive = catalog.items.filter((p) => !p.isEnabled).length;

  return (
    <section className="mx-auto w-7xl space-y-6 px-4 py-12">
      <ProductHeader total={total} pinned={pinned} inactive={inactive} />

      <div className="space-y-2">
        {catalog.items.map((product) => {
          const isOpen = openId === product.id;

          return (
            <div
              key={product.id}
              className="bg-gray-900 transition hover:bg-slate-800"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : product.id)}
                className="grid w-full cursor-pointer grid-cols-[64px_1.5fr_120px_120px_120px_120px_56px] items-center gap-4 px-4 py-3 text-left"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-md bg-slate-700">
                  <Image
                    src={getCatalogImagePath(
                      product.merchant.id,
                      product.pic_1
                    )}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="font-medium text-slate-100">
                    {product.name}
                  </div>

                  <div className="text-sm text-slate-300">
                    {product.brand.toUpperCase()} ·{" "}
                    {product.model.toUpperCase()}
                  </div>

                  <div className="text-sm text-slate-400">
                    {product.merchant.fullName}
                  </div>
                </div>

                <div className="flex flex-col items-center leading-tight">
                  <span className="text-sm uppercase tracking-wide text-slate-400">
                    Fotos
                  </span>
                  <span className="text-lg font-semibold text-slate-100">
                    {
                      [
                        product.pic_1,
                        product.pic_2,
                        product.pic_3,
                        product.pic_4,
                        product.pic_6,
                      ].filter(Boolean).length
                    }
                  </span>
                </div>

                <div className="flex flex-col items-center leading-tight">
                  <span className="text-sm uppercase tracking-wide text-slate-400">
                    Card
                  </span>
                  <span
                    className={`text-lg font-semibold ${
                      product.card_pic ? "text-emerald-400" : "text-slate-500"
                    }`}
                  >
                    {product.card_pic ? "Sí" : "No"}
                  </span>
                </div>

                <div className="flex flex-col items-center leading-tight">
                  <span className="text-sm uppercase tracking-wide text-slate-400">
                    Calificación
                  </span>
                  <span className="text-lg font-semibold text-white">
                    {product.statusScore}/5
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="font-medium text-slate-100">
                    {product.currency} {product.price}
                  </div>

                  <div className="text-sm text-slate-400">
                    {translateProductStatus(product.status)}
                  </div>
                </div>

                <div className="flex justify-center">
                  <a
                    href={`/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-md p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
                  >
                    <Eye size={18} />
                  </a>
                </div>
              </button>

              {isOpen && <ProductDetails product={product} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
