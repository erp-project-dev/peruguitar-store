import { z } from "zod";
import { BaseSchema } from "./base.schema";

export const UserSchema = z.object({
  ...BaseSchema,

  name: z.string().min(1, "Name is required"),
  last_name: z.string().min(1, "Last name is required"),

  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),

  role: z.enum(["admin", "editor"]),
  enabled: z.boolean(),

  last_login_at: z.date().optional(),
});
