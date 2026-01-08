"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageSection from "@/app/components/PageSection";
import { StoreClient } from "@/app/common/store.client";
import { StoreCommand } from "@/app/api/store/store.command";

import DataTable from "../components/Form/DataTable/DataTable";
import { Customer } from "@/infrastracture/domain/customer.entity";
import { CITIES, COUNTRIES, STATES } from "../common/data/location.data";
import { Factory, User } from "lucide-react";

const storeClient = new StoreClient();

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await storeClient.execute<Customer[]>(
          StoreCommand.CustomerFindAll
        );
        setCustomers(data);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Error loading customers";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSave = async (id: string, row: Partial<Customer>) => {
    const updated = await storeClient.execute<Customer>(
      StoreCommand.CustomerUpdate,
      { id, payload: row }
    );

    setCustomers((prev) => prev.map((c) => (c._id === id ? updated : c)));
  };

  const handleInsert = async (row: Partial<Customer>) => {
    const created = await storeClient.execute<Customer>(
      StoreCommand.CustomerCreate,
      { payload: row }
    );

    setCustomers((prev) => [created, ...prev]);
  };

  const handleRemove = async (id: string) => {
    await storeClient.execute(StoreCommand.CustomerRemove, { id });
    setCustomers((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <PageSection
      title="Customers"
      description="Manage customers"
      loading={loading}
    >
      <DataTable<Customer>
        data={customers}
        actions={["edit", "insert", "remove"]}
        onSave={handleSave}
        onInsert={handleInsert}
        onRemove={handleRemove}
        columns={[
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
            key: "type",
            label: "Type",
            editable: true,
            sortable: true,
            width: 60,
            values: [
              { label: "Individual", value: "individual" },
              { label: "Company", value: "company" },
            ],
            defaultValue: "individual",
            render: (value) => {
              const isCompany = value === "company";

              const Icon = isCompany ? Factory : User;

              return <Icon className="w-4 h-4 text-neutral-500" />;
            },
          },
          {
            key: "name",
            label: "Name",
            editable: true,
            sortable: true,
            render: (value, row) => {
              if (row.type === "company") {
                return <span>{value}</span>;
              }

              return (
                <span>
                  {value} {row.last_name}
                </span>
              );
            },
          },

          {
            key: "tax_id_type",
            label: "Tax type",
            editable: true,
            width: 140,
            values: [
              { label: "DNI", value: "dni" },
              { label: "RUC", value: "ruc" },
              { label: "Passport", value: "passport" },
            ],
          },
          {
            key: "tax_id",
            label: "Tax ID",
            editable: true,
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
            width: 160,
            values: STATES.map((s) => ({ label: s, value: s })),
          },

          {
            key: "city",
            label: "City",
            editable: true,
            sortable: true,
            width: 200,
            values: CITIES.map((c) => ({ label: c, value: c })),
          },

          {
            key: "email",
            label: "E-mail",
            editable: true,
            width: 280,
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
            key: "phone",
            label: "Phone",
            editable: true,
            width: 220,
          },
        ]}
      />
    </PageSection>
  );
}
