"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ModalSize = "md" | "lg" | "xl" | "2xl" | "3xl";

type ModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  children: React.ReactNode;
};

const sizeMap: Record<ModalSize, string> = {
  md: "max-w-xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  "3xl": "max-w-screen-2xl",
};

export default function Modal({
  title,
  open,
  onClose,
  size = "lg",
  children,
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className={`
          relative z-10 flex w-full flex-col overflow-hidden
          bg-white shadow-lg
          max-h-[90vh] rounded-lg
          ${sizeMap[size]}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 py-3">
          <h2 className="text-sm font-semibold text-white">{title}</h2>

          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}
