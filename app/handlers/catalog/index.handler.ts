import DATA from "@/app/data";
import { CatalogViewModel, ProductViewModel } from "./index.type";
import { Product } from "@/app/types/product.type";

type SortType = "latest" | "oldest" | "random";

export interface CatalogHandlerProps {
  sort?: SortType;
}

function sortItems(a: Product, b: Product, sortType: SortType) {
  const dateA = new Date(a.publish_date).getTime();
  const dateB = new Date(b.publish_date).getTime();

  if (sortType === "latest") {
    return dateB - dateA;
  }

  if (sortType === "oldest") {
    return dateA - dateB;
  }

  return Math.random() - 0.5;
}

export const CatalogHandler = (
  props: CatalogHandlerProps = {}
): CatalogViewModel => {
  const { Merchants, Catalog } = DATA;

  const sortType = props.sort ?? "random";

  const pinnedItems = Catalog.filter((p) => p.is_enabled && p.is_pinned);
  const standardItems = Catalog.filter(
    (p) => p.is_enabled && !p.is_pinned
  ).sort((a, b) => sortItems(a, b, sortType));

  const items: ProductViewModel[] = [...pinnedItems, ...standardItems].map(
    (p) => {
      const merchant = Merchants.find((x) => x.id === p.merchant_id);

      if (!merchant) {
        throw new Error(
          `DATA ERROR: Merchant not found for product ${p.id} (merchant_id: ${p.merchant_id})`
        );
      }

      return {
        id: p.id,
        category: p.category,
        name: p.name,
        brand: p.brand,
        model: p.model,
        status: p.status,
        statusScore: p.status_score,
        description: p.description,
        specs: p.specs,
        pic_1: p.pic_1,
        pic_2: p.pic_2,
        pic_3: p.pic_3,
        pic_4: p.pic_4,
        pic_6: p.pic_6,
        currency: p.currency,
        price: p.price,
        publishDate: new Date(p.publish_date),
        publishType: p.publish_type,
        isPinned: p.is_pinned,
        isEnabled: p.is_enabled,
        merchant: {
          id: merchant.id,
          fullName: `${merchant.name} ${merchant.last_name}`,
          whatsapp: merchant.whatsapp,
          instagram: merchant.instagram,
        },
      };
    }
  );

  return {
    total: items.length,
    items,
  };
};
