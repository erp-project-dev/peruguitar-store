"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageSection from "@/app/components/PageSection";
import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { ProductType } from "@/infrastracture/domain/product-type.entity";
import { Brand } from "@/infrastracture/domain/brand.entity";

import DataTable from "../components/Form/DataTable/DataTable";
import { Category } from "@/infrastracture/domain/category.entity";

const storeClient = new StoreClient();

export default function Types() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, typesData] = await Promise.all([
          storeClient.execute<Category[]>(StoreCommand.CategoryFindAll, {
            options: { cacheTtlSeconds: 60 },
          }),
          storeClient.execute<ProductType[]>(StoreCommand.ProductTypeFindAll),
        ]);

        setCategories(categoriesData);
        setTypes(typesData);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Error loading data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (id: string, row: Partial<ProductType>) => {
    const updated = await storeClient.execute<ProductType>(
      StoreCommand.ProductTypeUpdate,
      { id, payload: row }
    );

    setTypes((prev) => prev.map((t) => (t._id === id ? updated : t)));
  };

  const handleInsert = async (row: Partial<ProductType>) => {
    const created = await storeClient.execute<ProductType>(
      StoreCommand.ProductTypeCreate,
      { payload: row }
    );

    setTypes((prev) => [created, ...prev]);
  };

  const handleRemove = async (id: string) => {
    await storeClient.execute(StoreCommand.ProductTypeRemove, { id });

    setTypes((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <PageSection
      title="Product Types"
      description="Manage product types"
      loading={loading}
    >
      <DataTable<ProductType>
        data={types}
        actions={["edit", "insert", "remove"]}
        onSave={handleSave}
        onInsert={handleInsert}
        onRemove={handleRemove}
        columns={[
          {
            key: "_id",
            label: "ID",
            width: 140,
            render: (value) => (
              <span className="text-xs text-neutral-400">{value}</span>
            ),
          },
          {
            editable: true,
            editableOn: "insert",
            key: "category_id",
            label: "Category",
            width: 200,
            values: categories.map((c) => ({ label: c.name, value: c._id })),
            render: (value) => (
              <span className="text-xs text-neutral-400">{value}</span>
            ),
          },
          {
            key: "name",
            label: "Name",
            editable: true,
            sortable: true,
            width: 200,
          },
          {
            key: "description",
            label: "Description",
            editable: true,
            sortable: true,
          },
        ]}
      />
    </PageSection>
  );
}
