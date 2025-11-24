import DATA from "@/app/data";

import { CatalogViewModel } from "./index.type";

export const CatalogHandler = (): CatalogViewModel => {
  const { Merchants, Catalog } = DATA;

  const items = Catalog.filter((p) => p.is_enabled).map((p) => {
    const merchant = Merchants.find((x) => x.id === p.merchant_id);

    if (!merchant) {
      throw new Error(
        `DATA ERROR: Merchant not found for product ${p.id} (merchant_id: ${p.merchant_id})`
      );
    }

    return {
      id: p.id,
      category: p.category,
      name: p.name,
      brand: p.brand,
      model: p.model,
      status: p.status,
      statusScore: p.status_score,
      description: p.description,
      specs: p.specs,

      pic_1: p.pic_1,
      pic_2: p.pic_2,
      pic_3: p.pic_3,
      pic_4: p.pic_4,
      pic_6: p.pic_6,

      price: p.price,

      publishDate: p.publish_date,
      publishType: p.publish_type,

      is_enabled: p.is_enabled,

      merchant: {
        id: merchant.id,
        fullName: `${merchant.name} ${merchant.last_name}`,
        whatsapp: merchant.whatsapp,
        instagram: merchant.instagram,
      },
    };
  });

  return {
    total: items.length,
    items,
  };
};
