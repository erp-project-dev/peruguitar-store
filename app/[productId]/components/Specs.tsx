import { translateProductSpec } from "@/app/helpers/product.helper";
import { GuitarSpecs } from "@/app/types/spec.type";

interface SpecsProps {
  specs: GuitarSpecs;
  brand: string;
  model: string;
}

export default function ProductSpecs({ specs, brand, model }: SpecsProps) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Especificaciones</h2>

      <div className="bg-[#161B22] rounded-xl p-8 shadow-lg border border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
          <div>
            <p className="text-gray-400 text-sm truncate">Marca</p>
            <p className="text-gray-100 font-semibold wrap-break-word">
              {brand}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm truncate">Modelo</p>
            <p className="text-gray-100 font-semibold wrap-break-word">
              {model}
            </p>
          </div>

          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="min-w-0">
              <p className="text-gray-400 text-sm capitalize truncate">
                {translateProductSpec(key)}
              </p>
              <p className="text-gray-100 font-semibold wrap-break-word">
                {value === null ? "—" : String(value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
