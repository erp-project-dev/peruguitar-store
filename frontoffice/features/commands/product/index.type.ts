import { Brand } from "@/features/types/brand.type";
import { Category } from "@/features/types/category.type";
import { ProductType } from "@/features/types/product-type.type";
import { PriceType, ProductCurrency } from "@/features/types/product.type";

export interface ProductPageViewModel {
  id: string;
  category: Category;
  name: string;
  type?: ProductType;
  brand?: Brand;
  model?: string;
  condition: string;
  conditionScore: number;
  description: string;
  fullDescription: string;
  specs: Record<string, string>;

  images: string[];
  card_pic: string;

  currency: ProductCurrency;
  price: number;
  priceType: PriceType;

  publishDate: Date;

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
