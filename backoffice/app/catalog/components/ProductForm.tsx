/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Brand } from "@/infrastracture/domain/brand.entity";
import { Merchant } from "@/infrastracture/domain/merchant.entity";
import { CategoryId } from "@/infrastracture/domain/category.entity";
import { ProductType } from "@/infrastracture/domain/product-type.entity";
import { ProductEntryForm } from "../shared/product.entry";
import ProductFormBuilder from "./ProductFormBuilder";

type Props = {
  mode: "insert" | "edit";
  category: CategoryId;
  form: ProductEntryForm;

  merchants: Merchant[];
  brands: Brand[];
  types: ProductType[];

  onUpdate: (key: keyof ProductEntryForm, value: any) => void;
};

export default function ProductForm({
  mode,
  form,
  onUpdate,
  category,
  brands,
  merchants,
  types,
}: Props) {
  if (category === "electric-guitar") {
    return (
      <ProductFormBuilder
        mode={mode}
        form={form}
        brands={brands}
        merchants={merchants}
        types={types}
        onUpdate={onUpdate}
        layout={[
          "name",
          "type",
          "brand",
          "model",
          "condition",
          "score",
          "currency",
          "price",
          "price_type",
          "merchant",
          "status",
          "pinned",
          "description:full",
          "specs:full",
        ]}
      />
    );
  }

  if (category === "book") {
    return (
      <ProductFormBuilder
        mode={mode}
        form={form}
        merchants={merchants}
        onUpdate={onUpdate}
        layout={[
          "name:full",
          "currency",
          "price",
          "price_type",
          "merchant",
          "status",
          "pinned",
          "description:full",
          "specs:full",
        ]}
      />
    );
  }

  if (["lesson", "music-production"].includes(category)) {
    return (
      <ProductFormBuilder
        mode={mode}
        form={form}
        merchants={merchants}
        onUpdate={onUpdate}
        layout={[
          "name:full",
          "merchant",
          "status",
          "pinned",
          "description:full",
          "full_description:full",
          "external_video_url:full",
        ]}
      />
    );
  }

  if (category === "pedalboard-digital") {
    return (
      <ProductFormBuilder
        mode={mode}
        form={form}
        brands={brands}
        merchants={merchants}
        onUpdate={onUpdate}
        layout={[
          "name:full",
          "brand",
          "model",
          "condition",
          "score",
          "currency",
          "price",
          "price_type",
          "merchant",
          "status",
          "pinned",
          "description:full",
          "specs:full",
        ]}
      />
    );
  }

  if (category === "pick") {
    return (
      <ProductFormBuilder
        mode={mode}
        form={form}
        brands={brands}
        merchants={merchants}
        onUpdate={onUpdate}
        layout={[
          "name:full",
          "brand",
          "model",
          "currency",
          "price",
          "price_type",
          "merchant",
          "status",
          "pinned",
          "description:full",
          "full_description:full",
          "specs:full",
        ]}
      />
    );
  }

  return null;
}
