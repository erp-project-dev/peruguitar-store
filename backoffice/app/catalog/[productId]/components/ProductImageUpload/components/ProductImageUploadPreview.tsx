/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import Button from "@/app/components/Form/Button";
import { ModalFooter } from "@/app/components/Modal/ModalFooter";
import ProductImageUploadEdit from "./ProductimageUploadEdit";

type Props = {
  files: File[];
  onSelect: (files: File[]) => void;
};

function formatSize(file: File) {
  return `${Math.round(file.size / 1024)} KB`;
}

export default function ProductImageUploadPreview({ files, onSelect }: Props) {
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setLocalFiles(files);
    setSelectedIndex(null);
  }, [files]);

  if (localFiles.length === 0) return null;

  const selectedFile =
    selectedIndex !== null ? localFiles[selectedIndex] : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-4">
        {/* LEFT: GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
          {localFiles.map((file, index) => {
            const url = URL.createObjectURL(file);
            const isSelected = index === selectedIndex;

            return (
              <div
                key={`${file.name}-${index}`}
                onClick={() => setSelectedIndex(index)}
                className={`
                  cursor-pointer rounded-md border bg-white p-2 transition
                  ${
                    isSelected
                      ? "border-neutral-900 shadow-md"
                      : "border-neutral-300 hover:border-neutral-400 hover:shadow-sm"
                  }
                `}
              >
                <div className="relative aspect-square overflow-hidden rounded">
                  <Image
                    src={url}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="mt-2 text-xs text-neutral-600">
                  <p className="truncate font-medium text-neutral-800">
                    {file.name}
                  </p>
                  <p>{formatSize(file)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-md border border-neutral-300 bg-neutral-50">
          {selectedFile ? (
            <ProductImageUploadEdit
              file={selectedFile}
              onApply={(editedFile) => {
                setLocalFiles((prev) =>
                  prev.map((f, i) => (i === selectedIndex ? editedFile : f))
                );

                toast.success("Image updated");
                setSelectedIndex(null);
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              Select an image to edit
            </div>
          )}
        </div>
      </div>

      <ModalFooter>
        <Button
          variant="success"
          size="lg"
          onClick={() => {
            onSelect(localFiles);
            toast.success(
              `${localFiles.length} image${
                localFiles.length > 1 ? "s" : ""
              } uploaded`
            );
          }}
        >
          Upload images
        </Button>
      </ModalFooter>
    </div>
  );
}
