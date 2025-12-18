"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageSection from "@/app/components/PageSection";
import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import { Setting } from "@/infrastracture/domain/setting.entity";
import DataTable from "../components/Form/DataTable/DataTable";

const storeClient = new StoreClient();

export default function Settings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await storeClient.execute<Setting[]>(
          StoreCommand.SettingFindAll
        );
        setSettings(data);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Error loading settings";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (id: string, row: Partial<Setting>) => {
    const updated = await storeClient.execute<Setting>(
      StoreCommand.SettingUpdate,
      id,
      row
    );

    setSettings((prev) => prev.map((s) => (s._id === id ? updated : s)));
  };

  const handleInsert = async (row: Partial<Setting>) => {
    const created = await storeClient.execute<Setting>(
      StoreCommand.SettingCreate,
      row
    );

    setSettings((prev) => [created, ...prev]);
  };

  const handleRemove = async (id: string) => {
    await storeClient.execute(StoreCommand.SettingRemove, id);

    setSettings((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <PageSection
      title="Settings"
      description="Manage application settings"
      loading={loading}
    >
      <DataTable<Setting>
        data={settings}
        actions={["edit", "insert", "remove"]}
        onSave={handleSave}
        onInsert={handleInsert}
        onRemove={handleRemove}
        columns={[
          {
            key: "_id",
            label: "ID",
            width: 260,
            editable: true,
            render: (value) => (
              <span className="text-xs text-neutral-400">{value}</span>
            ),
          },
          {
            key: "value",
            label: "Value",
            editable: true,
          },
        ]}
      />
    </PageSection>
  );
}
