"use client";

import {
  OrderItem,
  ProductOrderItem,
} from "@/infrastracture/domain/order.entity";
import { Customer } from "@/infrastracture/domain/customer.entity";

import OrderFormItems from "./OrderFormItems";

import Input from "@/app/components/Form/Input";
import Select from "@/app/components/Form/Select";
import InputSearch, { SearchOption } from "@/app/components/Form/InputSearch";

import { StoreCommand } from "@/app/api/store/store.command";
import { StoreClient } from "@/app/common/store.client";

import { OrderEntryForm } from "../../shared/order.entry";
import { ORDER_STATUS } from "@/app/common/data/order-status.data";

const storeClient = new StoreClient();

interface OrderFormProps {
  mode: "create" | "edit" | "view";
  order: OrderEntryForm;
  products: ProductOrderItem[];

  onChange: <K extends keyof OrderEntryForm>(
    key: K,
    value: OrderEntryForm[K]
  ) => void;
}

export default function OrderForm({
  mode,
  order,
  products,
  onChange,
}: OrderFormProps) {
  const isView = mode === "view";
  const isCreate = mode === "create";

  /* ---------- HELPERS ---------- */

  const recalcTotals = (items: OrderItem[]) => {
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    return { subtotal, total: subtotal };
  };

  const updateItems = (items: OrderItem[]) => {
    if (isView) return;

    const totals = recalcTotals(items);
    onChange("items", items);
    onChange("subtotal", totals.subtotal);
    onChange("total", totals.total);
  };

  /* ---------- CUSTOMER SEARCH ---------- */

  const findCustomerByName = async (query: string): Promise<SearchOption[]> => {
    const customers = await storeClient.execute<Customer[]>(
      StoreCommand.CustomerFindAll,
      { query: { name: query } }
    );

    return customers.map((customer) => ({
      label: customer.name,
      value: customer._id,
      row: customer,
    }));
  };

  const onCustomerChange = (customer: Customer | null) => {
    if (isView) return;

    if (!customer) {
      onChange("customer_id", "");
      onChange("customer_name", "");
      onChange("tax_id", undefined);
      onChange("tax_type", undefined);
      return;
    }

    onChange("customer_id", customer._id);
    onChange("customer_name", customer.name);
    onChange("tax_id", customer.tax_id);
    onChange("tax_type", customer.tax_type);
  };

  return (
    <div className="space-y-6 py-20 pb-20">
      {/* ---------- CUSTOMER + STATUS ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-neutral-500">
            Customer
          </label>

          {isView ? (
            <Input value={order.customer_name} readOnly />
          ) : (
            <InputSearch
              value={
                order.customer_id
                  ? {
                      label: order.customer_name,
                      value: order.customer_id,
                      row: null,
                    }
                  : null
              }
              onSearch={findCustomerByName}
              onChange={onCustomerChange}
            />
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-500">
            Status
          </label>

          <Select
            value={order.status}
            disabled={isCreate || isView}
            options={ORDER_STATUS.map((s) => ({
              label: s.label,
              value: s.value,
            }))}
            onChange={(value) =>
              onChange("status", value as OrderEntryForm["status"])
            }
          />
        </div>
      </div>

      {/* ---------- TAX DATA ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-neutral-500">
            Tax ID
          </label>
          <Input value={order.tax_id ?? ""} readOnly />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-500">
            Tax type
          </label>
          <Input value={order.tax_type ?? ""} readOnly />
        </div>
      </div>

      {/* ---------- ITEMS ---------- */}
      <OrderFormItems
        items={order.items}
        products={products}
        currency={order.currency}
        onChange={updateItems}
        readonly={isView}
      />

      {/* ---------- TOTALS ---------- */}
      <div className="border-t pt-4 space-y-1 text-right">
        <div className="text-sm text-neutral-500">
          Subtotal:{" "}
          <span className="font-medium">
            {order.subtotal.toLocaleString("es-PE", {
              style: "currency",
              currency: order.currency,
            })}
          </span>
        </div>

        <div className="text-lg font-bold">
          Total:{" "}
          {order.total.toLocaleString("es-PE", {
            style: "currency",
            currency: order.currency,
          })}
        </div>
      </div>

      {/* ---------- NOTES ---------- */}
      <div>
        <label className="text-xs font-semibold text-neutral-500">Notes</label>
        <Input
          type="textarea"
          value={order.notes ?? ""}
          readOnly={isView}
          onChange={(value) => onChange("notes", value)}
          rows={3}
        />
      </div>
    </div>
  );
}
