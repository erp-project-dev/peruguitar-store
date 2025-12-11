import { Brand } from "./brand.type";
import { Merchant } from "./merchant.type";
import { Product } from "./product.type";
import { Setting } from "./setting.type";

export interface StoreData {
  Merchants: Merchant[];
  Catalog: Product[];
  Brands: Brand[];
  Settings: Setting[];
}
