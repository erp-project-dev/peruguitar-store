/* eslint-disable @typescript-eslint/no-explicit-any */
import { MerchantService } from "@/infrastracture/services/merchant.service";
import { StoreMetricsService } from "@/infrastracture/services/store-metrics.service";
import { BrandService } from "@/infrastracture/services/brand.service";
import { ProductTypeService } from "@/infrastracture/services/product-type.service";
import { SettingService } from "@/infrastracture/services/setting.service";

import { StoreCommand } from "./store.command";
import { ProductService } from "@/infrastracture/services/product.service";
import { ProductImageAttachService } from "@/infrastracture/services/product-image-attach.service";
import { ProductImageRemoveService } from "@/infrastracture/services/product-image-remove.service";
import { DataSyncService } from "@/infrastracture/services/data-sync.service";
import { ProductImageReorderService } from "@/infrastracture/services/product-image-reorder.service";

type CommandHandler = (id?: any, payload?: any) => Promise<any>;

const productService = new ProductService();
const productImageAttachService = new ProductImageAttachService();
const productImageRemoveService = new ProductImageRemoveService();
const productImageReorderService = new ProductImageReorderService();

const merchantService = new MerchantService();
const brandService = new BrandService();
const productTypeService = new ProductTypeService();
const settingService = new SettingService();
const storeMetricsService = new StoreMetricsService();

const dataSyncService = new DataSyncService();

export const StoreCommandHandler: Record<StoreCommand, CommandHandler> = {
  // MERCHANT
  [StoreCommand.MerchantFindAll]: () => merchantService.findAll(),
  [StoreCommand.MerchantFindById]: (id) => merchantService.findById(id),
  [StoreCommand.MerchantCreate]: (_id, payload) =>
    merchantService.create(payload),
  [StoreCommand.MerchantUpdate]: (id, payload) =>
    merchantService.update(id, payload),
  [StoreCommand.MerchantRemove]: (id) => merchantService.remove(id),

  // BRAND
  [StoreCommand.BrandFindAll]: () => brandService.findAll(),
  [StoreCommand.BrandFindById]: (id) => brandService.findById(id),
  [StoreCommand.BrandCreate]: (_id, payload) => brandService.create(payload),
  [StoreCommand.BrandUpdate]: (id, payload) => brandService.update(id, payload),
  [StoreCommand.BrandRemove]: (id) => brandService.remove(id),

  // PRODUCT TYPE
  [StoreCommand.ProductTypeFindAll]: () => productTypeService.findAll(),
  [StoreCommand.ProductTypeFindById]: (id) => productTypeService.findById(id),
  [StoreCommand.ProductTypeCreate]: (_id, payload) =>
    productTypeService.create(payload),
  [StoreCommand.ProductTypeUpdate]: (id, payload) =>
    productTypeService.update(id, payload),
  [StoreCommand.ProductTypeRemove]: (id) => productTypeService.remove(id),

  // SETTING
  [StoreCommand.SettingFindAll]: () => settingService.findAll(),
  [StoreCommand.SettingFindById]: (id) => settingService.findById(id),
  [StoreCommand.SettingCreate]: (_id, payload) =>
    settingService.create(payload),
  [StoreCommand.SettingUpdate]: (id, payload) =>
    settingService.update(id, payload),
  [StoreCommand.SettingRemove]: (id) => settingService.remove(id),

  // PRODUCT
  [StoreCommand.CatalogFindAll]: () => productService.findAll(),
  [StoreCommand.CatalogFindById]: (id) => productService.findById(id),
  [StoreCommand.CatalogCreate]: (_id, payload) =>
    productService.create(payload),
  [StoreCommand.CatalogUpdate]: (id, payload) =>
    productService.update(id, payload),
  [StoreCommand.CatalogRemove]: (id) => productService.remove(id),

  // PRODUCT > IMAGES
  [StoreCommand.CatalogAttachImages]: (id, files) =>
    productImageAttachService.attach(id, files),
  [StoreCommand.CatalogRemoveImage]: (id, image) =>
    productImageRemoveService.remove(id, image),
  [StoreCommand.CatalogReorderImages]: (id, images) =>
    productImageReorderService.handle(id, images),

  // STORE METRICS
  [StoreCommand.StoreMetricsFind]: () => storeMetricsService.find(),

  // DATA SYNC
  [StoreCommand.DatasyncHandle]: () => dataSyncService.handle(),
};
