/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

interface ProductStoryCardModalProps {
  imageCardUrl: string;
}

export default function ProductStoryCardModal({
  imageCardUrl,
}: ProductStoryCardModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          inline-flex items-center justify-center
          gap-2
          bg-white text-black
          py-3 px-6
          rounded-lg font-medium
          hover:bg-gray-100
          active:bg-gray-200
          transition-all
          shadow-sm
          cursor-pointer
        "
      >
        <Download className="w-5 h-5" />
        <span>Descargar Story Card</span>
      </button>

      {open && (
        <div
          className="
            fixed inset-0 z-9999
            bg-black/80 backdrop-blur-sm
            flex items-center justify-center
            px-4
          "
        >
          <div className="relative w-full max-w-lg mx-auto">
            <button
              onClick={() => setOpen(false)}
              className="
                absolute -top-10 right-0
                text-white hover:text-gray-300
                transition
              "
            >
              <X className="w-9 h-9" />
            </button>

            <img
              src={imageCardUrl}
              alt="Story Card"
              className="w-full rounded-lg shadow-lg"
            />

            <p className="text-center text-gray-300 mt-4 italic">
              Guarda esta imagen para compartirla en tus historias
            </p>
          </div>
        </div>
      )}
    </>
  );
}
