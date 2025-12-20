"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/app/components/Modal/Modal";
import ProductImageUploadPreview from "./components/ProductImageUploadPreview";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type Props = {
  onSelect: (files: File[]) => void;
  max?: number;
};

export default function ProductImageUpload({ onSelect, max = 6 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewFiles, setPreviewFiles] = useState<File[] | null>(null);

  const openPicker = () => {
    if (max === 0) return;
    inputRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || max === 0) return;

    const valid = Array.from(files).filter((f) =>
      ALLOWED_TYPES.includes(f.type)
    );

    if (valid.length > max) {
      toast.error(
        max === 0
          ? "Image upload is disabled"
          : `You can upload a maximum of ${max} image${max > 1 ? "s" : ""}`
      );
      return;
    }

    setPreviewFiles(valid);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        multiple
        hidden
        disabled={max === 0}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        onClick={openPicker}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`flex h-24 items-center justify-center rounded-lg border border-dashed bg-neutral-50 text-neutral-500
          ${
            max === 0
              ? "cursor-not-allowed border-neutral-200 bg-neutral-100"
              : "cursor-pointer border-neutral-300 hover:bg-neutral-100"
          }`}
      >
        <div className="flex items-center gap-2 text-sm">
          <ImagePlus size={18} />
          <span>
            {max === 0 ? "Image upload disabled" : "Click or drop images"}
          </span>
        </div>
      </div>

      <Modal
        title="Image Preview"
        open={!!previewFiles}
        onClose={() => setPreviewFiles(null)}
        size="2xl"
      >
        {previewFiles && (
          <ProductImageUploadPreview
            files={previewFiles}
            onSelect={(files) => {
              onSelect(files);
              setPreviewFiles(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}
