import { z } from "zod";
import { BaseSchema } from "./base.schema";

export const GuitarSpecsSchema = z.object({
  release_year: z.number().int().nullable(),
  origin: z.string().nullable(),

  body_wood: z.string().nullable(),
  body_finish: z.string().nullable(),
  body_type: z.string().nullable(),

  neck_wood: z.string().nullable(),
  fingerboard_wood: z.string().nullable(),

  scale_length_mm: z.number().nullable(),
  number_of_strings: z.number().int().nullable(),

  hand_orientation: z.enum(["right", "left"]).nullable(),

  color: z.string().nullable(),
  bridge_type: z.string().nullable(),
  pickups: z.string().nullable(),
  hardware_color: z.string().nullable(),
});

export const ProductImagesSchema = z
  .array(
    z
      .string()
      .min(1)
      .refine(
        (v) =>
          [".jpg", ".jpeg", ".png", ".webp", ".gif"].some((ext) =>
            v.toLowerCase().trim().endsWith(ext)
          ),
        {
          message: "Invalid image format",
        }
      )
  )
  .max(6)
  .default([]);

export const ProductSchema = z.object({
  ...BaseSchema,

  category: z.string().min(1, "Category is required"),

  brand_id: z.string().min(1, "Brand is required"),
  merchant_id: z.string().min(1, "Merchant is required"),
  type_id: z.string().min(1, "Type is required"),

  condition: z.string().min(1, "Condition is required"),
  condition_score: z.number().int().min(1).max(5),

  publish_date: z.string().datetime(),

  name: z.string().min(1, "Name is required"),
  model: z.string().min(1, "Model is required"),
  description: z.string().min(1, "Description is required"),

  currency: z.string().min(1),
  price: z.number().min(0),
  priceType: z.string().min(1),

  specs: GuitarSpecsSchema,
  images: ProductImagesSchema,

  is_enabled: z.boolean(),
  is_pinned: z.boolean(),
});
