/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PRODUCT_CONDITIONS,
  PRODUCT_SCORES,
  CURRENCIES,
  PRODUCT_PRICE_TYPES,
} from "@/app/common/data";

import { Field } from "@/app/components/Form/Field";
import Input from "@/app/components/Form/Input";
import Select from "@/app/components/Form/Select";
import { InputJson } from "@/app/components/Form/InputJson/InputJson";

type Option = {
  label: string;
  value: string;
};

type ProductCreateInfoProps = {
  form: {
    name: string;
    type_id: string;
    brand_id: string;
    model: string;
    condition: string;
    condition_score: number;
    currency: string;
    price: number;
    priceType: string;
    merchant_id: string;
    description: string;
    specs_raw: string;
  };

  onUpdate: (key: keyof ProductCreateInfoProps["form"], value: any) => void;

  types: Option[];
  brands: Option[];
  merchants: Option[];
};

export default function ProductCreateInfo({
  form,
  onUpdate,
  types,
  brands,
  merchants,
}: ProductCreateInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field label="Name">
        <Input
          value={form.name}
          onChange={(value) => onUpdate("name", value)}
        />
      </Field>

      <Field label="Type">
        <Select
          value={form.type_id}
          placeholder="Select type"
          onChange={(value) => onUpdate("type_id", value)}
          options={types}
        />
      </Field>

      <Field label="Brand">
        <Select
          value={form.brand_id}
          placeholder="Select brand"
          onChange={(value) => onUpdate("brand_id", value)}
          options={brands}
        />
      </Field>

      <Field label="Model">
        <Input
          value={form.model}
          onChange={(value) => onUpdate("model", value)}
        />
      </Field>

      <Field label="Condition">
        <Select
          value={form.condition}
          placeholder="Select condition"
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
          placeholder="Select score"
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
          placeholder="Select currency"
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
          value={form.priceType}
          placeholder="Select price type"
          onChange={(value) => onUpdate("priceType", value)}
          options={PRODUCT_PRICE_TYPES.map((pt) => ({
            label: pt,
            value: pt,
          }))}
        />
      </Field>

      <Field label="Merchant">
        <Select
          value={form.merchant_id}
          placeholder="Select merchant"
          onChange={(value) => onUpdate("merchant_id", value)}
          options={merchants}
        />
      </Field>

      <Field label="Description" full>
        <Input
          type="textarea"
          rows={4}
          value={form.description}
          onChange={(value) => onUpdate("description", value)}
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
