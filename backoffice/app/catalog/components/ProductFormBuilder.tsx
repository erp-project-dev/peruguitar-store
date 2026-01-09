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
import { PRODUCT_STATUS } from "@/app/common/data/product-status.data";

import { Brand } from "@/infrastracture/domain/brand.entity";
import { Merchant } from "@/infrastracture/domain/merchant.entity";
import { ProductType } from "@/infrastracture/domain/product-type.entity";
import { ProductEntryForm } from "../shared/product.entry";
import { Fragment } from "react/jsx-runtime";
import { InputMarkdown } from "@/app/components/Form/InputMarkdown/InputMarkdown";

type FieldKey =
  | "name"
  | "type"
  | "brand"
  | "model"
  | "condition"
  | "score"
  | "currency"
  | "price"
  | "price_type"
  | "merchant"
  | "status"
  | "pinned"
  | "description"
  | "full_description"
  | "specs"
  | "external_video_url";

type LayoutItem = FieldKey | `${FieldKey}:full`;

type Props = {
  mode: "insert" | "edit";
  form: ProductEntryForm;
  merchants: Merchant[];
  brands?: Brand[];
  types?: ProductType[];
  layout: LayoutItem[];
  onUpdate: (key: keyof ProductEntryForm, value: any) => void;
};

export default function ProductFormBuilder({
  mode,
  form,
  merchants,
  brands,
  types,
  layout,
  onUpdate,
}: Props) {
  const renderField = (key: FieldKey, full: boolean) => {
    switch (key) {
      case "name":
        return (
          <Field label="Name" full={full}>
            <Input value={form.name} onChange={(v) => onUpdate("name", v)} />
          </Field>
        );

      case "type":
        if (!types) return null;
        return (
          <Field label="Type" full={full}>
            <Select
              value={form.type_id}
              onChange={(v) => onUpdate("type_id", v)}
              options={types.map((t) => ({
                label: t.name,
                value: t._id,
              }))}
            />
          </Field>
        );

      case "brand":
        if (!brands) return null;
        return (
          <Field label="Brand" full={full}>
            <Select
              value={form.brand_id}
              onChange={(v) => onUpdate("brand_id", v)}
              options={brands.map((b) => ({
                label: b.name,
                value: b._id,
              }))}
            />
          </Field>
        );

      case "model":
        return (
          <Field label="Model" full={full}>
            <Input
              value={form.model ?? ""}
              onChange={(v) => onUpdate("model", v)}
            />
          </Field>
        );

      case "condition":
        return (
          <Field label="Condition" full={full}>
            <Select
              value={form.condition}
              onChange={(v) => onUpdate("condition", v)}
              options={PRODUCT_CONDITIONS.map((c) => ({
                label: c,
                value: c,
              }))}
            />
          </Field>
        );

      case "score":
        return (
          <Field label="Score" full={full}>
            <Select
              value={String(form.condition_score)}
              onChange={(v) => onUpdate("condition_score", Number(v))}
              options={PRODUCT_SCORES.map((s) => ({
                label: `${s}/5`,
                value: String(s),
              }))}
            />
          </Field>
        );

      case "currency":
        return (
          <Field label="Currency" full={full}>
            <Select
              value={form.currency}
              onChange={(v) => onUpdate("currency", v)}
              options={CURRENCIES.map((c) => ({
                label: c,
                value: c,
              }))}
            />
          </Field>
        );

      case "price":
        return (
          <Field label="Price" full={full}>
            <Input
              type="number"
              value={form.price}
              onChange={(v) => onUpdate("price", Number(v))}
            />
          </Field>
        );

      case "price_type":
        return (
          <Field label="Price type" full={full}>
            <Select
              value={form.price_type}
              onChange={(v) => onUpdate("price_type", v)}
              options={PRODUCT_PRICE_TYPES.map((pt) => ({
                label: pt,
                value: pt,
              }))}
            />
          </Field>
        );

      case "merchant":
        return (
          <Field label="Merchant" full={full}>
            <Select
              value={form.merchant_id}
              onChange={(v) => onUpdate("merchant_id", v)}
              options={merchants.map((m) => ({
                label: m._id,
                value: m._id,
              }))}
              disabled={mode === "edit"}
            />
          </Field>
        );

      case "status":
        if (mode !== "edit") return null;
        return (
          <Field label="Status" full={full}>
            <Select
              value={form.status}
              onChange={(v) => onUpdate("status", v)}
              options={PRODUCT_STATUS.map(({ label, value }) => ({
                label,
                value,
              }))}
            />
          </Field>
        );

      case "pinned":
        if (mode !== "edit") return null;
        return (
          <Field label="Pinned" full={full}>
            <Switch
              value={form.is_pinned}
              onChange={(v) => onUpdate("is_pinned", v)}
            />
          </Field>
        );

      case "description":
        return (
          <Field label="Description" full={full}>
            <Input
              type="textarea"
              rows={4}
              value={form.description}
              onChange={(v) => onUpdate("description", v)}
            />
          </Field>
        );

      case "full_description":
        return (
          <Field label="Full Description" full={full}>
            <InputMarkdown
              value={form.full_description}
              onChange={(v) => onUpdate("full_description", v)}
              placeholder="Insert here full decription and also you can use markdown format"
            />
          </Field>
        );

      case "specs":
        return (
          <Field label="Specs" full={full}>
            <InputJson
              className="font-mono text-xs"
              value={form.specs_raw}
              onChange={(v) => onUpdate("specs_raw", v)}
              rootLabel="Specs"
            />
          </Field>
        );

      case "external_video_url":
        return (
          <Field label="External video URL" full={full}>
            <Input
              placeholder="https://youtube.com/..."
              value={form.external_video_url}
              onChange={(v) => onUpdate("external_video_url", v)}
            />
          </Field>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {layout.map((item) => {
        const [key, modifier] = item.split(":");

        return (
          <Fragment key={item}>
            {renderField(key as FieldKey, modifier === "full")}
          </Fragment>
        );
      })}
    </div>
  );
}
