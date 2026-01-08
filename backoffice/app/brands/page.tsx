"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageSection from "@/app/components/PageSection";
import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { Brand } from "@/infrastracture/domain/brand.entity";
import DataTable from "../components/Form/DataTable/DataTable";
import { TagIcon } from "lucide-react";
import { Category } from "@/infrastracture/domain/category.entity";

const storeClient = new StoreClient();

export default function Brands() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          storeClient.execute<Category[]>(StoreCommand.CategoryFindAll, {
            options: {
              cacheTtlSeconds: 60,
            },
          }),
          storeClient.execute<Brand[]>(StoreCommand.BrandFindAll),
        ]);

        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Error loading data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (id: string, row: Partial<Brand>) => {
    const updated = await storeClient.execute<Brand>(StoreCommand.BrandUpdate, {
      id,
      payload: row,
    });

    setBrands((prev) => prev.map((b) => (b._id === id ? updated : b)));
  };

  const handleInsert = async (row: Partial<Brand>) => {
    const created = await storeClient.execute<Brand>(StoreCommand.BrandCreate, {
      payload: row,
    });

    setBrands((prev) => [created, ...prev]);
  };

  const handleRemove = async (id: string) => {
    await storeClient.execute(StoreCommand.BrandRemove, { id });
    setBrands((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <PageSection title="Brands" description="Manage brands" loading={loading}>
      <DataTable<Brand>
        data={brands}
        actions={["edit", "insert", "remove"]}
        onSave={handleSave}
        onInsert={handleInsert}
        onRemove={handleRemove}
        columns={[
          {
            key: "_id",
            label: "ID",
            render: (value) => (
              <span className="text-xs text-neutral-400">{value}</span>
            ),
            width: 140,
          },
          {
            key: "categories",
            label: "Categories",
            width: 220,
            editable: true,
            multiple: true,
            values: categories
              .filter((c) => c.parent_id)
              .map((c) => ({ label: c.name, value: c._id })),
            truncate: false,
            render: (value: string[]) => (
              <ul className="space-y-1">
                {Array.isArray(value) &&
                  value.map((category) => (
                    <li
                      key={category}
                      className="flex items-center gap-2 text-xs"
                    >
                      <TagIcon size={12} className="text-neutral-500" />
                      <span className="font-mono">{category}</span>
                    </li>
                  ))}
              </ul>
            ),
          },
          {
            key: "name",
            label: "Name",
            editable: true,
            sortable: true,
          },
        ]}
      />
    </PageSection>
  );
}
