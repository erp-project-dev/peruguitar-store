import { Check } from "lucide-react";

export default function ProductSoldNotice() {
  return (
    <div
      className="
        rounded-xl bg-neutral-800
        px-6 py-4
        text-neutral-100
        text-center
      "
      role="status"
    >
      <div className="flex items-center justify-center gap-2">
        <Check className="h-5 w-5 text-neutral-200" />
        <strong className="text-sm font-semibold">Producto vendido</strong>
      </div>

      <p className="mt-1 text-sm text-neutral-300">
        Este producto ya ha sido vendido por el anunciante.
      </p>
    </div>
  );
}
