import { Brand } from "@/features/types/brand.type";
import { ProductType } from "@/features/types/product-type";
import { ProductCurrency } from "@/features/types/product.type";
import { GuitarSpecs } from "@/features/types/spec.type";

export interface ProductViewModel {
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

  publishDate: Date;
  publishType: string;

  isPinned: boolean;

  merchant: {
    id: string;
    fullName: string;
    whatsapp: string;
    instagram: string;
  };
}

export interface CatalogViewModel {
  total: number;
  items: ProductViewModel[];
}
