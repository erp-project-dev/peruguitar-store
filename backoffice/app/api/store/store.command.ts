/* eslint-disable @typescript-eslint/no-explicit-any */

export enum StoreCommand {
  // AUTH
  AuthSignIn = "auth.sign_in",
  AuthSignOut = "auth.sign_out",

  // User
  UserFindMe = "user.find_me",

  // MERCHANT
  MerchantFindAll = "merchant.find_all",
  MerchantFindById = "merchant.find_by_id",
  MerchantCreate = "merchant.create",
  MerchantUpdate = "merchant.update",
  MerchantRemove = "merchant.remove",

  // Customer
  CustomerFindAll = "customer.find_all",
  CustomerFindById = "customer.find_by_id",
  CustomerCreate = "customer.create",
  CustomerUpdate = "customer.update",
  CustomerRemove = "customer.remove",

  // Categories
  CategoryFindAll = "category.find_all",
  CategoryFindById = "category.find_by_id",
  CategoryCreate = "category.create",
  CategoryUpdate = "category.update",
  CategoryRemove = "category.remove",

  // CATALOG
  CatalogFindAll = "catalog.find_all",
  CatalogFindById = "catalog.find_by_id",
  CatalogCreate = "catalog.create",
  CatalogUpdate = "catalog.update",
  CatalogRemove = "catalog.remove",

  // CATALOG IMAGES
  CatalogAttachImages = "catalog.attach_images",
  CatalogRemoveImage = "catalog.remove_image",
  CatalogReorderImages = "catalog.reorder_images",

  // BRAND
  BrandFindAll = "brand.find_all",
  BrandFindById = "brand.find_by_id",
  BrandCreate = "brand.create",
  BrandUpdate = "brand.update",
  BrandRemove = "brand.remove",

  // PRODUCT TYPE
  ProductTypeFindAll = "product_type.find_all",
  ProductTypeFindById = "product_type.find_by_id",
  ProductTypeCreate = "product_type.create",
  ProductTypeUpdate = "product_type.update",
  ProductTypeRemove = "product_type.remove",

  // ORDERS
  OrderFindAll = "order.find_all",
  OrderFindById = "order.find_by_id",
  OrderCreate = "order.create",
  OrderUpdate = "order.update",
  OrderRemove = "order.remove",

  // REVIEWS
  ReviewFindAll = "review.find_all",
  ReviewFindById = "review.find_by_id",
  ReviewCreate = "review.create",
  ReviewUpdate = "review.update",
  ReviewRemove = "review.remove",

  // PRODUCT REVIEWS
  ProductReviewFindProductsWithoutReview = "product_review.find_products_without_review",

  // SETTING
  SettingFindAll = "setting.find_all",
  SettingFindById = "setting.find_by_id",
  SettingCreate = "setting.create",
  SettingUpdate = "setting.update",
  SettingRemove = "setting.remove",

  // STORE METRICS
  StoreMetricsFind = "store_metrics.find",

  // SYNC DATA
  DatasyncHandle = "data_sync.handle",
}
