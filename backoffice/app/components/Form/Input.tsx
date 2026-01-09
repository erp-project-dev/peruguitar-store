import { forwardRef } from "react";

type InputType = "text" | "number" | "textarea";

type InputProps = {
  type?: InputType;
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  readOnly?: boolean;
};

const baseClasses =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 " +
  "placeholder-neutral-400 transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900";

const readOnlyClasses =
  "bg-neutral-100 text-neutral-600 cursor-default focus:ring-0 focus:border-neutral-300";

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input(
    {
      type = "text",
      value,
      onChange,
      placeholder,
      rows = 4,
      className = "",
      readOnly = false,
    },
    ref
  ) {
    const classes = `${baseClasses} ${
      readOnly ? readOnlyClasses : ""
    } ${className}`;

    if (type === "textarea") {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={rows}
          value={value as string}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={(e) => !readOnly && onChange?.(e.target.value)}
          className={`${classes} resize-y`}
        />
      );
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(e) => !readOnly && onChange?.(e.target.value)}
        className={classes}
      />
    );
  }
);

export default Input;
