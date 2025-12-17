import Image from "next/image";

import { ProductViewModel } from "@/features/commands/catalog/index.type";
import { getCatalogImagePath } from "@/features/helpers/product.helper";

export default function ProductDetails({
  product,
}: {
  product: ProductViewModel;
}) {
  const photos = [
    product.pic_1,
    product.pic_2,
    product.pic_3,
    product.pic_4,
    product.pic_6,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-4 bg-slate-100 px-4 py-4 border-t-4 border-black">
      <div className="grid grid-cols-6 gap-2">
        {photos.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-md bg-slate-200"
          >
            <Image
              src={getCatalogImagePath(product.merchant.id, src)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-800 leading-relaxed">
        {product.description}
      </p>

      <div className="grid grid-cols-4 gap-x-4 gap-y-1 text-sm">
        {Object.entries(product.specs).map(([key, value]) => (
          <div key={key} className="text-slate-800">
            <span className="text-slate-600">{key}</span>:{" "}
            <span>{String(value) ?? "--"}</span>
          </div>
        ))}
      </div>

      <div className="text-sm text-slate-800">
        <span className="text-slate-600">Merchant:</span>{" "}
        {product.merchant.fullName}
      </div>
    </div>
  );
}
