import { z } from "zod";

export const SettingSchema = z.object({
  _id: z.string(),
  value: z.string(),
});
