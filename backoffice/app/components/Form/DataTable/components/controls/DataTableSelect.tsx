"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

export interface DataTableSelectOption {
  value: string | null;
  label: string;
}

interface DataTableSelectProps {
  value?: string | null;
  options: DataTableSelectOption[];
  placeholder?: string;
  onChange: (value: string | null) => void;
}

export default function DataTableSelect({
  value,
  options,
  placeholder = "Select…",
  onChange,
}: DataTableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  return (
    <div ref={ref} className="relative w-full">
      {/* INPUT */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-left hover:border-neutral-400"
      >
        <span className="truncate">
          {selected?.label ?? (
            <span className="text-neutral-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown size={14} className="text-neutral-500" />
      </button>

      {/* POPOVER */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded border border-neutral-200 bg-white shadow-lg">
          {/* SEARCH */}
          <div className="flex items-center gap-2 border-b px-2 py-1">
            <Search size={14} className="text-neutral-400" />
            <input
              className="w-full text-sm outline-none"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* OPTIONS */}
          <div className="max-h-48 overflow-auto p-1">
            {filtered.length === 0 && (
              <div className="px-2 py-1 text-xs text-neutral-400">
                No results
              </div>
            )}

            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full rounded px-2 py-1 text-sm text-left hover:bg-neutral-100 ${
                  opt.value === value ? "bg-neutral-100 font-medium" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
