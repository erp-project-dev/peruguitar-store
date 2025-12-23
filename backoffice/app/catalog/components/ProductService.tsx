/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Field } from "@/app/components/Form/Field";
import Input from "@/app/components/Form/Input";
import Select from "@/app/components/Form/Select";
import Switch from "@/app/components/Form/Switch";
import { InputMarkdown } from "@/app/components/Form/InputMarkdown/InputMarkdown";

import { Merchant } from "@/infrastracture/domain/merchant.entity";

import { ProductEntryForm } from "../shared/product.entry";

type Props = {
  mode: "insert" | "edit";
  form: ProductEntryForm;
  merchants: Merchant[];

  onUpdate: (key: keyof ProductEntryForm, value: any) => void;
};

export default function ProductServiceForm({
  mode,
  form,
  merchants,
  onUpdate,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* NAME */}
      <Field label="Service name">
        <Input
          value={form.name}
          onChange={(value) => onUpdate("name", value)}
        />
      </Field>

      {/* MERCHANT */}
      <Field label="Merchant">
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

      {/* ENABLED / PINNED */}
      {mode === "edit" && (
        <>
          <Field label="Enabled">
            <Switch
              value={form.is_enabled}
              onChange={(v) => onUpdate("is_enabled", v)}
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

      {/* DESCRIPTION */}
      <Field label="Description" full>
        <Input
          type="textarea"
          rows={3}
          value={form.description}
          onChange={(value) => onUpdate("description", value)}
        />
      </Field>

      {/* FULL DESCRIPTION */}
      <Field label="Full description" full>
        <InputMarkdown
          className="font-mono text-xs"
          value={form.fullDescription}
          onChange={(v) => onUpdate("fullDescription", v)}
        />
      </Field>

      {/* VIDEO */}
      <Field label="External video URL" full>
        <Input
          placeholder="https://youtube.com/..."
          value={form.externalVideoUrl}
          onChange={(value) => onUpdate("externalVideoUrl", value)}
        />
      </Field>
    </div>
  );
}
