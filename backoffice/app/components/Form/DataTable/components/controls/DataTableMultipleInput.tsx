"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export interface DataTableMultiSelectOption {
  label: string;
  value: string | null;
}

interface DataTableMultiSelectInputProps {
  options: DataTableMultiSelectOption[];
  defaultValues?: string[];
  placeholder?: string;
  onChange: (value: string[]) => void;
}

export default function DataTableMultiSelectInput({
  options,
  defaultValues = [],
  placeholder = "Select…",
  onChange,
}: DataTableMultiSelectInputProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(defaultValues);

  /* ---------------- close on outside click ---------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- filtering ---------------- */
  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.value?.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  /* ---------------- display text ---------------- */
  const displayValue = useMemo(() => {
    return selected
      .map((k) => options.find((o) => o.label === k)?.value)
      .filter(Boolean)
      .join(", ");
  }, [selected, options]);

  /* ---------------- toggle selection ---------------- */
  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = prev.includes(label)
        ? prev.filter((v) => v !== label)
        : [...prev, label];

      onChange(next);
      return next;
    });
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* INPUT */}
      <div className="flex items-center rounded border border-neutral-300 bg-white px-2 py-1 text-sm">
        <input
          readOnly
          className="flex-1 bg-transparent outline-none text-xs font-mono text-neutral-700 tracking-tight"
          placeholder={placeholder}
          value={displayValue}
        />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-2 text-neutral-500 hover:text-neutral-800"
        >
          <Search size={16} />
        </button>
      </div>

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
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* OPTIONS */}
          <div className="max-h-48 overflow-auto p-2">
            {filteredOptions.length === 0 && (
              <div className="px-1 text-xs text-neutral-400">No results</div>
            )}

            {filteredOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-neutral-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.label)}
                  onChange={() => toggle(opt.label)}
                />
                <span>{opt.value}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
