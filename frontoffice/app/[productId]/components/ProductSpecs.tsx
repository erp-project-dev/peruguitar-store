import { translateProductSpec } from "@/features/helpers/product.helper";

interface ProductSpecsProps {
  specs: Record<string, string | undefined>;
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
      {Object.entries(specs)
        .filter((key, value) => value)
        .map(([key, value]) => (
          <div key={key} className="min-w-0">
            <p className="text-gray-800 font-bold text-sm capitalize truncate">
              {translateProductSpec(key)}
            </p>
            <p className="wrap-break-word">
              {value === null ? "—" : String(value)}
            </p>
          </div>
        ))}
    </div>
  );
}
