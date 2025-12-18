import { Brand } from "@/features/types/brand.type";
import { ProductType } from "@/features/types/product-type";
import { PriceType, ProductCurrency } from "@/features/types/product.type";
import { GuitarSpecs } from "@/features/types/spec.type";

export interface ProductPageViewModel {
  id: string;
  category: string;
  name: string;
  type: ProductType;
  brand: Brand;
  model: string;
  condition: string;
  conditionScore: number;
  description: string;
  specs: GuitarSpecs;

  images: string[];
  card_pic: string;

  currency: ProductCurrency;
  price: number;
  priceType: PriceType;

  publishDate: Date;
  publishType: string;

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
