import DATA from "@/app/store";

import { ProductPageViewModel } from "./index.type";

export class ProductGetCommand {
  static handle(id: string): ProductPageViewModel {
    const { Merchants, Catalog, Brands, Types, Categories } = DATA;

    const p = Catalog.find((item) => item.id === id);

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

    const brand = Brands.find((b) => b.id === p.brand_id);
    const type = Types.find((tp) => tp.id === p.type_id);

    const category = Categories.find((m) => m.id === p.category_id);
    if (!category) {
      throw new Error(
        `DATA ERROR: Category not found for product ${p.id} (category_id: ${p.category_id})`
      );
    }

    return {
      id: p.id,
      category,
      name: p.name,
      type,
      brand,
      model: p.model,
      condition: p.condition,
      conditionScore: p.condition_score,
      description: p.description,
      fullDescription: p.fullDescription,
      specs: p.specs,

      images: p.images,
      card_pic: p.card_pic,

      currency: p.currency,
      price: p.price,
      priceType: p.priceType,

      publishDate: new Date(p.publish_date),

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
