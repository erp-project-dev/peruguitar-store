import { z } from "zod";
import { BaseSchema } from "./base.schema";

export const OrderItemSchema = z.object({
  type: z.enum(["store", "listing"]),
  product_id: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

export const OrderSchema = z.object({
  ...BaseSchema,

  status: z.enum(["pending", "refunded", "cancelled", "completed"]),

  customer_id: z.string().min(1),
  customer_name: z.string().min(1),

  tax_id: z.string().min(1).optional(),
  tax_type: z.enum(["dni", "ruc", "passport"]).optional(),

  items: z.array(OrderItemSchema).min(1),

  currency: z.string().min(1),
  subtotal: z.number().nonnegative(),
  total: z.number().nonnegative(),

  notes: z.string().optional(),
});
