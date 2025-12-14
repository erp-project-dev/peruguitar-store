import { Brand } from "@/app/types/brand.type";
import { ProductType } from "@/app/types/product-type";
import { ProductCurrency } from "@/app/types/product.type";
import { GuitarSpecs } from "@/app/types/spec.type";

export interface ProductViewModel {
  id: string;
  category: string;
  name: string;
  type: ProductType;
  brand: Brand;
  model: string;
  status: string;
  statusScore: number;
  description: string;
  specs: GuitarSpecs;

  pic_1: string;
  pic_2?: string;
  pic_3?: string;
  pic_4?: string;
  pic_6?: string;
  card_pic: string;

  currency: ProductCurrency;
  price: number;

  publishDate: Date;
  publishType: string;

  isPinned: boolean;
  isEnabled: boolean;

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
