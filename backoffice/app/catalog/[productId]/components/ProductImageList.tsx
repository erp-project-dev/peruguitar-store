/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { toast } from "sonner";
import { getImagePath } from "@/app/common/helpers/product.helper";
import { Trash2, ChevronUp, ChevronDown, Check } from "lucide-react";

type Props = {
  images: string[];
  onRemove: (image: string) => void;
  onReorder: (images: string[]) => void;
};

export default function ProductImageList({
  images,
  onRemove,
  onReorder,
}: Props) {
  if (!images.length) return null;

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;

    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);

    onReorder(next);
  };

  const handleRemove = (image: string) => {
    toast("Remove image?", {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: () => onRemove(image),
      },
      cancel: { label: "Cancel", onClick() {} },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {images.map((image, index) => (
        <div
          key={image}
          className={`grid grid-cols-[96px_1fr_90px_80px] items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3`}
        >
          <div className="h-24 w-24 overflow-hidden rounded-md bg-neutral-100">
            <img
              src={getImagePath(image)}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-neutral-600 break-all">{image}</p>

            {index === 0 && (
              <div className="mt-2 flex items-center gap-2 text-xs font-bold">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check className="h-3 w-3" />
                </span>

                <p>Selected as main</p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wide text-neutral-400">
              Order
            </span>
            <span className="font-bold text-2xl">#{index + 1}</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => move(index, index - 1)}
              disabled={index === 0}
              title="Move up"
              className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
            >
              <ChevronUp className="h-5 w-5" />
            </button>

            <button
              onClick={() => move(index, index + 1)}
              disabled={index === images.length - 1}
              title="Move down"
              className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
            >
              <ChevronDown className="h-5 w-5" />
            </button>

            <button
              onClick={() => handleRemove(image)}
              title="Remove image"
              className="rounded-md p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
