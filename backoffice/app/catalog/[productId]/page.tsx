/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Save, Undo } from "lucide-react";

import PageSection from "@/app/components/PageSection";
import Button from "@/app/components/Form/Button";

import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";
import { getPublicPath } from "@/app/common/helpers/product.helper";

import { Product } from "@/infrastracture/domain/product.entity";
import { CategoryId } from "@/infrastracture/domain/category.entity";

import ProductForm, { ProductEntryForm } from "../components/ProductForm";
import ProductImageUpload from "./components/ProductImageUpload/ProductImageUpload";
import ProductImageList from "./components/ProductImageList";

import { useCatalogData } from "../shared/use-catalog-data";
import { productEntryFrom } from "../shared/product-entry";

const storeClient = new StoreClient();

export default function EditProductPage() {
  const params = useParams<{ productId: string }>();
  const productId = params.productId;
  const router = useRouter();

  const [form, setForm] = useState<ProductEntryForm>(productEntryFrom);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const { brands, merchants, types } = useCatalogData({
    categoryId: form.category_id || undefined,
  });

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      try {
        setLoading(true);

        const product = await storeClient.execute<Product>(
          StoreCommand.CatalogFindById,
          { id: productId }
        );

        setImages(product.images);

        setForm({
          category_id: product.category_id,
          brand_id: product.brand_id,
          merchant_id: product.merchant_id,
          type_id: product.type_id,
          condition: product.condition,
          condition_score: product.condition_score,
          name: product.name,
          model: product.model,
          description: product.description,
          fullDescription: product.fullDescription,
          currency: product.currency,
          price: product.price,
          priceType: product.priceType,
          is_enabled: product.is_enabled,
          is_pinned: product.is_pinned,
          publish_date: product.publish_date,
          specs_raw: JSON.stringify(product.specs, null, 2),
        });
      } catch {
        toast.error("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  /* ---------------- update form ---------------- */
  const update = (key: keyof ProductEntryForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const specs = form.specs_raw ? JSON.parse(form.specs_raw) : {};

      await storeClient.execute(StoreCommand.CatalogUpdate, {
        id: productId,
        payload: {
          brand_id: form.brand_id,
          merchant_id: form.merchant_id,
          type_id: form.type_id,
          condition: form.condition,
          condition_score: form.condition_score,
          name: form.name,
          model: form.model,
          description: form.description,
          fullDescription: form.fullDescription,
          currency: form.currency,
          price: form.price,
          priceType: form.priceType,
          specs,
          is_enabled: form.is_enabled,
          is_pinned: form.is_pinned,
        },
      });

      toast.success("Product updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const handleImagesAttach = async (files: File[]) => {
    if (!files.length) return;

    try {
      setLoading(true);

      const updated = await storeClient.execute<string[]>(
        StoreCommand.CatalogAttachImages,
        { id: productId, payload: files }
      );

      setImages(updated);
      toast.success("Images attached");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error attaching images");
    } finally {
      setLoading(false);
    }
  };

  const handleOnRemoveImage = async (image: string) => {
    try {
      setLoading(true);

      const updated = await storeClient.execute<string[]>(
        StoreCommand.CatalogRemoveImage,
        { id: productId, payload: image }
      );

      setImages(updated);
      toast.success("Image removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error removing image");
    } finally {
      setLoading(false);
    }
  };

  const handleOnReorder = async (images: string[]) => {
    try {
      setLoading(true);

      const updated = await storeClient.execute<string[]>(
        StoreCommand.CatalogReorderImages,
        { id: productId, payload: images }
      );

      setImages(updated);
      toast.success("Images reordered");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error reordering images");
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
            Back
          </Button>

          <Button
            size="lg"
            icon={Eye}
            onClick={() => router.push(getPublicPath(productId))}
            disabled={loading}
            variant="info"
          >
            Visit product page
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
      {!loading && form.category_id && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductForm
              mode="edit"
              category={form.category_id as CategoryId}
              form={form}
              brands={brands}
              merchants={merchants}
              types={types}
              onUpdate={update}
            />
          </div>

          <div className="flex flex-col gap-4">
            <ProductImageUpload
              onSelect={handleImagesAttach}
              max={6 - images.length}
            />
            <ProductImageList
              images={images}
              onReorder={handleOnReorder}
              onRemove={handleOnRemoveImage}
            />
          </div>
        </div>
      )}
    </PageSection>
  );
}
