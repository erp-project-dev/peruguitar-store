"use client";

interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function Switch({
  value,
  onChange,
  disabled = false,
}: SwitchProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
        value ? "bg-emerald-600" : "bg-neutral-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white transform ${
          value ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}
