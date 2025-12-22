import { CURRENCIES, PRODUCT_PRICE_TYPES } from "@/app/common/data";
import { ProductEntryForm } from "../components/ProductForm";

export const productEntryFrom: ProductEntryForm = {
  category_id: null,
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
  currency: CURRENCIES[1],
  price: 0,
  priceType: PRODUCT_PRICE_TYPES[0],
  specs_raw: "",
  is_enabled: true,
  is_pinned: false,
};
