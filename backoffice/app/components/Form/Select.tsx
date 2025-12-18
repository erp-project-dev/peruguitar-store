import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

const baseClasses =
  "w-full appearance-none rounded-md border border-neutral-300 bg-white px-3 py-2 pr-9 text-sm text-neutral-900 " +
  "transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900";

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { value, onChange, options, placeholder, className = "" },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        className={`${baseClasses} ${className}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
        strokeWidth={2}
      />
    </div>
  );
});

export default Select;
