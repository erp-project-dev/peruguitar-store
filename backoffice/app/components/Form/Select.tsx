import { forwardRef, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

const baseClasses =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pr-9 text-sm text-neutral-900 " +
  "transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900";

const Select = forwardRef<HTMLInputElement, SelectProps>(function Select(
  { value, onChange, options, placeholder, className = "" },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectOption = (opt: Option) => {
    setOpen(false);
    setSearch("");
    setActiveIndex(-1);

    onChange?.(opt.value);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
          setSearch("");
          setActiveIndex(-1);
        }
      }}
    >
      <input
        ref={ref}
        value={search || selected?.label || ""}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            setOpen(true);
            setActiveIndex(0);
            return;
          }

          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
          }

          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          }

          if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            const opt = filteredOptions[activeIndex];
            if (opt) selectOption(opt);
          }

          if (e.key === "Escape") {
            setOpen(false);
            setSearch("");
            setActiveIndex(-1);
          }
        }}
        className={`${baseClasses} ${className}`}
      />

      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
        strokeWidth={2}
      />

      {open && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border border-neutral-200 bg-white shadow-sm">
          {filteredOptions.length === 0 && (
            <div className="px-3 py-2 text-sm text-neutral-400">No results</div>
          )}

          {filteredOptions.map((opt, index) => (
            <button
              key={opt.value}
              type="button"
              tabIndex={-1}
              className={`w-full px-3 py-2 text-left text-sm ${
                index === activeIndex
                  ? "bg-neutral-100"
                  : "hover:bg-neutral-100"
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectOption(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default Select;
