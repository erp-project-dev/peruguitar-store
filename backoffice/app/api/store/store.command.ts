export enum StoreCommand {
  // MERCHANT
  MerchantFindAll = "merchant.find_all",
  MerchantFindById = "merchant.find_by_id",
  MerchantCreate = "merchant.create",
  MerchantUpdate = "merchant.update",
  MerchantRemove = "merchant.remove",

  // CATALOG
  CatalogFindAll = "catalog.find_all",
  CatalogFindById = "catalog.find_by_id",
  CatalogCreate = "catalog.create",
  CatalogUpdate = "catalog.update",
  CatalogRemove = "catalog.remove",

  // CATALOG IMAGES
  CatalogSetImages = "catalog.set_images",

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

  // SETTING
  SettingFindAll = "setting.find_all",
  SettingFindById = "setting.find_by_id",
  SettingCreate = "setting.create",
  SettingUpdate = "setting.update",
  SettingRemove = "setting.remove",

  // STORE METRICS
  StoreMetricsFind = "store_metrics.find",
}
