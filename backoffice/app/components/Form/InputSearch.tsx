/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2, X } from "lucide-react";

/* ---------- TYPES ---------- */

export type SearchOption = {
  value: string | number;
  label: string;
  row: any;
};

type InputSearchProps = {
  value?: SearchOption | null;

  placeholder?: string;
  delay?: number;
  minChars?: number;
  className?: string;

  onSearch: (query: string) => Promise<SearchOption[]>;
  onChange: (row: any | null) => void;
};

/* ---------- STYLES ---------- */

const baseClasses =
  "w-full rounded-md border border-neutral-300 bg-white pl-9 pr-9 py-2 text-sm text-neutral-900 " +
  "placeholder-neutral-400 transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900";

/* ---------- COMPONENT ---------- */

export default function InputSearch({
  value = null,
  placeholder = "Search…",
  delay = 400,
  minChars = 3,
  className = "",
  onSearch,
  onChange,
}: InputSearchProps) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<SearchOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SearchOption | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---------- SYNC EXTERNAL VALUE ---------- */
  useEffect(() => {
    if (value) {
      setSelected(value);
      setQuery(value.label);
      setOptions([]);
      setHasSearched(false);
      setOpen(false);
    } else {
      setSelected(null);
      setQuery("");
      setOptions([]);
      setHasSearched(false);
    }
  }, [value]);

  /* ---------- SEARCH ---------- */
  useEffect(() => {
    if (!open || selected) return;

    if (query.trim().length < minChars) {
      setOptions([]);
      setHasSearched(false);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);

      try {
        const result = await onSearch(query.trim());
        setOptions(result);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, delay, minChars, onSearch, open, selected]);

  /* ---------- CLOSE ON OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------- HANDLERS ---------- */

  const handleSelect = (opt: SearchOption) => {
    setSelected(opt);
    setQuery(opt.label);
    setOptions([]);
    setOpen(false);
    setHasSearched(false);
    onChange(opt.row);
  };

  const clearSelection = () => {
    setSelected(null);
    setQuery("");
    setOptions([]);
    setHasSearched(false);
    onChange(null);
  };

  /* ---------- RENDER ---------- */

  return (
    <div ref={containerRef} className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
      />

      <input
        type="text"
        value={query}
        placeholder={placeholder}
        disabled={loading || !!selected}
        onFocus={() => !selected && setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        className={`${baseClasses} ${className} ${
          selected ? "bg-neutral-100 cursor-default" : ""
        }`}
      />

      {/* CLEAR */}
      {selected && (
        <X
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
          onClick={clearSelection}
        />
      )}

      {/* DROPDOWN */}
      {!selected && hasSearched && open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-auto">
          {loading && (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500">
              <Loader2 size={14} className="animate-spin" />
              Searching…
            </div>
          )}

          {!loading && options.length === 0 && (
            <div className="px-3 py-2 text-sm text-neutral-400">
              No results found
            </div>
          )}

          {!loading &&
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-100"
              >
                {opt.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
