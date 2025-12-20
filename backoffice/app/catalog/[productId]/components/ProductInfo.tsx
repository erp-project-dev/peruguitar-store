/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Brand } from "@/infrastracture/domain/brand.entity";
import { Merchant } from "@/infrastracture/domain/merchant.entity";
import { ProductType } from "@/infrastracture/domain/product-type.entity";

import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";
import {
  PRODUCT_CONDITIONS,
  PRODUCT_SCORES,
  CURRENCIES,
  PRODUCT_PRICE_TYPES,
} from "@/app/common/data";
import { Field } from "@/app/components/Form/Field";
import Input from "@/app/components/Form/Input";
import Select from "@/app/components/Form/Select";
import Switch from "@/app/components/Form/Switch";

import { ProductCreate } from "../page";
import { InputJson } from "@/app/components/Form/InputJson/InputJson";

const storeClient = new StoreClient();

type Props = {
  form: any;
  onUpdate: (key: keyof ProductCreate, value: any) => void;
};

export default function ProductInfo({ form, onUpdate }: Props) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [brands, merchants, types] = await Promise.all([
          storeClient.execute<Brand[]>(StoreCommand.BrandFindAll),
          storeClient.execute<Merchant[]>(StoreCommand.MerchantFindAll),
          storeClient.execute<ProductType[]>(StoreCommand.ProductTypeFindAll),
        ]);

        setBrands(brands);
        setMerchants(merchants);
        setTypes(types);
      } catch (e: any) {
        const message =
          e instanceof Error ? e.message : "Error loading product data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-neutral-500">Loading product info…</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field label="Name">
        <Input
          value={form.name}
          onChange={(e: any) => onUpdate("name", e.target.value)}
        />
      </Field>

      <Field label="Type">
        <Select
          value={form.type_id}
          onChange={(e: any) => onUpdate("type_id", e.target.value)}
          options={types.map((t) => ({
            label: t.name,
            value: t._id,
          }))}
        />
      </Field>

      <Field label="Brand">
        <Select
          value={form.brand_id}
          onChange={(e: any) => onUpdate("brand_id", e.target.value)}
          options={brands.map((b) => ({
            label: b.name,
            value: b._id,
          }))}
        />
      </Field>

      <Field label="Model">
        <Input
          value={form.model}
          onChange={(e: any) => onUpdate("model", e.target.value)}
        />
      </Field>

      <Field label="Condition">
        <Select
          value={form.condition}
          onChange={(e: any) => onUpdate("condition", e.target.value)}
          options={PRODUCT_CONDITIONS.map((c) => ({
            label: c,
            value: c,
          }))}
        />
      </Field>

      <Field label="Score">
        <Select
          value={String(form.condition_score)}
          onChange={(e: any) => onUpdate("condition_score", e.target.value)}
          options={PRODUCT_SCORES.map((s) => ({
            label: `${s}/5`,
            value: String(s),
          }))}
        />
      </Field>

      <Field label="Currency">
        <Select
          value={form.currency}
          onChange={(e: any) => onUpdate("currency", e.target.value)}
          options={CURRENCIES.map((c) => ({
            label: c,
            value: c,
          }))}
        />
      </Field>

      <Field label="Price">
        <Input
          type="number"
          value={form.price}
          onChange={(e: any) => onUpdate("price", e.target.value)}
        />
      </Field>

      <Field label="Price type">
        <Select
          value={form.priceType}
          onChange={(e: any) => onUpdate("priceType", e.target.value)}
          options={PRODUCT_PRICE_TYPES.map((pt) => ({
            label: pt,
            value: pt,
          }))}
        />
      </Field>

      <Field label="Merchant">
        <Select
          value={form.merchant_id}
          onChange={(e: any) => onUpdate("merchant_id", e.target.value)}
          options={merchants.map((m) => ({
            label: m._id,
            value: m._id,
          }))}
          disabled
        />
      </Field>

      <Field label="Enabled">
        <Switch
          value={form.is_enabled}
          onChange={(v: any) => onUpdate("is_enabled", v)}
        />
      </Field>

      <Field label="Pinned">
        <Switch
          value={form.is_pinned}
          onChange={(v: any) => onUpdate("is_pinned", v)}
        />
      </Field>

      <Field label="Description" full>
        <Input
          type="textarea"
          rows={4}
          value={form.description}
          onChange={(e: any) => onUpdate("description", e.target.value)}
        />
      </Field>

      <Field label="Specs (JSON)" full>
        <InputJson
          className="font-mono text-xs"
          placeholder='{ "body_wood": "Mahogany" }'
          value={form.specs_raw}
          onChange={(value) => onUpdate("specs_raw", value)}
          rootLabel="Guitar Specs"
        />
      </Field>
    </div>
  );
}
