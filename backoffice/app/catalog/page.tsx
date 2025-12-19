/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import {
  Pin,
  PinOff,
  Check,
  X,
  Plus,
  ImageOff,
  Image,
  ImageIcon,
} from "lucide-react";

import { Product } from "@/infrastracture/domain/product.entity";

import PageSection from "@/app/components/PageSection";
import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import DataTable from "../components/Form/DataTable/DataTable";
import Button from "../components/Form/Button";
import Tooltip from "../components/Tooltip";
import { getPublicImagePath } from "../common/helpers/product.helper";

const storeClient = new StoreClient();

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await storeClient.execute<Product[]>(
          StoreCommand.CatalogFindAll
        );

        setProducts(data);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Error loading catalog data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRemove = async (id: string) => {
    await storeClient.execute(StoreCommand.CatalogRemove, id);
    setProducts((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <PageSection
      title="Catalog"
      description="Products overview"
      loading={loading}
      actions={
        <Button
          onClick={() => router.push("/catalog/create")}
          variant="info"
          icon={Plus}
          size="lg"
        >
          New product
        </Button>
      }
    >
      <DataTable<Product>
        data={products}
        columns={[
          {
            key: "images",
            label: "",
            width: 110,
            render: (value: string[]) => {
              const hasImage = Array.isArray(value) && value.length > 0;

              return (
                <div className="w-full h-20 overflow-hidden rounded-md bg-neutral-100 flex items-center justify-center">
                  {hasImage ? (
                    <img
                      src={getPublicImagePath(value[0])}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-neutral-400" />
                  )}
                </div>
              );
            },
          },

          {
            key: "_id",
            label: "ID",
            width: 200,
            render: (value) => (
              <span className="text-xs text-neutral-400">
                {value as string}
              </span>
            ),
          },

          {
            key: "brand_id",
            label: "Brand",
            sortable: true,
            width: 100,
          },

          {
            key: "name",
            label: "Name",
            sortable: true,
            render: (value, row) => (
              <a
                href={`/catalog/${row._id}`}
                className="text-blue-900 hover:underline"
              >
                {value as string}
              </a>
            ),
          },

          {
            key: "price",
            label: "Price",
            sortable: true,
            width: 160,
            align: "right",
            render: (value: number, row) => (
              <span className="font-medium whitespace-nowrap">
                {value.toLocaleString("es-PE", {
                  style: "currency",
                  currency: row.currency,
                  minimumFractionDigits: 2,
                })}
              </span>
            ),
          },

          {
            key: "type_id",
            label: "Product type",
            width: 140,
          },

          {
            key: "priceType",
            label: "Price type",
            width: 140,
          },

          {
            key: "condition",
            label: "Condition",
            width: 140,
            sortable: true,
          },

          {
            key: "condition_score",
            label: "Score",
            width: 100,
            align: "center",
            sortable: true,
            render: (value) => (
              <span className="text-sm">{value as number}/5</span>
            ),
          },

          {
            key: "is_pinned",
            label: "Pinned",
            width: 90,
            align: "center",
            sortable: true,
            render: (value) =>
              value ? (
                <Pin className="h-6 w-6 text-yellow-500 mx-auto" />
              ) : (
                <PinOff className="h-6 w-6 text-neutral-300 mx-auto" />
              ),
          },

          {
            key: "is_enabled",
            label: "Enabled",
            width: 90,
            align: "center",
            sortable: true,
            render: (value) =>
              value ? (
                <Check className="h-6 w-6 text-green-600 mx-auto" />
              ) : (
                <X className="h-6 w-6 text-red-500 mx-auto" />
              ),
          },
        ]}
        actions={["remove"]}
        onRemove={handleRemove}
      />
    </PageSection>
  );
}
