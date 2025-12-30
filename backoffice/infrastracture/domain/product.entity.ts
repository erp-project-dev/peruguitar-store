import { BaseEntity } from "./base.entity";
import { CategoryId } from "./category.entity";
import {
  BookSpecs,
  DigitalPedalboardSpecs,
  GuitarSpecs,
  PickSpecs,
  TShirtSpecs,
} from "./product-specs";

export type ProductStatus = "available" | "disabled" | "sold";

export interface Product extends BaseEntity {
  category_id: CategoryId;

  brand_id?: string;
  type_id?: string;

  condition?: string;
  condition_score?: number;

  name: string;
  model?: string;
  description: string;
  fullDescription?: string;

  currency?: string;
  price?: number;
  price_type?: string;

  specs?:
    | GuitarSpecs
    | BookSpecs
    | PickSpecs
    | TShirtSpecs
    | DigitalPedalboardSpecs;

  images: string[];
  externalVideoUrl?: string;

  status: ProductStatus;
  is_pinned: boolean;

  merchant_id: string;
  publish_date: string;
}
