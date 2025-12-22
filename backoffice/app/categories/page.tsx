"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageSection from "@/app/components/PageSection";
import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { Category } from "@/infrastracture/domain/category.entity";
import DataTable from "../components/Form/DataTable/DataTable";

const storeClient = new StoreClient();

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await storeClient.execute<Category[]>(
          StoreCommand.CategoryFindAll
        );
        setCategories(data);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Error loading categories";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async (id: string, row: Partial<Category>) => {
    const updated = await storeClient.execute<Category>(
      StoreCommand.CategoryUpdate,
      { id, payload: row }
    );

    setCategories((prev) => prev.map((c) => (c._id === id ? updated : c)));
  };

  const handleInsert = async (row: Partial<Category>) => {
    const created = await storeClient.execute<Category>(
      StoreCommand.CategoryCreate,
      { payload: row }
    );

    setCategories((prev) => [created, ...prev]);
  };

  const handleRemove = async (id: string) => {
    await storeClient.execute(StoreCommand.CategoryRemove, { id });
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <PageSection
      title="Categories"
      description="Manage product categories"
      loading={loading}
    >
      <DataTable<Category>
        data={categories}
        actions={["edit", "insert", "remove"]}
        onSave={handleSave}
        onInsert={handleInsert}
        onRemove={handleRemove}
        columns={[
          {
            key: "_id",
            label: "ID",
            width: 180,
            editable: true,
            render: (value) => (
              <span className="text-xs font-mono text-neutral-400">
                {value}
              </span>
            ),
          },
          {
            key: "name",
            label: "Name",
            editable: true,
            sortable: true,
          },
          {
            key: "description",
            label: "Description",
            editable: true,
          },
        ]}
      />
    </PageSection>
  );
}
