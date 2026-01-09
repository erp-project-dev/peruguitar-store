import { ReactNode } from "react";

type Variant = "neutral" | "success" | "warning" | "danger" | "info";

const variantStyles: Record<Variant, string> = {
  neutral: "border-neutral-200 text-neutral-900",
  success: "border-emerald-200 text-emerald-700",
  warning: "border-amber-200 text-amber-700",
  danger: "border-red-200 text-red-700",
  info: "border-blue-200 text-blue-700",
};

export function MetricCard({
  label,
  value,
  suffix,
  icon,
  variant = "neutral",
}: {
  label: string;
  value: string | number;
  suffix?: string;
  icon?: ReactNode;
  variant?: Variant;
}) {
  return (
    <div
      className={`bg-white border rounded p-4 flex items-start gap-3 ${variantStyles[variant]}`}
    >
      {icon && <div className="mt-0.5">{icon}</div>}

      <div>
        <div className="text-neutral-500 text-xs mb-1">{label}</div>
        <div className="text-xl font-semibold">
          {value.toLocaleString()}
          {suffix}
        </div>
      </div>
    </div>
  );
}
