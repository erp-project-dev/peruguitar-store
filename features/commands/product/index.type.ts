import { ProductType } from "@/features/types/product-type";
import { PriceType, ProductCurrency } from "@/features/types/product.type";
import { GuitarSpecs } from "@/features/types/spec.type";

export interface ProductPageViewModel {
  id: string;
  category: string;
  name: string;
  type: ProductType;
  brand: { id: string; name: string };
  model: string;
  status: string;
  statusScore: number;
  description: string;
  specs: GuitarSpecs;

  pic_1: string;
  pic_2?: string;
  pic_3?: string;
  pic_4?: string;
  pic_5?: string;
  pic_6?: string;
  card_pic: string;

  currency: ProductCurrency;
  price: number;
  priceType: PriceType;

  publishDate: Date;
  publishType: string;

  is_enabled: boolean;

  merchant: {
    id: string;
    fullName: string;
    firstName: string;
    country: string;
    state: string;
    city: string;
    lastName: string;
    whatsapp: string;
    instagram: string;
  };
}
