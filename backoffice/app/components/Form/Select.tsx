/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string | number;
  group?: string;
};

type SelectProps = {
  value?: any;
  onChange?: (value: any) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

type RenderItem =
  | { type: "group"; label: string }
  | { type: "option"; option: Option };

const baseClasses =
  "w-full rounded-md border border-neutral-300 px-3 py-2 pr-9 text-sm text-neutral-900 " +
  "transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900";

const editableClasses = "bg-white";
const readOnlyClasses = "bg-neutral-100 text-neutral-600 cursor-not-allowed";

const Select = forwardRef<HTMLInputElement, SelectProps>(function Select(
  { value, onChange, options, placeholder, className = "", disabled = false },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

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

  const renderItems = useMemo<RenderItem[]>(() => {
    const hasGroups = filteredOptions.some((o) => o.group);

    if (!hasGroups) {
      return filteredOptions.map((o) => ({ type: "option", option: o }));
    }

    const grouped = new Map<string, Option[]>();
    const ungrouped: Option[] = [];

    filteredOptions.forEach((opt) => {
      if (opt.group) {
        if (!grouped.has(opt.group)) grouped.set(opt.group, []);
        grouped.get(opt.group)!.push(opt);
      } else {
        ungrouped.push(opt);
      }
    });

    const items: RenderItem[] = [];

    grouped.forEach((opts, group) => {
      items.push({ type: "group", label: group });
      opts.forEach((o) => items.push({ type: "option", option: o }));
    });

    if (ungrouped.length) {
      items.push({ type: "group", label: "Others" });
      ungrouped.forEach((o) => items.push({ type: "option", option: o }));
    }

    return items;
  }, [filteredOptions]);

  const flatOptions = useMemo(
    () =>
      renderItems.filter(
        (i): i is { type: "option"; option: Option } => i.type === "option"
      ),
    [renderItems]
  );

  const selectOption = (opt: Option) => {
    if (disabled) return;

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
        if (
          !disabled &&
          !containerRef.current?.contains(e.relatedTarget as Node)
        ) {
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
        disabled={disabled}
        onFocus={() => !disabled && setOpen(true)}
        onClick={() => !disabled && setOpen(true)}
        onChange={(e) => {
          if (disabled) return;
          setSearch(e.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onKeyDown={(e) => {
          if (disabled) return;

          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            setOpen(true);
            setActiveIndex(0);
            return;
          }

          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, flatOptions.length - 1));
          }

          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          }

          if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            const opt = flatOptions[activeIndex];
            if (opt) selectOption(opt.option);
          }

          if (e.key === "Escape") {
            setOpen(false);
            setSearch("");
            setActiveIndex(-1);
          }
        }}
        className={[
          baseClasses,
          disabled ? readOnlyClasses : editableClasses,
          className,
        ].join(" ")}
      />

      <ChevronDown
        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
          disabled ? "text-neutral-300" : "text-neutral-400"
        }`}
      />

      {open && !disabled && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border border-neutral-200 bg-white shadow-sm">
          {renderItems.length === 0 && (
            <div className="px-3 py-2 text-sm text-neutral-400">No results</div>
          )}

          {renderItems.map((item, idx) => {
            if (item.type === "group") {
              return (
                <div
                  key={`group-${item.label}-${idx}`}
                  className="px-3 py-1 text-xs font-semibold uppercase text-neutral-500"
                >
                  {item.label}
                </div>
              );
            }

            const optionIndex = flatOptions.findIndex(
              (o) => o.option.value === item.option.value
            );

            return (
              <button
                key={item.option.value}
                type="button"
                tabIndex={-1}
                className={`w-full px-3 py-2 text-left text-sm ${
                  optionIndex === activeIndex
                    ? "bg-neutral-100"
                    : "hover:bg-neutral-100"
                }`}
                onMouseEnter={() => setActiveIndex(optionIndex)}
                onClick={() => selectOption(item.option)}
              >
                {item.option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default Select;
