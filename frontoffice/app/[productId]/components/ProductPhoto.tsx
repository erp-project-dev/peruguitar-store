"use client";

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import { getCatalogImagePath } from "@/features/helpers/product.helper";

interface ProductPhotoProps {
  merchantId: string;
  pics: string[];
  productName: string;
  price: number;
}

export default function ProductPhoto({ merchantId, pics }: ProductPhotoProps) {
  const [mainImg, setMainImg] = useState(pics[0]);

  return (
    <section className="flex flex-col items-center gap-4 relative">
      <div className="w-full bg-black/20 rounded-xl flex items-center justify-center relative">
        <img
          src={getCatalogImagePath(merchantId, mainImg)}
          className="max-h-[800px] w-full object-contain rounded-xl"
        />
      </div>

      {pics.length > 1 && (
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-6 gap-3 max-w-fit">
            {pics.map((img) => (
              <button
                key={img}
                onClick={() => setMainImg(img)}
                className={`
                  rounded-lg overflow-hidden aspect-square cursor-pointer
                  border transition-all duration-200
                  ${
                    img === mainImg
                      ? "border-black border-dashed shadow-md"
                      : "border-gray-300 hover:border-black/60 hover:shadow"
                  }
                `}
              >
                <img
                  src={getCatalogImagePath(merchantId, img)}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
