import { CategoryId } from "@/infrastracture/domain/category.entity";
import { Product } from "@/infrastracture/domain/product.entity";

type ProductOmitedProperties =
  | "specs"
  | "category_id"
  | "_id"
  | "created_at"
  | "created_by"
  | "updated_at"
  | "updated_by";

export interface ProductEntryForm
  extends Omit<Product, ProductOmitedProperties> {
  _id?: string;
  category_id?: CategoryId;
  specs_raw?: string;
}

export const productEntryFrom: ProductEntryForm = {
  category_id: undefined,
  publish_date: "",
  brand_id: undefined,
  merchant_id: "",
  type_id: undefined,
  condition: undefined,
  condition_score: undefined,
  name: "",
  model: undefined,
  description: "",
  fullDescription: undefined,
  currency: undefined,
  price: undefined,
  price_type: undefined,
  externalVideoUrl: undefined,
  specs_raw: undefined,
  is_enabled: true,
  is_pinned: false,
  images: [],
};
