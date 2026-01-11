import { z } from "zod";
import { BaseSchema } from "./base.schema";

export const MerchantSchema = z.object({
  ...BaseSchema,
  email: z.string().email(),
  name: z.string().min(1),
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  whatsapp: z.string().min(1),
  instagram: z.string().optional(),
});
