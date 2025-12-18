/* eslint-disable @typescript-eslint/no-explicit-any */
import { MerchantService } from "@/infrastracture/services/merchant.service";
import { StoreMetricsService } from "@/infrastracture/services/store-metrics.service";
import { BrandService } from "@/infrastracture/services/brand.service";
import { ProductTypeService } from "@/infrastracture/services/product-type.service";
import { SettingService } from "@/infrastracture/services/setting.service";

import { StoreCommand } from "./store.command";
import { ProductService } from "@/infrastracture/services/product.service";

type CommandHandler = (id?: string, payload?: any) => Promise<any>;

const productService = new ProductService();
const merchantService = new MerchantService();
const brandService = new BrandService();
const productTypeService = new ProductTypeService();
const settingService = new SettingService();
const storeMetricsService = new StoreMetricsService();

export const StoreCommandHandler: Record<StoreCommand, CommandHandler> = {
  // MERCHANT
  [StoreCommand.MerchantFindAll]: () => merchantService.findAll(),
  [StoreCommand.MerchantFindById]: (id) =>
    merchantService.findById(id as string),
  [StoreCommand.MerchantCreate]: (_id, payload) =>
    merchantService.create(payload),
  [StoreCommand.MerchantUpdate]: (id, payload) =>
    merchantService.update(id as string, payload),
  [StoreCommand.MerchantRemove]: (id) => merchantService.remove(id as string),

  // BRAND
  [StoreCommand.BrandFindAll]: () => brandService.findAll(),
  [StoreCommand.BrandFindById]: (id) => brandService.findById(id as string),
  [StoreCommand.BrandCreate]: (_id, payload) => brandService.create(payload),
  [StoreCommand.BrandUpdate]: (id, payload) =>
    brandService.update(id as string, payload),
  [StoreCommand.BrandRemove]: (id) => brandService.remove(id as string),

  // PRODUCT TYPE
  [StoreCommand.ProductTypeFindAll]: () => productTypeService.findAll(),
  [StoreCommand.ProductTypeFindById]: (id) =>
    productTypeService.findById(id as string),
  [StoreCommand.ProductTypeCreate]: (_id, payload) =>
    productTypeService.create(payload),
  [StoreCommand.ProductTypeUpdate]: (id, payload) =>
    productTypeService.update(id as string, payload),
  [StoreCommand.ProductTypeRemove]: (id) =>
    productTypeService.remove(id as string),

  // SETTING
  [StoreCommand.SettingFindAll]: () => settingService.findAll(),
  [StoreCommand.SettingFindById]: (id) => settingService.findById(id as string),
  [StoreCommand.SettingCreate]: (_id, payload) =>
    settingService.create(payload),
  [StoreCommand.SettingUpdate]: (id, payload) =>
    settingService.update(id as string, payload),
  [StoreCommand.SettingRemove]: (id) => settingService.remove(id as string),

  // PRODUCT
  [StoreCommand.CatalogFindAll]: () => productService.findAll(),
  [StoreCommand.CatalogFindById]: (id) => productService.findById(id as string),
  [StoreCommand.CatalogCreate]: (_id, payload) =>
    productService.create(payload),
  [StoreCommand.CatalogUpdate]: (id, payload) =>
    productService.update(id as string, payload),
  [StoreCommand.CatalogRemove]: (id) => productService.remove(id as string),

  // STORE METRICS
  [StoreCommand.StoreMetricsFind]: () => storeMetricsService.find(),
};
