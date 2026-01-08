/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Save, Undo, MessageCircle } from "lucide-react";

import PageSection from "@/app/components/PageSection";
import Button from "@/app/components/Form/Button";

import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";
import { getPublicPath } from "@/app/common/helpers/product.helper";

import { Product } from "@/infrastracture/domain/product.entity";
import { CategoryId } from "@/infrastracture/domain/category.entity";

import ProductForm from "../components/ProductForm";
import ProductImageUpload from "./components/ProductImageUpload/ProductImageUpload";
import ProductImageList from "./components/ProductImageList";

import { useCatalogData } from "../shared/use-catalog-data";
import { ProductEntryForm, productEntryFrom } from "../shared/product.entry";
import { getWhatsappLink } from "@/app/common/helpers/merchant.helper";

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
          _id: product._id,
          category_id: product.category_id,

          brand_id: product.brand_id,
          merchant_id: product.merchant_id,
          type_id: product.type_id,

          condition: product.condition,
          condition_score: product.condition_score,

          name: product.name,
          model: product.model,
          description: product.description,
          full_description: product.full_description,

          currency: product.currency,
          price: product.price,
          price_type: product.price_type,

          external_video_url: product.external_video_url,

          specs_raw: product.specs
            ? JSON.stringify(product.specs, null, 2)
            : undefined,

          status: product.status,
          is_pinned: product.is_pinned,

          publish_date: product.publish_date,
        });
      } catch {
        toast.error("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const update = (key: keyof ProductEntryForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const specs = form.specs_raw ? JSON.parse(form.specs_raw) : undefined;

      await storeClient.execute(StoreCommand.CatalogUpdate, {
        id: productId,
        payload: {
          ...form,
          specs,
          specs_raw: undefined,
        },
      });

      toast.success("Product updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsappMessage = (productId: string) => {
    const merchant = merchants.find((m) => m._id === form.merchant_id);

    if (!merchant) {
      throw new Error("Merchant does not exist");
    }

    const message = `
Hola ${merchant.name},

Estamos publicando tu producto.
Dentro de poco podrás usar el siguiente enlace para visualizarlo:

https://peruguitar.com/${productId}

Gracias.
    `;

    const url = getWhatsappLink(merchant.country, merchant.whatsapp, message);

    window.open(url, "_blank");
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
            icon={MessageCircle}
            onClick={() => handleWhatsappMessage(productId)}
            disabled={loading || form.status !== "available"}
            variant="primary"
          >
            Chat
          </Button>

          <Button
            size="lg"
            icon={Eye}
            onClick={() => router.push(getPublicPath(productId))}
            disabled={loading}
            variant="info"
          >
            Visit page
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
