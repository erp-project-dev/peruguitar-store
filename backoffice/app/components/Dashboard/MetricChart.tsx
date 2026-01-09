"use client";

export type Variant = "neutral" | "success" | "warning" | "danger" | "info";

const variantStyles: Record<Variant, string> = {
  neutral: "border-neutral-200 text-neutral-900",
  success: "border-emerald-200 text-emerald-700",
  warning: "border-amber-200 text-amber-700",
  danger: "border-red-200 text-red-700",
  info: "border-blue-200 text-blue-700",
};

const barColors: Record<Variant, string> = {
  neutral: "#111827",
  success: "#059669",
  warning: "#d97706",
  danger: "#dc2626",
  info: "#2563eb",
};

export type MetricChartData = {
  label: string;
  value: number;
}[];

export function MetricChart({
  title,
  description,
  data,
  variant = "neutral",
  formatter,
}: {
  title: string;
  description?: string;
  data: MetricChartData;
  variant?: Variant;
  formatter?: (value: number) => string;
}) {
  const viewWidth = 1000;
  const viewHeight = 500;
  const padding = 56;
  const barGap = 20;

  if (!data || data.length === 0) {
    return (
      <div className={`bg-white border rounded p-4 ${variantStyles[variant]}`}>
        <div className="text-sm font-semibold">{title}</div>
        {description && (
          <div className="text-xs text-neutral-500">{description}</div>
        )}
        <div className="aspect-video flex items-center justify-center text-xs text-neutral-400">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const chartHeight = viewHeight - padding * 2;
  const chartWidth = viewWidth - padding * 2;

  const barWidth = (chartWidth - barGap * (data.length - 1)) / data.length;

  return (
    <div className={`bg-white border rounded p-4 ${variantStyles[variant]}`}>
      <div className="mb-3">
        <div className="text-sm font-semibold">{title}</div>
        {description && (
          <div className="text-xs text-neutral-500">{description}</div>
        )}
      </div>

      <div className="aspect-video w-full">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
        >
          {data.map((item, index) => {
            const barHeight =
              maxValue === 0 ? 0 : (item.value / maxValue) * chartHeight;

            const x = padding + index * (barWidth + barGap);
            const y = viewHeight - padding - barHeight;

            return (
              <g key={item.label}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={6}
                  fill={barColors[variant]}
                />

                {/* Value */}
                {item.value > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="16"
                    fill="#111827"
                  >
                    {formatter
                      ? formatter(item.value)
                      : item.value.toLocaleString()}
                  </text>
                )}

                {/* Label */}
                <text
                  x={x + barWidth / 2}
                  y={viewHeight - 12}
                  textAnchor="end"
                  fontSize="14"
                  fill="#6b7280"
                  transform={`rotate(-30 ${x + barWidth / 2} ${
                    viewHeight - 12
                  })`}
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
