import { z } from "zod";
import { BaseSchema } from "./base.schema";

export const BrandSchema = z.object({
  ...BaseSchema,
  name: z.string().min(1, "Brand name is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
});
