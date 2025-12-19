import { z } from "zod";
import { BaseSchema } from "./base.schema";

export const SettingSchema = z.object({
  ...BaseSchema,

  value: z.string(),
  isPrivate: z.boolean(),
});
