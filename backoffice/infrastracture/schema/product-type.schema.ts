import { z } from "zod";

export const ProductTypeSchema = z.object({
  _id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
});
