import { Brand } from "@/features/types/brand.type";
import { Category } from "@/features/types/category.type";
import { ProductType } from "@/features/types/product-type.type";
import { ProductCurrency } from "@/features/types/product.type";

export interface ProductViewModel {
  id: string;
  category: Category;
  name: string;
  type?: ProductType;
  brand?: Brand;
  model?: string;

  images: string[];

  currency: ProductCurrency;
  price: number;

  isPinned: boolean;

  merchant: {
    id: string;
    fullName: string;
    whatsapp: string;
    instagram: string;
  };

  publishDate: Date;
}

export interface CatalogViewModel {
  total: number;
  items: ProductViewModel[];
}
