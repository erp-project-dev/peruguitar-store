import { BaseEntity } from "./base.entity";
import { CategoryId } from "./category.entity";
import { BookSpecs, GuitarSpecs } from "./product-specs.entity";

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

  specs?: GuitarSpecs | BookSpecs;

  images: string[];
  externalVideoUrl?: string;

  is_enabled: boolean;
  is_pinned: boolean;

  merchant_id: string;
  publish_date: string;
}
