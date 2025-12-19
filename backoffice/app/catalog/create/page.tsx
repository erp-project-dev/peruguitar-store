/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PageSection from "@/app/components/PageSection";
import Button from "@/app/components/Form/Button";

import { Save, Undo } from "lucide-react";

import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { Brand } from "@/infrastracture/domain/brand.entity";
import { ProductType } from "@/infrastracture/domain/product-type.entity";
import { Merchant } from "@/infrastracture/domain/merchant.entity";
import { Product } from "@/infrastracture/domain/product.entity";

import {
  CURRENCIES,
  PRODUCT_PRICE_TYPES,
  PRODUCT_CONDITIONS,
  PRODUCT_SCORES,
} from "@/app/common/data";

import ProductCreateInfo from "./components/ProductCreateInfo";
import ProductPromptHelp from "./components/ProductPromptHelp";

const storeClient = new StoreClient();

const emptyForm = {
  brand_id: "",
  merchant_id: "",
  type_id: "",
  condition: PRODUCT_CONDITIONS[0],
  condition_score: PRODUCT_SCORES[4],
  name: "",
  model: "",
  description: "",
  currency: CURRENCIES[1],
  price: 0,
  priceType: PRODUCT_PRICE_TYPES[0],
  specs_raw: "",
};

export default function CreateProductPage() {
  const [form, setForm] = useState(emptyForm);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [brandsData, typesData, merchantsData] = await Promise.all([
          storeClient.execute<Brand[]>(StoreCommand.BrandFindAll),
          storeClient.execute<ProductType[]>(StoreCommand.ProductTypeFindAll),
          storeClient.execute<Merchant[]>(StoreCommand.MerchantFindAll),
        ]);

        setBrands(brandsData);
        setTypes(typesData);
        setMerchants(merchantsData);
      } catch {
        toast.error("Error loading form data");
      }
    };

    fetchMeta();
  }, []);

  const update = (key: keyof typeof emptyForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const specs = form.specs_raw ? JSON.parse(form.specs_raw) : {};

      const payload = {
        brand_id: form.brand_id,
        merchant_id: form.merchant_id,
        type_id: form.type_id,
        condition: form.condition,
        condition_score: form.condition_score,
        name: form.name,
        model: form.model,
        description: form.description,
        currency: form.currency,
        price: form.price,
        priceType: form.priceType,
        specs,
      };

      const created = await storeClient.execute<Product>(
        StoreCommand.CatalogCreate,
        payload
      );

      toast.success("Product created");
      router.push(`/catalog/${created._id}`);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Error creating new product";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageSection
      title="Create product"
      description="Add a new product to the catalog"
      loading={loading}
      actions={
        <>
          <Button
            size="lg"
            icon={Undo}
            onClick={() => router.push("/catalog")}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="success"
            size="lg"
            icon={Save}
            onClick={handleSubmit}
            disabled={loading}
          >
            Create product
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProductCreateInfo
            form={form}
            onUpdate={update}
            types={types.map((t) => ({ label: t.name, value: t._id }))}
            brands={brands.map((b) => ({ label: b.name, value: b._id }))}
            merchants={merchants.map((m) => ({
              label: m._id,
              value: m._id,
            }))}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ProductPromptHelp
            brands={brands.map((b) => ({ label: b.name, value: b._id }))}
            types={types.map((t) => ({
              label: t.name,
              value: t._id,
              description: t.description,
            }))}
          />
        </div>
      </div>
    </PageSection>
  );
}
