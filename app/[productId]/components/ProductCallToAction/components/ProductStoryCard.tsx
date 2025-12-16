/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

import { X, Download } from "lucide-react";
import Tooltip from "@/app/components/Tooltip";

interface ProductStoryCardProps {
  imageCardUrl: string;
}

export default function ProductStoryCard({
  imageCardUrl,
}: ProductStoryCardProps) {
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
      <div className="flex flex-col items-center">
        <Tooltip label="Descargar Story Card">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-500 border-dashed hover:bg-gray-200 transition cursor-pointer"
          >
            <Download className="w-6 h-6" />
          </button>
        </Tooltip>

        <span className="mt-1 text-gray-500 text-xs">Story Card</span>
      </div>

      {open && (
        <div className="fixed inset-0 z-9999 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="relative w-full max-w-lg mx-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
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
