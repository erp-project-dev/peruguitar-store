/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Undo, Image as ImageIcon } from "lucide-react";

import PageSection from "@/app/components/PageSection";
import Button from "@/app/components/Form/Button";
import Input from "@/app/components/Form/Input";
import Select from "@/app/components/Form/Select";
import { Field } from "@/app/components/Form/Field";

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
import Switch from "@/app/components/Form/Switch";

const storeClient = new StoreClient();

type ProductCreate = {
  brand_id: string;
  merchant_id: string;
  type_id: string;
  condition: string;
  condition_score: number;
  name: string;
  model: string;
  description: string;
  currency: string;
  price: number;
  priceType: string;
  specs_raw: string;
  is_enabled: boolean;
  is_pinned: boolean;
};

const emptyForm: ProductCreate = {
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

export default function EditProductPage() {
  const params = useParams<{ productId: string }>();
  const productId = params.productId;

  const router = useRouter();

  const [form, setForm] = useState(emptyForm);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [product, brandsData, typesData, merchantsData] =
          await Promise.all([
            storeClient.execute<Product>(
              StoreCommand.CatalogFindById,
              productId
            ),
            storeClient.execute<Brand[]>(StoreCommand.BrandFindAll),
            storeClient.execute<ProductType[]>(StoreCommand.ProductTypeFindAll),
            storeClient.execute<Merchant[]>(StoreCommand.MerchantFindAll),
          ]);

        setBrands(brandsData);
        setTypes(typesData);
        setMerchants(merchantsData);
        setImages(product.images);

        setForm({
          brand_id: product.brand_id,
          merchant_id: product.merchant_id,
          type_id: product.type_id,
          condition: product.condition,
          condition_score: product.condition_score,
          name: product.name,
          model: product.model,
          description: product.description,
          currency: product.currency,
          price: product.price,
          priceType: product.priceType,
          is_enabled: product.is_enabled,
          is_pinned: product.is_pinned,
          specs_raw: JSON.stringify(product.specs, null, 2),
        });
      } catch {
        toast.error("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchAll();
  }, [productId]);

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
        is_pinned: form.is_pinned,
        is_enabled: form.is_enabled,
      };

      await storeClient.execute(StoreCommand.CatalogUpdate, productId, payload);

      toast.success("Product updated");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error updating product";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageSection
      title="Edit product"
      description="Update product information"
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
            Save changes
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — FORM */}
        <div className="lg:col-span-2">
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
                onChange={(e) => update("type_id", e.target.value)}
                options={types.map((t) => ({
                  label: t.name,
                  value: t._id,
                }))}
              />
            </Field>

            <Field label="Brand">
              <Select
                value={form.brand_id}
                onChange={(e) => update("brand_id", e.target.value)}
                options={brands.map((b) => ({
                  label: b.name,
                  value: b._id,
                }))}
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
                value={form.condition}
                onChange={(e) => update("condition", e.target.value)}
                options={PRODUCT_CONDITIONS.map((c) => ({
                  label: c,
                  value: c,
                }))}
              />
            </Field>

            <Field label="Score">
              <Select
                value={String(form.condition_score)}
                onChange={(e) =>
                  update("condition_score", Number(e.target.value))
                }
                options={PRODUCT_SCORES.map((s) => ({
                  label: `${s}/5`,
                  value: String(s),
                }))}
              />
            </Field>

            <Field label="Currency">
              <Select
                value={form.currency}
                onChange={(e) => update("currency", e.target.value)}
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
                onChange={(e) => update("price", Number(e.target.value))}
              />
            </Field>

            <Field label="Price type">
              <Select
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
                value={form.merchant_id}
                onChange={(e) => update("merchant_id", e.target.value)}
                options={merchants.map((m) => ({
                  label: m._id,
                  value: m._id,
                }))}
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
                value={form.specs_raw}
                onChange={(e) => update("specs_raw", e.target.value)}
              />
            </Field>
          </div>
        </div>

        {/* RIGHT — IMAGES */}
        <div className="flex flex-col gap-4">
          <div className="h-24 rounded-lg border border-dashed border-neutral-300 bg-neutral-50" />

          {images.map((image, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-neutral-100">
                <ImageIcon className="h-6 w-6 text-neutral-400" />
              </div>
              <span className="text-xs text-neutral-500">{image}</span>
            </div>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
