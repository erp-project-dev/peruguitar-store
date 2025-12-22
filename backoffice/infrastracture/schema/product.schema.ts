import { z } from "zod";
import { BaseSchema } from "./base.schema";
import { GuitarSpecsSchema, BookSpecsSchema } from "./product-specs.schema";

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

const SpecsByCategory: Record<string, z.ZodTypeAny> = {
  "electric-guitar": GuitarSpecsSchema,
  book: BookSpecsSchema,
};

export const ProductSchema = z
  .object({
    ...BaseSchema,

    category_id: z.string().min(1, "Category is required"),

    brand_id: z.string().min(1, "Brand is required").optional(),
    merchant_id: z.string().min(1, "Merchant is required"),
    type_id: z.string().optional(),

    condition: z.string().optional(),
    condition_score: z.number().int().min(1).max(5).optional(),

    name: z.string().min(1, "Name is required"),
    model: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    fullDescription: z.string().optional(),

    currency: z.string().min(1),
    price: z.number().min(0),
    priceType: z.string().min(1),

    specs: z.unknown(),

    images: ProductImagesSchema,

    is_enabled: z.boolean(),
    is_pinned: z.boolean(),

    publish_date: z.string().datetime(),
  })
  .superRefine((data, ctx) => {
    const schema = SpecsByCategory[data.category_id];

    if (!schema) {
      ctx.addIssue({
        path: ["category_id"],
        code: "custom",
        message: `Unsupported category '${data.category_id}'`,
      });
      return;
    }

    const result = schema.safeParse(data.specs);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({
          code: "custom",
          path: ["specs", ...issue.path],
          message: issue.message,
        });
      });
    }
  });
