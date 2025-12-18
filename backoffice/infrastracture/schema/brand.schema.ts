import { z } from "zod";

export const BrandSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Brand name is required"),
});
