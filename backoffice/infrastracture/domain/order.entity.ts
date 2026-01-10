import { BaseEntity } from "./base.entity";

export type OrderStatus = "pending" | "completed" | "cancelled" | "refunded";

export type TaxType = "dni" | "ruc" | "passport";

export type ProductOrderItemType = "store" | "listing";

export interface ProductOrderItem {
  type: ProductOrderItemType;
  product_id: string;
  name: string;
  price: number;
  currency: string;
}

export interface OrderItem {
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
