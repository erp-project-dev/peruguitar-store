import { Brand } from "@/features/types/brand.type";
import { Category } from "@/features/types/category.type";
import { Merchant } from "@/features/types/merchant.type";
import { ProductType } from "@/features/types/product-type.type";
import { Product } from "@/features/types/product.type";

export interface ProductViewModel extends Product {
  category: Category;
  type?: ProductType;
  brand?: Brand;

  merchant: Merchant;

  publishDate: Date;
  isSold: boolean;
}

export interface CatalogViewModel {
  total: number;
  items: ProductViewModel[];
}
