import { z } from "zod";
import { BaseSchema } from "./base.schema";

export const CustomerSchema = z
  .object({
    ...BaseSchema,

    type: z.enum(["individual", "company"]),

    tax_id: z.string().min(1).optional(),
    tax_type: z.enum(["dni", "ruc", "passport"]).optional(),

    name: z.string().min(1),
    last_name: z.string().min(1).optional(),

    country: z.string().min(1),
    state: z.string().min(1).optional(),
    city: z.string().min(1).optional(),

    phone: z.string().min(1).optional(),
    email: z.email(),
  })

  .refine(
    (data) =>
      data.type === "company" ||
      (data.type === "individual" && !!data.last_name),
    {
      path: ["last_name"],
      message: "Last name is required for individual customers",
    }
  )
  .refine(
    (data) =>
      data.type === "individual" ||
      (data.type === "company" && !data.last_name),
    {
      path: ["last_name"],
      message: "Last name must be empty for company customers",
    }
  );
