import { z } from "zod";
import { BaseSchema } from "./base.schema";

export const ProductTypeSchema = z.object({
  ...BaseSchema,
  _id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  category_id: z.string().min(1, "CategoryId is required"),
});
