import DATA from "@/app/data";

import { ProductPageViewModel } from "./index.type";

export class ProductGetCommand {
  static handle(id: string): ProductPageViewModel {
    const { Merchants, Catalog, Brands } = DATA;

    const p = Catalog.find(
      (item) => item.id === id && item.is_enabled === true
    );

    if (!p) {
      throw new Error(
        `PRODUCT NOT FOUND: ID '${id}' no existe o está deshabilitado`
      );
    }

    const merchant = Merchants.find((m) => m.id === p.merchant_id);

    if (!merchant) {
      throw new Error(
        `DATA ERROR: Merchant not found for product ${p.id} (merchant_id: ${p.merchant_id})`
      );
    }

    const brand = Brands.find((b) => b.id === p.brand);

    if (!brand) {
      throw new Error(
        `DATA ERROR: Brand not found for product ${p.id} (brand: ${p.brand})`
      );
    }

    return {
      id: p.id,
      category: p.category,
      name: p.name,
      brand,
      model: p.model,
      status: p.status,
      statusScore: p.status_score,
      description: p.description,
      specs: p.specs,

      pic_1: p.pic_1,
      pic_2: p.pic_2,
      pic_3: p.pic_3,
      pic_4: p.pic_4,
      pic_5: p.pic_5,
      pic_6: p.pic_6,
      card_pic: p.card_pic,

      currency: p.currency,
      price: p.price,
      priceType: p.priceType,

      publishDate: new Date(p.publish_date),
      publishType: p.publish_type,

      is_enabled: p.is_enabled,

      merchant: {
        id: merchant.id,
        firstName: merchant.name,
        lastName: merchant.last_name,
        fullName: `${merchant.name} ${merchant.last_name}`,
        country: merchant.country,
        state: merchant.state,
        city: merchant.city,
        whatsapp: merchant.whatsapp,
        instagram: merchant.instagram,
      },
    };
  }
}
