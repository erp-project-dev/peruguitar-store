import { CategoryId } from "@/infrastracture/domain/category.entity";
import { SignInHook } from "./hooks/sign-in.hook";
import { SignOutHook } from "./hooks/sign-out.hook";
import { StoreCommand } from "./store.command";

import {
  authService,
  userService,
  merchantService,
  brandService,
  productTypeService,
  settingService,
  productService,
  productImageAttachService,
  productImageRemoveService,
  productImageReorderService,
  storeMetricsService,
  dataSyncService,
  categoryService,
} from "./store.services";

import { CommandHandler } from "./store.type";

export const StoreCommandHandler: Record<StoreCommand, CommandHandler> = {
  // AUTH
  [StoreCommand.AuthSignIn]: {
    next: (_q, { email, password }) =>
      authService.authenticate(email, password),
    hooks: [{ hook: new SignInHook(), type: "next" }],
  },
  [StoreCommand.AuthSignOut]: {
    hooks: [{ hook: new SignOutHook(), type: "next" }],
  },

  // USER
  [StoreCommand.UserFindMe]: {
    next: () => userService.me(),
  },

  // CATEGORY
  [StoreCommand.CategoryFindAll]: {
    next: () => categoryService.findAll(),
  },
  [StoreCommand.CategoryFindById]: {
    next: (_q, _p, id) => categoryService.findById(id as CategoryId),
  },
  [StoreCommand.CategoryCreate]: {
    next: (_q, payload) => categoryService.create(payload),
  },
  [StoreCommand.CategoryUpdate]: {
    next: (_q, payload, id) =>
      categoryService.update(id as CategoryId, payload),
  },
  [StoreCommand.CategoryRemove]: {
    next: (_q, _p, id) => categoryService.remove(id as CategoryId),
  },

  // MERCHANT
  [StoreCommand.MerchantFindAll]: {
    next: () => merchantService.findAll(),
  },
  [StoreCommand.MerchantFindById]: {
    next: (_q, _p, id) => merchantService.findById(id!),
  },
  [StoreCommand.MerchantCreate]: {
    next: (_q, payload) => merchantService.create(payload),
  },
  [StoreCommand.MerchantUpdate]: {
    next: (_q, payload, id) => merchantService.update(id!, payload),
  },
  [StoreCommand.MerchantRemove]: {
    next: (_q, _p, id) => merchantService.remove(id!),
  },

  // BRAND
  [StoreCommand.BrandFindAll]: {
    next: (q) => brandService.findAll(q?.categoryId),
  },
  [StoreCommand.BrandFindById]: {
    next: (_q, _p, id) => brandService.findById(id!),
  },
  [StoreCommand.BrandCreate]: {
    next: (_q, payload) => brandService.create(payload),
  },
  [StoreCommand.BrandUpdate]: {
    next: (_q, payload, id) => brandService.update(id!, payload),
  },
  [StoreCommand.BrandRemove]: {
    next: (_q, _p, id) => brandService.remove(id!),
  },

  // PRODUCT TYPE
  [StoreCommand.ProductTypeFindAll]: {
    next: () => productTypeService.findAll(),
  },
  [StoreCommand.ProductTypeFindById]: {
    next: (_q, _p, id) => productTypeService.findById(id!),
  },
  [StoreCommand.ProductTypeCreate]: {
    next: (_q, payload) => productTypeService.create(payload),
  },
  [StoreCommand.ProductTypeUpdate]: {
    next: (_q, payload, id) => productTypeService.update(id!, payload),
  },
  [StoreCommand.ProductTypeRemove]: {
    next: (_q, _p, id) => productTypeService.remove(id!),
  },

  // SETTING
  [StoreCommand.SettingFindAll]: {
    next: () => settingService.findAll(),
  },
  [StoreCommand.SettingFindById]: {
    next: (_q, _p, id) => settingService.findById(id!),
  },
  [StoreCommand.SettingCreate]: {
    next: (_q, payload) => settingService.create(payload),
  },
  [StoreCommand.SettingUpdate]: {
    next: (_q, payload, id) => settingService.update(id!, payload),
  },
  [StoreCommand.SettingRemove]: {
    next: (_q, _p, id) => settingService.remove(id!),
  },

  // PRODUCT
  [StoreCommand.CatalogFindAll]: {
    next: () => productService.findAll(),
  },
  [StoreCommand.CatalogFindById]: {
    next: (_q, _p, id) => productService.findById(id!),
  },
  [StoreCommand.CatalogCreate]: {
    next: (_q, payload) => productService.create(payload),
  },
  [StoreCommand.CatalogUpdate]: {
    next: (_q, payload, id) => productService.update(id!, payload),
  },
  [StoreCommand.CatalogRemove]: {
    next: (_q, _p, id) => productService.remove(id!),
  },

  // PRODUCT > IMAGES
  [StoreCommand.CatalogAttachImages]: {
    next: (_q, payload, id) => productImageAttachService.attach(id!, payload),
  },
  [StoreCommand.CatalogRemoveImage]: {
    next: (_q, payload, id) => productImageRemoveService.remove(id!, payload),
  },
  [StoreCommand.CatalogReorderImages]: {
    next: (_q, payload, id) => productImageReorderService.handle(id!, payload),
  },

  // STORE METRICS
  [StoreCommand.StoreMetricsFind]: {
    next: () => storeMetricsService.find(),
  },

  // DATA SYNC
  [StoreCommand.DatasyncHandle]: {
    next: () => dataSyncService.handle(),
  },
};
