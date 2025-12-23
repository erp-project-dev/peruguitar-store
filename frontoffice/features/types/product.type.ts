import { CategoryId } from "./category.type";

export type ProductCurrency = "USD" | "PEN";
export type ProductCondition = "new" | "like_new";
export type price_type = "fixed" | "negotiable";

export interface Product {
  id: string;
  category_id: CategoryId;

  name: string;

  type_id?: string;
  brand_id?: string;
  model?: string;

  condition?: ProductCondition;
  condition_score?: number;

  description: string;
  fullDescription?: string;

  specs: Record<string, string>;

  card_pic: string;

  images: string[];
  externalVideoUrl?: string;

  currency: ProductCurrency;
  price?: number;
  price_type?: price_type;

  publish_date: string;

  is_pinned: boolean;

  merchant_id: string;
}
