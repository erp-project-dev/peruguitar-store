import { CatalogGetCommand } from "@/features/commands/catalog/index.command";
import CatalogProduct from "@/features/components/Catalog/components/CatalogProduct";

interface ProductSimilarLisingProps {
  excludedProductId: string;
}

export default function ProductSimilarLising({
  excludedProductId,
}: ProductSimilarLisingProps) {
  const { items } = CatalogGetCommand.handle({
    sort: "random",
    notIn: [excludedProductId],
    ignorePinned: true,
    limit: 6,
    status: "available",
  });

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Otros productos</h2>

      <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6">
        {items.map((product) => (
          <CatalogProduct key={product.id} product={product} ignorePinned />
        ))}
      </div>
    </div>
  );
}
