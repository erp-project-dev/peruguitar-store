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
  full_description: undefined,
  currency: undefined,
  price: undefined,
  price_type: undefined,
  external_video_url: undefined,
  specs_raw: undefined,
  status: "disabled",
  is_pinned: false,
  images: [],
};
