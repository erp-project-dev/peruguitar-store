import { z } from "zod";
import { BaseSchema } from "./base.schema";
import {
  GuitarSpecsSchema,
  BookSpecsSchema,
  DigitalPedalboardSpecsSchema,
  PickSpecsSchema,
  TShirtSpecsSchema,
} from "./product-specs.schema";

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
        { message: "Invalid image format" }
      )
  )
  .max(6)
  .default([]);

const SpecsByCategory: Record<string, z.ZodTypeAny | null> = {
  "electric-guitar": GuitarSpecsSchema,
  book: BookSpecsSchema,
  "pedalboard-digital": DigitalPedalboardSpecsSchema,
  pick: PickSpecsSchema,
  tshirt: TShirtSpecsSchema,
};

export const ProductSchema = z
  .object({
    ...BaseSchema,

    category_id: z.string().min(1, "Category is required"),

    brand_id: z.string().min(1).optional(),
    merchant_id: z.string().min(1, "Merchant is required"),
    type_id: z.string().optional(),

    condition: z.string().optional(),
    condition_score: z.number().int().min(1).max(5).optional(),

    name: z.string().min(1, "Name is required"),
    model: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    fullDescription: z.string().optional(),

    currency: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    price_type: z.string().min(1).optional(),

    specs: z.unknown().optional(),

    externalVideoUrl: z.url().optional(),

    images: ProductImagesSchema,

    is_enabled: z.boolean(),
    is_pinned: z.boolean(),

    publish_date: z.string().datetime(),
  })
  .superRefine((data, ctx) => {
    const schema = SpecsByCategory[data.category_id];

    // categoría desconocida
    if (schema === undefined) {
      ctx.addIssue({
        path: ["category_id"],
        code: "custom",
        message: `Unsupported category '${data.category_id}'`,
      });
      return;
    }

    // categoría que NO usa specs (servicios)
    if (schema === null) {
      if (data.specs !== undefined) {
        ctx.addIssue({
          path: ["specs"],
          code: "custom",
          message: "This category does not support specs",
        });
      }
      return;
    }

    // categoría que SÍ requiere specs
    if (!data.specs) {
      ctx.addIssue({
        path: ["specs"],
        code: "custom",
        message: "Specs are required for this category",
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
