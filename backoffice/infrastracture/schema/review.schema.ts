import { z } from "zod";
import { BaseSchema } from "./base.schema";

export const ReviewSchema = z.object({
  ...BaseSchema,

  product_id: z.string().min(1, "Product is required"),
  product_name: z.string().min(1, "Product is required"),

  customer_id: z.string().min(1, "Customer is required"),
  customer_name: z.string().min(1, "Customer name is required"),

  comment: z.string().min(3, "Comment is too short"),

  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),

  review_date: z.string().datetime("Invalid review date"),
});
