/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { Brand } from "@/infrastracture/domain/brand.entity";
import { Merchant } from "@/infrastracture/domain/merchant.entity";
import { ProductType } from "@/infrastracture/domain/product-type.entity";

const storeClient = new StoreClient();

type Options = {
  categoryId?: string;
};

export function useCatalogData(options?: Options) {
  const categoryId = options?.categoryId;

  const [brands, setBrands] = useState<Brand[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [brands, merchants, types] = await Promise.all([
          storeClient.execute<Brand[]>(StoreCommand.BrandFindAll, {
            query: categoryId ? { categoryId } : undefined,
            options: { cacheTtlSeconds: 60 },
          }),
          storeClient.execute<Merchant[]>(StoreCommand.MerchantFindAll, {
            options: { cacheTtlSeconds: 60 },
          }),
          storeClient.execute<ProductType[]>(StoreCommand.ProductTypeFindAll, {
            options: { cacheTtlSeconds: 60 },
          }),
        ]);

        if (!mounted) return;

        setBrands(brands);
        setMerchants(merchants);
        setTypes(types);
      } catch {
        toast.error("Error loading catalog data");
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  return {
    brands,
    merchants,
    types,
  };
}
