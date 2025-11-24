import { CatalogHandler } from "@/app/handlers/catalog/index.handler";

import Product from "./components/Product";

export default function Catalog() {
  const catalog = CatalogHandler();

  return (
    <div
      className="
        grid
        gap-6
        px-4
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
      "
    >
      {catalog.items.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </div>
  );
}
