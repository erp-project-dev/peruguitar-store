import { Brand } from "./brand.type";
import { Category } from "./category.type";
import { Merchant } from "./merchant.type";
import { Meta } from "./meta.type";
import { ProductType } from "./product-type.type";
import { Product } from "./product.type";
import { Review } from "./review.type";
import { Setting } from "./setting.type";

export interface StoreData {
  Merchants: Merchant[];
  Catalog: Product[];
  Brands: Brand[];
  Types: ProductType[];
  Settings: Setting[];
  Categories: Category[];
  Reviews: Review[];
  meta: Meta;
}
