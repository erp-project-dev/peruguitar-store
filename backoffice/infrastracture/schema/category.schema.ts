import { z } from "zod";
import { BaseSchema } from "./base.schema";

export const CategorySchema = z.object({
  ...BaseSchema,
  _id: z.string().min(1, "Category id is required"),
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Category description is required"),
});
