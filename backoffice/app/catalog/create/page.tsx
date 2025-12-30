/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Undo } from "lucide-react";

import PageSection from "@/app/components/PageSection";
import Button from "@/app/components/Form/Button";
import Select from "@/app/components/Form/Select";

import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { Brand } from "@/infrastracture/domain/brand.entity";
import { ProductType } from "@/infrastracture/domain/product-type.entity";
import { Merchant } from "@/infrastracture/domain/merchant.entity";
import { Product } from "@/infrastracture/domain/product.entity";
import { Category, CategoryId } from "@/infrastracture/domain/category.entity";

import ProductPromptHelp from "./components/ProductPromptHelp/ProductPromptHelp";
import ProductForm from "../components/ProductForm";
import { productEntryFrom } from "../shared/product.entry";

const storeClient = new StoreClient();

/* ================= PAGE ================= */

export default function CreateProductPage() {
  const router = useRouter();

  const [form, setForm] = useState(productEntryFrom);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD CATEGORIES (ONLY ONCE) ---------------- */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await storeClient.execute<Category[]>(
          StoreCommand.CategoryFindAll,
          { options: { cacheTtlSeconds: 60 } }
        );

        setCategories(categories);
      } catch {
        toast.error("Error loading categories");
      }
    };

    loadCategories();
  }, []);

  /* ---------------- LOAD FORM DATA (AFTER CATEGORY) ---------------- */
  useEffect(() => {
    if (!form.category_id) return;

    const loadFormData = async () => {
      try {
        const [brands, types, merchants] = await Promise.all([
          storeClient.execute<Brand[]>(StoreCommand.BrandFindAll, {
            query: { categoryId: form.category_id },
            options: { cacheTtlSeconds: 60 },
          }),
          storeClient.execute<ProductType[]>(StoreCommand.ProductTypeFindAll, {
            options: { cacheTtlSeconds: 60 },
          }),
          storeClient.execute<Merchant[]>(StoreCommand.MerchantFindAll, {
            options: { cacheTtlSeconds: 60 },
          }),
        ]);

        setBrands(brands);
        setTypes(types);
        setMerchants(merchants);
      } catch {
        toast.error("Error loading form data");
      }
    };

    loadFormData();
  }, [form.category_id]);

  /* ---------------- UPDATE FORM ---------------- */
  const update = (key: keyof typeof productEntryFrom, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- CREATE ---------------- */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const specs = form.specs_raw ? JSON.parse(form.specs_raw) : undefined;

      const payload = {
        category_id: form.category_id,
        brand_id: form.brand_id,
        merchant_id: form.merchant_id,
        type_id: form.type_id,
        condition: form.condition,
        condition_score: form.condition_score,
        name: form.name,
        model: form.model,
        description: form.description,
        full_description: form.full_description,
        currency: form.currency,
        price: form.price,
        price_type: form.price_type,
        specs,
        status: form.status,
        external_video_url: form.external_video_url,
      };

      const created = await storeClient.execute<Product>(
        StoreCommand.CatalogCreate,
        { payload }
      );

      toast.success("Product created");
      router.push(`/catalog/${created._id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error creating product");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RENDER ---------------- */
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

          {form.category_id && (
            <Button
              variant="success"
              size="lg"
              icon={Save}
              onClick={handleSubmit}
              disabled={loading}
            >
              Create product
            </Button>
          )}
        </>
      }
    >
      {/* ---------- STEP 1: CATEGORY ---------- */}
      {!form.category_id && (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="w-full max-w-md text-center space-y-4">
            <div className="text-sm text-neutral-500">
              Please choose a category before continuing
            </div>

            <Select
              value={form.category_id ?? ""}
              placeholder="Select category"
              onChange={(value) => update("category_id", value as CategoryId)}
              options={categories
                .filter((c) => c.parent_id)
                .map((c) => ({
                  label: c.name,
                  value: c._id,
                }))}
            />
          </div>
        </div>
      )}

      {/* ---------- STEP 2: FORM ---------- */}
      {form.category_id && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductForm
              mode="insert"
              category={form.category_id as CategoryId}
              form={form}
              brands={brands}
              merchants={merchants}
              types={types}
              onUpdate={update}
            />
          </div>

          <div className="flex flex-col gap-4">
            <ProductPromptHelp
              brands={brands.map((b) => b._id)}
              types={types.map((t) => t._id)}
              category={form.category_id}
            />
          </div>
        </div>
      )}
    </PageSection>
  );
}
