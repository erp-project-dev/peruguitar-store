import { Order, OrderItem } from "@/infrastracture/domain/order.entity";

type OrderOmittedProperties =
  | "_id"
  | "created_at"
  | "created_by"
  | "updated_at"
  | "updated_by";

export interface OrderEntryForm extends Omit<Order, OrderOmittedProperties> {
  _id?: string;
}

export const orderEntryForm: OrderEntryForm = {
  status: "pending",

  customer_id: "",
  customer_name: "",

  tax_id: undefined,
  tax_type: undefined,

  total: 0,
  subtotal: 0,

  items: [] as OrderItem[],

  currency: "PEN",

  notes: undefined,
};
