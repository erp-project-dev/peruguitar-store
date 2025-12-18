import { z } from "zod";

export const MerchantSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  last_name: z.string().min(1),
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  whatsapp: z.string().min(1),
  instagram: z.string().optional(),
});
