import { translateProductSpec } from "@/features/helpers/product.helper";
import { GuitarSpecs } from "@/features/types/spec.type";

interface ProductSpecsProps {
  specs: GuitarSpecs;
  brand: string;
  model: string;
}

export default function ProductSpecs({
  specs,
  brand,
  model,
}: ProductSpecsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
      <div>
        <p className="text-gray-800 font-bold text-sm truncate">Marca</p>
        <p className="wrap-break-word">{brand}</p>
      </div>

      <div>
        <p className="text-gray-800 font-bold text-sm truncate">Modelo</p>
        <p className="wrap-break-word">{model}</p>
      </div>

      {Object.entries(specs).map(([key, value]) => (
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
