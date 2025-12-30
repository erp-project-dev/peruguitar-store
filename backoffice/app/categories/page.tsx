"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageSection from "@/app/components/PageSection";
import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { Category } from "@/infrastracture/domain/category.entity";
import DataTable from "../components/Form/DataTable/DataTable";
import { CornerDownRight } from "lucide-react";

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
            editableOn: "insert",
            render: (value) => (
              <span className="text-xs font-mono text-neutral-400">
                {value}
              </span>
            ),
          },
          {
            type: "number",
            key: "order",
            label: "Order",
            width: 100,
            editable: true,
            render: (value, row) => {
              const isParent = row.parent_id === null;
              const orderLabel = String(value ?? 0).padStart(2, "0");

              return (
                <div className="flex items-center gap-1">
                  {!isParent && (
                    <CornerDownRight className="w-3 h-3 text-neutral-400" />
                  )}

                  <span
                    className={`
            px-2 py-0.5 rounded-full text-xs font-mono
            ${isParent ? "bg-black text-white" : "bg-gray-300 text-gray-800"}
          `}
                  >
                    {orderLabel}
                  </span>
                </div>
              );
            },
          },
          {
            key: "name",
            label: "Name",
            editable: true,
            sortable: true,
            width: 200,
            render: (value, row) => {
              const isChild = row.parent_id !== null;

              return (
                <span
                  className={`flex items-center gap-2 text-xs ${
                    !isChild ? "font-bold" : ""
                  }`}
                >
                  {isChild && (
                    <CornerDownRight className="w-3 h-3 text-neutral-400" />
                  )}

                  <span>{value ?? "--"}</span>
                </span>
              );
            },
          },
          {
            key: "description",
            label: "Description",
            editable: true,
          },
          {
            key: "parent_id",
            label: "Parent",
            editable: true,
            editableOn: "insert",
            sortable: true,
            width: 180,
            defaultValue: null,
            values: [
              { label: "No parent category", value: null },
              ...categories
                .filter((c) => !c.parent_id)
                .map((c) => ({ label: c.name, value: c._id })),
            ],
            render: (value) => (
              <span className="text-xs font-mono text-neutral-400">
                {value ?? "--"}
              </span>
            ),
          },
        ]}
      />
    </PageSection>
  );
}
