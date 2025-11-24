import { GuitarSpecs } from "./spec.type";

export type ProductStatus = "new" | "like_new";
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
  brand: string;
  model: string;

  status: ProductStatus;
  status_score: number;

  description: string;
  specs: GuitarSpecs;

  pic_1: string;
  pic_2?: string;
  pic_3?: string;
  pic_4?: string;
  pic_6?: string;

  price: number;

  publish_date: string;
  publish_type: string;

  is_enabled: boolean;
  merchant_id: string;
}
