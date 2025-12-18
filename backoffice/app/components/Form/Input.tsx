import { forwardRef } from "react";

type InputType = "text" | "number" | "textarea";

type InputProps = {
  type?: InputType;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
};

const baseClasses =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 " +
  "placeholder-neutral-400 transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900";

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input(
    { type = "text", value, onChange, placeholder, rows = 4, className = "" },
    ref
  ) {
    if (type === "textarea") {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={rows}
          value={value as string}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseClasses} resize-y ${className}`}
        />
      );
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseClasses} ${className}`}
      />
    );
  }
);

export default Input;
