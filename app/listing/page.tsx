import { CatalogGetCommand } from "../commands/catalog/index.command";
import { ProductHeader } from "./components/ProductHeader";
import ProductListing from "./components/ProductListing";

export default function Listing() {
  const { items, total } = CatalogGetCommand.handle({ sort: "latest" });

  const pinned = items.filter((p) => p.isPinned).length;
  const inactive = items.filter((p) => !p.isEnabled).length;

  const pricesInPen = items.map((item) =>
    item.currency === "USD" ? item.price * 3.5 : item.price
  );

  const minPrice = pricesInPen.length ? Math.min(...pricesInPen) : null;
  const maxPrice = pricesInPen.length ? Math.max(...pricesInPen) : null;
  const avgPrice = pricesInPen.length
    ? Math.round(
        pricesInPen.reduce((acc, val) => acc + val, 0) / pricesInPen.length
      )
    : null;

  return (
    <section className="mx-auto w-7xl space-y-6 px-4 py-12">
      <h1 className="text-3xl font-bold">Listing</h1>
      <ProductHeader
        total={total}
        pinned={pinned}
        inactive={inactive}
        minPrice={minPrice}
        maxPrice={maxPrice}
        avgPrice={avgPrice}
      />
      <ProductListing items={items} />
    </section>
  );
}
