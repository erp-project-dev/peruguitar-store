import { Brand } from "./brand.type";
import { Merchant } from "./merchant.type";
import { Meta } from "./meta.type";
import { ProductType } from "./product-type";
import { Product } from "./product.type";
import { Setting } from "./setting.type";

export interface StoreData {
  Merchants: Merchant[];
  Catalog: Product[];
  Brands: Brand[];
  Types: ProductType[];
  Settings: Setting[];
  meta: Meta;
}
