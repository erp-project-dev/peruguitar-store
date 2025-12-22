"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageSection from "@/app/components/PageSection";
import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { Merchant } from "@/infrastracture/domain/merchant.entity";
import DataTable from "../components/Form/DataTable/DataTable";
import { CITIES, COUNTRIES, STATES } from "../common/data/location.data";

const storeClient = new StoreClient();

export default function Merchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const data = await storeClient.execute<Merchant[]>(
          StoreCommand.MerchantFindAll
        );
        setMerchants(data);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Error loading merchants";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  const handleSave = async (id: string, row: Partial<Merchant>) => {
    const updated = await storeClient.execute<Merchant>(
      StoreCommand.MerchantUpdate,
      { id, payload: row }
    );

    setMerchants((prev) => prev.map((m) => (m._id === id ? updated : m)));
  };

  const handleInsert = async (row: Partial<Merchant>) => {
    const created = await storeClient.execute<Merchant>(
      StoreCommand.MerchantCreate,
      { payload: row }
    );

    setMerchants((prev) => [created, ...prev]);
  };

  const handleRemove = async (id: string) => {
    await storeClient.execute(StoreCommand.MerchantRemove, { id });
    setMerchants((prev) => prev.filter((m) => m._id !== id));
  };

  return (
    <PageSection
      title="Merchants"
      description="Manage merchants"
      loading={loading}
    >
      <DataTable<Merchant>
        data={merchants}
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
              <span className="text-xs text-neutral-400">
                {value as string}
              </span>
            ),
          },
          {
            key: "name",
            label: "Name",
            editable: true,
            sortable: true,
            width: 140,
          },
          {
            key: "last_name",
            label: "Last name",
            editable: true,
            sortable: true,
            width: 200,
          },
          {
            key: "country",
            label: "Country",
            editable: true,
            sortable: true,
            width: 140,
            values: COUNTRIES.map((c) => ({ label: c, value: c })),
            defaultValue: COUNTRIES[0],
          },
          {
            key: "state",
            label: "State",
            editable: true,
            sortable: true,
            width: 140,
            values: STATES.map((c) => ({ label: c, value: c })),
            defaultValue: STATES[0],
          },
          {
            key: "city",
            label: "City",
            editable: true,
            sortable: true,
            width: 200,
            values: CITIES.map((c) => ({ label: c, value: c })),
            defaultValue: CITIES[0],
          },
          {
            key: "email",
            label: "E-mail",
            editable: true,
            width: 260,
            render: (value) =>
              value ? (
                <a
                  href={`mailto:${value}`}
                  className="text-neutral-700 hover:underline"
                >
                  {value as string}
                </a>
              ) : null,
          },
          {
            key: "whatsapp",
            label: "WhatsApp",
            editable: true,
            align: "right",
            render: (value) =>
              value ? (
                <a
                  href={`https://wa.me/51${String(value).replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-700 hover:underline"
                >
                  {value as string}
                </a>
              ) : null,
          },
          {
            key: "instagram",
            label: "Instagram",
            editable: true,
            render: (value) =>
              value ? (
                <a
                  href={`https://instagram.com/${value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-700 hover:underline"
                >
                  {value as string}
                </a>
              ) : null,
          },
        ]}
      />
    </PageSection>
  );
}
