import { LucideIcon } from "lucide-react";

type MetricTableProps = {
  title?: string;
  data: Record<string, number | string>;
  labelHeader?: string;
  valueHeader?: string;
  limit?: number;
  formatter?: (key: string) => string;
  iconResolver?: (key: string) => LucideIcon | null;
};

export default function MetricTable({
  title,
  data,
  labelHeader = "Label",
  valueHeader = "Total",
  limit,
  formatter,
  iconResolver,
}: MetricTableProps) {
  const rows = Object.entries(data)
    .map(([key, value]) => ({
      key,
      label: formatter ? formatter(key) : key,
      value,
      Icon: iconResolver?.(key) ?? null,
    }))
    .slice(0, limit ?? Object.keys(data).length);

  if (rows.length === 0) {
    return <div className="text-sm text-neutral-500">No data available</div>;
  }

  return (
    <div className="bg-white border border-neutral-200 rounded overflow-hidden">
      {title && (
        <div className="px-4 py-2 border-b border-neutral-200 text-sm font-semibold text-neutral-700">
          {title}
        </div>
      )}

      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-500">
          <tr>
            <th className="text-left px-4 py-2 font-medium">{labelHeader}</th>
            <th className="text-right px-4 py-2 font-medium">{valueHeader}</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.key}
              className="border-t border-neutral-100 hover:bg-neutral-50 transition"
            >
              <td className="px-4 py-2 text-neutral-700">
                <div className="flex items-center gap-2">
                  {row.Icon && (
                    <row.Icon className="w-4 h-4 text-neutral-400" />
                  )}
                  <span>{row.label}</span>
                </div>
              </td>

              <td className="px-4 py-2 text-right font-medium text-neutral-900">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
