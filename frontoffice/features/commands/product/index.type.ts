import { Brand } from "@/features/types/brand.type";
import { Category } from "@/features/types/category.type";
import { ProductType } from "@/features/types/product-type.type";
import { Product } from "@/features/types/product.type";

export interface ProductPageViewModel extends Product {
  category: Category;
  type?: ProductType;
  brand?: Brand;

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

  isSold: boolean;
}
