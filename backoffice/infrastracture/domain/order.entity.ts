import { BaseEntity } from "./base.entity";

export type OrderStatus = "pending" | "completed" | "cancelled" | "refunded";

export type TaxType = "dni" | "ruc" | "passport";

export type OrderItemType = "store" | "listing";

export interface OrderItem {
  type: OrderItemType;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order extends BaseEntity {
  status: OrderStatus;

  customer_id: string;
  customer_name: string;

  tax_id?: string;
  tax_type?: TaxType;

  items: OrderItem[];

  currency: string;
  subtotal: number;
  total: number;

  notes?: string;
}
