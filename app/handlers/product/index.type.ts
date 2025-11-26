import { PriceType } from "@/app/types/product.type";
import { GuitarSpecs } from "@/app/types/spec.type";

export interface ProductPageViewModel {
  id: string;
  category: string;
  name: string;
  brand: string;
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

  price: number;
  priceType: PriceType;

  publishDate: string;
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
