import { GuitarSpecs } from "./spec.type";

export type ProductCurrency = "USD" | "PEN";
export type PublishType = "standard" | "premium";
export type ProductCondition = "new" | "like_new";
export type PriceType = "fixed" | "negotiable";

export type Category =
  | "guitar"
  | "bass"
  | "amplifier"
  | "effects"
  | "accessories";

export interface Product {
  id: string;
  category: Category;
  name: string;

  type_id: string;
  brand_id: string;
  model: string;

  condition: ProductCondition;
  condition_score: number;

  description: string;
  specs: GuitarSpecs;

  card_pic: string;
  images: string[];

  currency: ProductCurrency;
  price: number;
  priceType: PriceType;

  publish_date: string;
  publish_type: PublishType;

  is_pinned: boolean;

  merchant_id: string;
}
