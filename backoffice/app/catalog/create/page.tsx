/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PageSection from "@/app/components/PageSection";
import Button from "@/app/components/Form/Button";
import Input from "@/app/components/Form/Input";
import Select from "@/app/components/Form/Select";
import { Field } from "@/app/components/Form/Field";
import Switch from "@/app/components/Form/Switch";

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
  is_enabled: true,
  is_pinned: false,
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
        is_enabled: form.is_enabled,
        is_pinned: form.is_pinned,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Name">
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Field>

        <Field label="Type">
          <Select
            value={form.type_id}
            placeholder="Select type"
            onChange={(e) => update("type_id", e.target.value)}
            options={types.map((t) => ({ label: t.name, value: t._id }))}
          />
        </Field>

        <Field label="Brand">
          <Select
            value={form.brand_id}
            placeholder="Select brand"
            onChange={(e) => update("brand_id", e.target.value)}
            options={brands.map((b) => ({ label: b.name, value: b._id }))}
          />
        </Field>

        <Field label="Model">
          <Input
            value={form.model}
            onChange={(e) => update("model", e.target.value)}
          />
        </Field>

        <Field label="Condition">
          <Select
            placeholder="Select condition"
            value={form.condition}
            onChange={(e) => update("condition", e.target.value)}
            options={PRODUCT_CONDITIONS.map((c) => ({ label: c, value: c }))}
          />
        </Field>

        <Field label="Score">
          <Select
            placeholder="Select score"
            value={String(form.condition_score)}
            onChange={(e) => update("condition_score", Number(e.target.value))}
            options={PRODUCT_SCORES.map((s) => ({
              label: `${s}/5`,
              value: String(s),
            }))}
          />
        </Field>

        <Field label="Currency">
          <Select
            placeholder="Select currency"
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
            options={CURRENCIES.map((c) => ({ label: c, value: c }))}
          />
        </Field>

        <Field label="Price">
          <Input
            type="number"
            value={form.price}
            onChange={(e) => update("price", Number(e.target.value))}
          />
        </Field>

        <Field label="Price type">
          <Select
            placeholder="Select price type"
            value={form.priceType}
            onChange={(e) => update("priceType", e.target.value)}
            options={PRODUCT_PRICE_TYPES.map((pt) => ({
              label: pt,
              value: pt,
            }))}
          />
        </Field>

        <Field label="Merchant">
          <Select
            placeholder="Select merchants"
            value={form.merchant_id}
            onChange={(e) => update("merchant_id", e.target.value)}
            options={merchants.map((m) => ({ label: m._id, value: m._id }))}
          />
        </Field>

        <Field label="Enabled">
          <Switch
            value={form.is_enabled}
            onChange={(v) => update("is_enabled", v)}
          />
        </Field>

        <Field label="Pinned">
          <Switch
            value={form.is_pinned}
            onChange={(v) => update("is_pinned", v)}
          />
        </Field>

        <Field label="Description" full>
          <Input
            type="textarea"
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>

        <Field label="Specs (JSON)" full>
          <Input
            type="textarea"
            rows={8}
            className="font-mono text-xs"
            placeholder='{ "body_wood": "Mahogany" }'
            value={form.specs_raw}
            onChange={(e) => update("specs_raw", e.target.value)}
          />
        </Field>
      </div>
    </PageSection>
  );
}
