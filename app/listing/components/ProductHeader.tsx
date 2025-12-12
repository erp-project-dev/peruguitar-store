interface ProductHeaderProps {
  total: number;
  pinned: number;
  inactive: number;
  minPrice: number | null;
  maxPrice: number | null;
  avgPrice: number | null;
}

export function ProductHeader({
  total,
  pinned,
  inactive,
  minPrice,
  maxPrice,
  avgPrice,
}: ProductHeaderProps) {
  const stats = [
    {
      label: "Guitarras",
      value: total,
    },
    {
      label: "Destacadas",
      value: pinned,
    },
    {
      label: "Inactivos",
      value: inactive,
    },
    {
      label: "Rango de precios",
      value:
        minPrice !== null && maxPrice !== null
          ? `S/ ${minPrice.toLocaleString(
              "es-PE"
            )} - S/ ${maxPrice.toLocaleString("es-PE")}`
          : "—",
    },
    {
      label: "Precio promedio",
      value: avgPrice !== null ? `S/ ${avgPrice.toLocaleString("es-PE")}` : "—",
    },
  ];

  return (
    <header className="grid grid-cols-1 gap-4 sm:grid-cols-6">
      {stats.map(({ label, value }, index) => {
        const isTopRow = index < 3; // primeros 3
        const colSpan = isTopRow ? "sm:col-span-2" : "sm:col-span-3";

        return (
          <div
            key={label}
            className={`rounded-md border border-gray-200 bg-gray-100 px-6 py-5 text-center ${colSpan}`}
          >
            <div className="text-sm uppercase tracking-wide text-gray-500">
              {label}
            </div>

            <div
              className={`mt-1 font-semibold text-gray-900 ${
                isTopRow ? "text-5xl" : "text-4xl"
              }`}
            >
              {value}
            </div>
          </div>
        );
      })}
    </header>
  );
}
