import { ProductService } from "@/infrastracture/services/product.service";
import { ProductImageAttachService } from "@/infrastracture/services/product-image-attach.service";
import { ProductImageRemoveService } from "@/infrastracture/services/product-image-remove.service";
import { ProductImageReorderService } from "@/infrastracture/services/product-image-reorder.service";
import { DataSyncService } from "@/infrastracture/services/data-sync.service";
import { AuthService } from "@/infrastracture/services/auth.service";
import { MerchantService } from "@/infrastracture/services/merchant.service";
import { StoreMetricsService } from "@/infrastracture/services/store-metrics.service";
import { BrandService } from "@/infrastracture/services/brand.service";
import { ProductTypeService } from "@/infrastracture/services/product-type.service";
import { SettingService } from "@/infrastracture/services/setting.service";
import { UserService } from "@/infrastracture/services/user.service";
import { CategoryService } from "@/infrastracture/services/category.service";
import { CustomerService } from "@/infrastracture/services/customer.service";

export const authService = new AuthService();
export const userService = new UserService();

export const productService = new ProductService();
export const productImageAttachService = new ProductImageAttachService();
export const productImageRemoveService = new ProductImageRemoveService();
export const productImageReorderService = new ProductImageReorderService();

export const categoryService = new CategoryService();
export const merchantService = new MerchantService();
export const customerService = new CustomerService();
export const brandService = new BrandService();
export const productTypeService = new ProductTypeService();
export const settingService = new SettingService();

export const storeMetricsService = new StoreMetricsService();

export const dataSyncService = new DataSyncService();
