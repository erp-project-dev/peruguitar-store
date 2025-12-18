"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageSection from "@/app/components/PageSection";
import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { Brand } from "@/infrastracture/domain/brand.entity";
import DataTable from "../components/Form/DataTable/DataTable";

const storeClient = new StoreClient();

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await storeClient.execute<Brand[]>(
          StoreCommand.BrandFindAll
        );
        setBrands(data);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Error loading brands";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleSave = async (id: string, row: Partial<Brand>) => {
    const updated = await storeClient.execute<Brand>(
      StoreCommand.BrandUpdate,
      id,
      row
    );

    setBrands((prev) => prev.map((b) => (b._id === id ? updated : b)));
  };

  const handleInsert = async (row: Partial<Brand>) => {
    const created = await storeClient.execute<Brand>(
      StoreCommand.BrandCreate,
      row
    );

    setBrands((prev) => [created, ...prev]);
  };

  const handleRemove = async (id: string) => {
    await storeClient.execute(StoreCommand.BrandRemove, id);
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
            width: 140,
            render: (value) => (
              <span className="text-xs text-neutral-400">{value}</span>
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
