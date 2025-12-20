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
} from "./store.services";
import { CommandHandler } from "./store.type";

export const StoreCommandHandler: Record<StoreCommand, CommandHandler> = {
  // AUTH
  [StoreCommand.AuthSignIn]: {
    next: ({ email, password }) => authService.authenticate(email, password),
    hooks: [{ hook: new SignInHook(), type: "next" }],
  },
  [StoreCommand.AuthSignOut]: {
    hooks: [{ hook: new SignOutHook(), type: "next" }],
  },

  // USER
  [StoreCommand.UserFindMe]: {
    next: () => userService.me(),
  },

  // MERCHANT
  [StoreCommand.MerchantFindAll]: {
    next: () => merchantService.findAll(),
  },
  [StoreCommand.MerchantFindById]: {
    next: (_p, id) => merchantService.findById(id!),
  },
  [StoreCommand.MerchantCreate]: {
    next: (payload) => merchantService.create(payload),
  },
  [StoreCommand.MerchantUpdate]: {
    next: (payload, id) => merchantService.update(id!, payload),
  },
  [StoreCommand.MerchantRemove]: {
    next: (_p, id) => merchantService.remove(id!),
  },

  // BRAND
  [StoreCommand.BrandFindAll]: {
    next: () => brandService.findAll(),
  },
  [StoreCommand.BrandFindById]: {
    next: (_p, id) => brandService.findById(id!),
  },
  [StoreCommand.BrandCreate]: {
    next: (payload) => brandService.create(payload),
  },
  [StoreCommand.BrandUpdate]: {
    next: (payload, id) => brandService.update(id!, payload),
  },
  [StoreCommand.BrandRemove]: {
    next: (_p, id) => brandService.remove(id!),
  },

  // PRODUCT TYPE
  [StoreCommand.ProductTypeFindAll]: {
    next: () => productTypeService.findAll(),
  },
  [StoreCommand.ProductTypeFindById]: {
    next: (_p, id) => productTypeService.findById(id!),
  },
  [StoreCommand.ProductTypeCreate]: {
    next: (payload) => productTypeService.create(payload),
  },
  [StoreCommand.ProductTypeUpdate]: {
    next: (payload, id) => productTypeService.update(id!, payload),
  },
  [StoreCommand.ProductTypeRemove]: {
    next: (_p, id) => productTypeService.remove(id!),
  },

  // SETTING
  [StoreCommand.SettingFindAll]: {
    next: () => settingService.findAll(),
  },
  [StoreCommand.SettingFindById]: {
    next: (_p, id) => settingService.findById(id!),
  },
  [StoreCommand.SettingCreate]: {
    next: (payload) => settingService.create(payload),
  },
  [StoreCommand.SettingUpdate]: {
    next: (payload, id) => settingService.update(id!, payload),
  },
  [StoreCommand.SettingRemove]: {
    next: (_p, id) => settingService.remove(id!),
  },

  // PRODUCT
  [StoreCommand.CatalogFindAll]: {
    next: () => productService.findAll(),
  },
  [StoreCommand.CatalogFindById]: {
    next: (_p, id) => productService.findById(id!),
  },
  [StoreCommand.CatalogCreate]: {
    next: (payload) => productService.create(payload),
  },
  [StoreCommand.CatalogUpdate]: {
    next: (payload, id) => productService.update(id!, payload),
  },
  [StoreCommand.CatalogRemove]: {
    next: (_p, id) => productService.remove(id!),
  },

  // PRODUCT > IMAGES
  [StoreCommand.CatalogAttachImages]: {
    next: (payload, id) => productImageAttachService.attach(id!, payload),
  },
  [StoreCommand.CatalogRemoveImage]: {
    next: (payload, id) => productImageRemoveService.remove(id!, payload),
  },
  [StoreCommand.CatalogReorderImages]: {
    next: (payload, id) => productImageReorderService.handle(id!, payload),
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
