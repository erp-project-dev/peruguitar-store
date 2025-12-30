/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Field } from "@/app/components/Form/Field";
import Input from "@/app/components/Form/Input";
import Select from "@/app/components/Form/Select";
import Switch from "@/app/components/Form/Switch";
import { InputJson } from "@/app/components/Form/InputJson/InputJson";

import {
  PRODUCT_CONDITIONS,
  PRODUCT_SCORES,
  CURRENCIES,
  PRODUCT_PRICE_TYPES,
} from "@/app/common/data";

import { Brand } from "@/infrastracture/domain/brand.entity";
import { Merchant } from "@/infrastracture/domain/merchant.entity";
import { ProductEntryForm } from "../shared/product.entry";
import { PRODUCT_STATUS } from "@/app/common/data/status.data";

type Props = {
  mode: "insert" | "edit";
  form: ProductEntryForm;
  brands: Brand[];
  merchants: Merchant[];

  onUpdate: (key: keyof ProductEntryForm, value: any) => void;
};

export default function ProductPedalboardDigitalForm({
  mode,
  form,
  brands,
  merchants,
  onUpdate,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field label="Name">
        <Input
          value={form.name}
          onChange={(value) => onUpdate("name", value)}
        />
      </Field>

      <Field label="Brand">
        <Select
          value={form.brand_id}
          onChange={(value) => onUpdate("brand_id", value)}
          options={brands.map((b) => ({
            label: b.name,
            value: b._id,
          }))}
        />
      </Field>

      <Field label="Model">
        <Input
          value={form.model ?? ""}
          onChange={(value) => onUpdate("model", value)}
        />
      </Field>

      <Field label="Condition">
        <Select
          value={form.condition}
          onChange={(value) => onUpdate("condition", value)}
          options={PRODUCT_CONDITIONS.map((c) => ({
            label: c,
            value: c,
          }))}
        />
      </Field>

      <Field label="Score">
        <Select
          value={String(form.condition_score)}
          onChange={(value) => onUpdate("condition_score", Number(value))}
          options={PRODUCT_SCORES.map((s) => ({
            label: `${s}/5`,
            value: String(s),
          }))}
        />
      </Field>

      <Field label="Currency">
        <Select
          value={form.currency}
          onChange={(value) => onUpdate("currency", value)}
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
          onChange={(value) => onUpdate("price", Number(value))}
        />
      </Field>

      <Field label="Price type">
        <Select
          value={form.price_type}
          onChange={(value) => onUpdate("price_type", value)}
          options={PRODUCT_PRICE_TYPES.map((pt) => ({
            label: pt,
            value: pt,
          }))}
        />
      </Field>

      <Field label="Merchant" full>
        <Select
          value={form.merchant_id}
          onChange={(value) => onUpdate("merchant_id", value)}
          options={merchants.map((m) => ({
            label: m._id,
            value: m._id,
          }))}
          disabled={mode === "edit"}
        />
      </Field>

      {mode === "edit" && (
        <>
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(value) => onUpdate("status", value)}
              options={PRODUCT_STATUS.map(({ value, label }) => ({
                label,
                value,
              }))}
            />
          </Field>

          <Field label="Pinned">
            <Switch
              value={form.is_pinned}
              onChange={(v) => onUpdate("is_pinned", v)}
            />
          </Field>
        </>
      )}

      <Field label="Description" full>
        <Input
          type="textarea"
          rows={4}
          value={form.description}
          onChange={(value) => onUpdate("description", value)}
        />
      </Field>

      <Field label="Specs" full>
        <InputJson
          className="font-mono text-xs"
          value={form.specs_raw}
          onChange={(v) => onUpdate("specs_raw", v)}
          rootLabel="Specs"
        />
      </Field>
    </div>
  );
}
