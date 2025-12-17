import DATA from "@/app/data";

import { Product } from "@/features/types/product.type";

import { CatalogViewModel, ProductViewModel } from "./index.type";

export type SortType =
  | "latest"
  | "oldest"
  | "price_desc"
  | "price_asc"
  | "random";

export interface CatalogGetCommandProps {
  sort?: SortType;
  brand?: string | null;
  type?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  notIn?: string[];
  limit?: number;
  ignorePinned?: boolean;
}

export class CatalogGetCommand {
  static handle(props: CatalogGetCommandProps = {}): CatalogViewModel {
    const { Merchants, Catalog, Brands, Types } = DATA;

    const sortType: SortType = props.sort ?? "latest";
    const filter = this.buildFilter(props);

    let mergedItems: Product[];

    if (props.ignorePinned) {
      const items = Catalog.filter((p) => p.is_enabled).filter(filter);

      mergedItems =
        sortType === "random"
          ? this.shuffle(items)
          : items.sort((a, b) => this.sortItems(a, b, sortType));
    } else {
      const pinnedItems = Catalog.filter(
        (p) => p.is_enabled && p.is_pinned
      ).filter(filter);

      const standardItems = Catalog.filter(
        (p) => p.is_enabled && !p.is_pinned
      ).filter(filter);

      const orderedStandard =
        sortType === "random"
          ? this.shuffle(standardItems)
          : standardItems.sort((a, b) => this.sortItems(a, b, sortType));

      mergedItems = [...pinnedItems, ...orderedStandard];
    }

    const limitedItems =
      props.limit && props.limit > 0
        ? mergedItems.slice(0, props.limit)
        : mergedItems;

    const items: ProductViewModel[] = limitedItems.map((p) => {
      const merchant = Merchants.find((x) => x.id === p.merchant_id);
      if (!merchant) {
        throw new Error(
          `DATA ERROR: Merchant not found for product ${p.id} (merchant_id: ${p.merchant_id})`
        );
      }

      const brand = Brands.find((b) => b.id === p.brand);
      if (!brand) {
        throw new Error(
          `DATA ERROR: Brand not found for product ${p.id} (brand: ${p.brand})`
        );
      }

      const type = Types.find((tp) => tp.id === p.type);
      if (!type) {
        throw new Error(
          `DATA ERROR: Type not found for product ${p.id} (type: ${p.type})`
        );
      }

      return {
        id: p.id,
        category: p.category,
        name: p.name,
        type,
        brand,
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
        card_pic: p.card_pic,
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
    });

    return {
      total: items.length,
      items,
    };
  }

  static buildFilter(props: CatalogGetCommandProps) {
    return (item: Product) => {
      if (props.notIn && props.notIn.includes(item.id)) {
        return false;
      }

      if (props.brand && item.brand !== props.brand) {
        return false;
      }

      if (props.type && item.type !== props.type) {
        return false;
      }

      if (
        props.minPrice !== null &&
        props.minPrice !== undefined &&
        item.price < props.minPrice
      ) {
        return false;
      }

      if (
        props.maxPrice !== null &&
        props.maxPrice !== undefined &&
        item.price > props.maxPrice
      ) {
        return false;
      }

      return true;
    };
  }

  static sortItems(a: Product, b: Product, sortType: SortType) {
    const dateA = new Date(a.publish_date).getTime();
    const dateB = new Date(b.publish_date).getTime();

    if (sortType === "latest") return dateB - dateA;
    if (sortType === "oldest") return dateA - dateB;
    if (sortType === "price_desc") return b.price - a.price;
    if (sortType === "price_asc") return a.price - b.price;

    return 0;
  }

  static shuffle(items: Product[]) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
