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

import { Product } from "@/infrastracture/domain/product.entity";

import {
  CURRENCIES,
  PRODUCT_PRICE_TYPES,
  PRODUCT_CONDITIONS,
  PRODUCT_SCORES,
} from "@/app/common/data";
import ProductInfo from "./components/ProductInfo";
import ProductImageAttach from "./components/ProductImageAttach";
import ProductImageList from "./components/ProductImageList";
import { getPublicPath } from "@/app/common/helpers/product.helper";

const storeClient = new StoreClient();

export type ProductCreate = {
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
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const product = await storeClient.execute<Product>(
          StoreCommand.CatalogFindById,
          productId
        );

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

  const update = (key: keyof ProductCreate, value: any) => {
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

  const handleImagesAttach = async (files: File[]) => {
    if (!files.length) return;

    try {
      setLoading(true);

      const updated = await storeClient.execute<string[]>(
        StoreCommand.CatalogAttachImages,
        productId,
        files
      );

      setImages(updated);

      toast.success("Images attached");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error attaching images";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnRemoveImage = async (image: string) => {
    try {
      setLoading(true);

      const updated = await storeClient.execute<string[]>(
        StoreCommand.CatalogRemoveImage,
        productId,
        image
      );

      setImages(updated);

      toast.success("Image removed");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error removing image";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnReorder = async (images: string[]) => {
    try {
      setLoading(true);

      const updated = await storeClient.execute<string[]>(
        StoreCommand.CatalogReorderImages,
        productId,
        images
      );

      setImages(updated);

      toast.success("Images reordered");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Error reordering images";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageSection
      title="Edit product"
      description={"Update product information"}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProductInfo form={form} onUpdate={update} />
        </div>

        {/* RIGHT — IMAGES */}
        <div className="flex flex-col gap-4">
          <ProductImageAttach
            onSelect={handleImagesAttach}
            max={6 - images.length}
          />

          <ProductImageList
            onReorder={handleOnReorder}
            images={images}
            onRemove={handleOnRemoveImage}
          />
        </div>
      </div>
    </PageSection>
  );
}
