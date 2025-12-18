"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: "auto" | number;
  mobileTitle: string;
};

export default function CatalogFilterSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccionar",
  width = "auto",
  mobileTitle,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open || isDesktop) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open, isDesktop]);

  useEffect(() => {
    if (!open || !isDesktop) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, isDesktop]);

  const desktopWidthStyle =
    isDesktop && typeof width === "number"
      ? { width }
      : isDesktop && width === "auto"
      ? { width: "fit-content" }
      : undefined;

  return (
    <>
      <div
        ref={ref}
        className="relative w-full sm:w-auto"
        style={desktopWidthStyle}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between text-sm text-gray-100"
        >
          <span className={selected ? "" : "text-gray-400"}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </button>

        {open && isDesktop && (
          <div className="absolute z-50 mt-1 w-full rounded-md bg-gray-800 border border-gray-700 shadow-lg">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-700 ${
                  value === o.value ? "bg-gray-700 text-white" : "text-gray-100"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {open && !isDesktop && (
        <div className="fixed inset-0 z-50 bg-gray-900">
          <div className="sticky top-0 flex items-center justify-between px-4 py-4 border-b border-gray-800 bg-gray-950">
            <span className="text-base font-semibold text-white">
              {mobileTitle}
            </span>
            <button onClick={() => setOpen(false)}>
              <X className="h-5 w-5 text-gray-200" />
            </button>
          </div>

          <div className="overflow-y-auto overscroll-contain">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full px-5 py-4 text-left text-base border-b border-gray-800 ${
                  value === o.value ? "bg-gray-800 text-white" : "text-gray-100"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
