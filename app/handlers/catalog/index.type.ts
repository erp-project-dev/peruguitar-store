import { GuitarSpecs } from "@/app/types/spec.type";

export interface ProductViewModel {
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

  publishDate: Date;
  publishType: string;

  is_enabled: boolean;

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
