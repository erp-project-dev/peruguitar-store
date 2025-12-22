import { translateProductSpec } from "@/features/helpers/product.helper";

interface ProductSpecsProps {
  specs: Record<string, string | undefined>;
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const rows = Object.entries(specs)
    .filter(([, value]) => value !== undefined)
    .reduce<[string, string | undefined][][]>((acc, curr, index) => {
      if (index % 3 === 0) acc.push([]);
      acc[acc.length - 1].push(curr);
      return acc;
    }, []);

  return (
    <div className="overflow-hidden rounded">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`
            grid grid-cols-1 md:grid-cols-3
            ${rowIndex % 2 === 0 ? "bg-white/40" : "bg-transparent"}
          `}
        >
          {row.map(([key, value]) => (
            <div key={key} className="px-4 py-3">
              <p className="text-xs font-semibold text-gray-600">
                {translateProductSpec(key)}
              </p>
              <p className="text-sm text-gray-900 break-words">
                {value === null ? "—" : String(value)}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
