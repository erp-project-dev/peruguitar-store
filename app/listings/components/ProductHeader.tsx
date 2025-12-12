import { Package, Pin, EyeOff } from "lucide-react";

interface ProductHeaderProps {
  total: number;
  pinned: number;
  inactive: number;
}

export function ProductHeader({ total, pinned, inactive }: ProductHeaderProps) {
  const stats = [
    {
      label: "Total",
      value: total,
      icon: Package,
    },
    {
      label: "Pinned",
      value: pinned,
      icon: Pin,
    },
    {
      label: "Inactivos",
      value: inactive,
      icon: EyeOff,
    },
  ];

  return (
    <header className="space-y-4">
      <h1 className="text-2xl font-bold">Listings</h1>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-100 px-4 py-3"
          >
            <Icon className="h-5 w-5 text-gray-600" />

            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">
                {label}
              </div>
              <div className="text-xl font-semibold text-gray-900">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}
