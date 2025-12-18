"use client";

import { ReactNode } from "react";

interface TooltipProps {
  label: string;
  children: ReactNode;
  width?: number | "auto";
}

export default function Tooltip({
  label,
  children,
  width = "auto",
}: TooltipProps) {
  const whitespaceClass =
    width === "auto" ? "whitespace-nowrap" : "whitespace-normal";

  return (
    <div className="relative inline-flex group">
      {children}

      <div
        className={`
          pointer-events-none
          absolute bottom-full left-1/2 mb-2
          -translate-x-1/2
          rounded-md
          bg-gray-800
          px-3 py-1.5
          text-xs
          text-gray-100
          opacity-0
          scale-95
          transition-all
          duration-150
          group-hover:opacity-100
          group-hover:scale-100
          ${whitespaceClass}
        `}
        style={width !== "auto" ? { width } : undefined}
      >
        {label}

        <span
          className="
            absolute top-full left-1/2
            -translate-x-1/2
            w-0 h-0
            border-l-5 border-l-transparent
            border-r-5 border-r-transparent
            border-t-5 border-t-gray-800
          "
        />
      </div>
    </div>
  );
}
