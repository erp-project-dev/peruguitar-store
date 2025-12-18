import { z } from "zod";

export const BaseSchema = {
  _id: z.string(),
  created_at: z.date(),
  updated_at: z.date().optional(),
};
