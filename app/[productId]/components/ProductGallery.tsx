"use client";

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Download, X } from "lucide-react";
import { useState } from "react";

import { getCatalogImagePath } from "@/app/helpers/product.helper";
import ProductStoryCardPreview from "./ProductStoryCardPreview";

interface ProductGalleryProps {
  merchantId: string;
  pics: string[];
  productName: string;
  price: number;
}

export default function ProductGallery({
  merchantId,
  pics,
  productName,
  price,
}: ProductGalleryProps) {
  const [mainImg, setMainImg] = useState(pics[0]);
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="flex flex-col items-center gap-6 relative">
      <div className="w-full bg-black/20 rounded-xl flex items-center justify-center relative">
        <img
          src={getCatalogImagePath(merchantId, mainImg)}
          className="max-h-[600px] w-full object-contain rounded-xl"
        />

        <button
          onClick={() => setShowModal(true)}
          className="
            absolute bottom-4 right-4
            p-3 rounded-full
            bg-black/40 backdrop-blur-md
            hover:bg-black/60
            text-white
            shadow-lg
            transition-all
            flex items-center justify-center
            cursor-pointer
          "
          title="Generar imagen para Stories"
        >
          <Download className="w-6 h-6" />
        </button>
      </div>

      {pics.length > 1 && (
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-fit">
            {pics.map((img) => (
              <button
                key={img}
                onClick={() => setMainImg(img)}
                className={`
                  rounded-lg overflow-hidden aspect-square cursor-pointer
                  border transition-all duration-200
                  ${
                    img === mainImg
                      ? "border-black shadow-md"
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

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(false);
            }}
            className="
              absolute top-6 right-6
              p-3 rounded-full
              bg-white/10 hover:bg-white/20
              text-white backdrop-blur-md
              transition
            "
          >
            <X className="w-7 h-7" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full flex justify-center"
          >
            <ProductStoryCardPreview
              imagePath={getCatalogImagePath(merchantId, mainImg)}
              productName={productName}
              price={price}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
