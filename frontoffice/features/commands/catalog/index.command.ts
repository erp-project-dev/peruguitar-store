import DATA from "@/app/store";

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
  parentCategoryId?: string;
}

export class CatalogGetCommand {
  static handle(props: CatalogGetCommandProps = {}): CatalogViewModel {
    const { Merchants, Catalog, Brands, Types, Categories } = DATA;

    const sortType: SortType = props.sort ?? "latest";

    let allowedCategoryIds: Set<string> | null = null;

    if (props.parentCategoryId) {
      allowedCategoryIds = new Set(
        Categories.filter((c) => c.parent_id === props.parentCategoryId).map(
          (c) => c.id
        )
      );
    }

    const filter = this.buildFilter(props, allowedCategoryIds);

    let mergedItems: Product[];

    if (props.ignorePinned) {
      const items = Catalog.filter(filter);

      mergedItems =
        sortType === "random"
          ? this.shuffle(items)
          : items.sort((a, b) => this.sortItems(a, b, sortType));
    } else {
      const pinnedItems = Catalog.filter((p) => p.is_pinned).filter(filter);

      const standardItems = Catalog.filter((p) => !p.is_pinned).filter(filter);

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
        throw new Error(`DATA ERROR: Merchant not found for product ${p.id}`);
      }

      const brand = Brands.find((b) => b.id === p.brand_id);
      const type = Types.find((t) => t.id === p.type_id);
      const category = Categories.find((c) => c.id === p.category_id);

      if (!category) {
        throw new Error(`DATA ERROR: Category not found for product ${p.id}`);
      }

      return {
        ...p,
        category,
        type,
        brand,
        publishDate: new Date(p.publish_date),
        merchant: {
          id: merchant.id,
          fullName: `${merchant.name} ${merchant.last_name}`,
          whatsapp: merchant.whatsapp,
          instagram: merchant.instagram,
        },
        isSold: p.status === "sold",
      };
    });

    return {
      total: items.length,
      items,
    };
  }

  static buildFilter(
    props: CatalogGetCommandProps,
    allowedCategoryIds?: Set<string> | null
  ) {
    return (item: Product) => {
      if (props.notIn && props.notIn.includes(item.id)) {
        return false;
      }

      if (allowedCategoryIds && !allowedCategoryIds.has(item.category_id)) {
        return false;
      }

      if (props.brand && item.brand_id !== props.brand) {
        return false;
      }

      if (props.type && item.type_id !== props.type) {
        return false;
      }

      if (item.price) {
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
      }

      return true;
    };
  }

  static sortItems(a: Product, b: Product, sortType: SortType) {
    const dateA = new Date(a.publish_date).getTime();
    const dateB = new Date(b.publish_date).getTime();

    if (sortType === "latest") return dateB - dateA;
    if (sortType === "oldest") return dateA - dateB;

    if (a.price && b.price) {
      if (sortType === "price_desc") return b.price - a.price;
      if (sortType === "price_asc") return a.price - b.price;
    }

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
