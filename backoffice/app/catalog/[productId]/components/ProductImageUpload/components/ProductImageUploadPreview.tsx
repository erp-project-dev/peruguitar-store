/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Check } from "lucide-react";

import Button from "@/app/components/Form/Button";
import { ModalFooter } from "@/app/components/Modal/ModalFooter";
import ProductImageUploadEdit from "./ProductimageUploadEdit";

type Props = {
  files: File[];
  onSelect: (files: File[]) => void;
};

type LocalImage = {
  file: File;
  edited: boolean;
};

function formatSize(file: File) {
  return `${Math.round(file.size / 1024)} KB`;
}

export default function ProductImageUploadPreview({ files, onSelect }: Props) {
  const [localFiles, setLocalFiles] = useState<LocalImage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setLocalFiles(files.map((file) => ({ file, edited: false })));
    setSelectedIndex(null);
  }, [files]);

  if (localFiles.length === 0) return null;

  const selectedFile =
    selectedIndex !== null ? localFiles[selectedIndex].file : null;

  const allEdited = localFiles.length > 0 && localFiles.every((f) => f.edited);
  const editedCount = localFiles.filter((f) => f.edited).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-4">
        {/* LEFT: GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
          {localFiles.map(({ file, edited }, index) => {
            const url = URL.createObjectURL(file);
            const isSelected = index === selectedIndex;

            return (
              <div
                key={`${file.name}-${index}`}
                onClick={() => setSelectedIndex(index)}
                className={`
                  relative cursor-pointer rounded-md border p-2 transition
                  ${
                    edited
                      ? "border-emerald-300 bg-emerald-50"
                      : isSelected
                      ? "border-neutral-900 bg-white shadow-md"
                      : "border-neutral-300 bg-white hover:border-neutral-400 hover:shadow-sm"
                  }
                `}
              >
                {/* CHECK OVERLAY */}
                {edited && (
                  <div className="absolute right-4 top-4 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 shadow transition">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* IMAGE */}
                <div className="relative aspect-square overflow-hidden rounded">
                  <Image
                    src={url}
                    alt={file.name}
                    fill
                    className={`object-cover transition ${
                      edited ? "opacity-95" : ""
                    }`}
                  />

                  {/* SOFT OVERLAY */}
                  {edited && (
                    <div className="pointer-events-none absolute inset-0 bg-emerald-500/5" />
                  )}
                </div>

                {/* INFO */}
                <div className="mt-2 text-xs text-neutral-600">
                  <div className="min-w-0 truncate font-medium text-neutral-800">
                    {file.name}
                  </div>

                  <p>{formatSize(file)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: EDITOR */}
        <div className="rounded-md border border-neutral-300 bg-neutral-50">
          {selectedFile ? (
            <ProductImageUploadEdit
              file={selectedFile}
              onApply={(editedFile) => {
                setLocalFiles((prev) =>
                  prev.map((item, i) =>
                    i === selectedIndex
                      ? { file: editedFile, edited: true }
                      : item
                  )
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

      {/* FOOTER */}
      <ModalFooter>
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-neutral-500">
            Edited {editedCount} / {localFiles.length}
          </div>

          <Button
            variant="success"
            size="lg"
            disabled={!allEdited}
            onClick={() => {
              onSelect(localFiles.map((f) => f.file));
              toast.success(
                `${localFiles.length} image${
                  localFiles.length > 1 ? "s" : ""
                } uploaded`
              );
            }}
          >
            {allEdited ? "Upload images" : "Edit all images"}
          </Button>
        </div>
      </ModalFooter>
    </div>
  );
}
