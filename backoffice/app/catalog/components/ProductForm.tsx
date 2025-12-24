/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Brand } from "@/infrastracture/domain/brand.entity";
import { Merchant } from "@/infrastracture/domain/merchant.entity";
import { CategoryId } from "@/infrastracture/domain/category.entity";
import { ProductType } from "@/infrastracture/domain/product-type.entity";
import ProductElectricGuitarForm from "./ProductElectricGuitar";
import ProductBookForm from "./ProductBook";
import { ProductEntryForm } from "../shared/product.entry";
import ProductLessonForm from "./ProductLesson";

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
      <ProductElectricGuitarForm
        mode={mode}
        form={form}
        brands={brands}
        merchants={merchants}
        types={types}
        onUpdate={onUpdate}
      />
    );
  }

  if (category === "book") {
    return (
      <ProductBookForm
        mode={mode}
        form={form}
        merchants={merchants}
        onUpdate={onUpdate}
      />
    );
  }

  if (category === "lesson") {
    return (
      <ProductLessonForm
        mode={mode}
        form={form}
        merchants={merchants}
        onUpdate={onUpdate}
      />
    );
  }

  return (
    <div className="text-sm text-red-500">Unsupported category: {category}</div>
  );
}
