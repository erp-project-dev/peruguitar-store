"use client";

import { Image as ImageIcon, Trash2 } from "lucide-react";

type Props = {
  images: string[];
  onRemove: (image: string) => void;
};

export default function ProductImageList({ images, onRemove }: Props) {
  if (!images.length) return null;

  return (
    <div className="flex flex-col gap-2">
      {images.map((image) => (
        <div
          key={image}
          className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-neutral-100">
            <ImageIcon className="h-6 w-6 text-neutral-400" />
          </div>

          <span className="flex-1 truncate text-xs text-neutral-500">
            {image}
          </span>

          <button
            type="button"
            onClick={() => onRemove(image)}
            className="rounded-md p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
            title="Remove image"
          >
            <Trash2 className="h-6 w-6" />
          </button>
        </div>
      ))}
    </div>
  );
}
