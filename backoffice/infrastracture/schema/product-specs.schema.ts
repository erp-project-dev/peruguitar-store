import { z } from "zod";

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

export const BookSpecsSchema = z.object({
  author: z.string().min(1),
  publisher: z.string().nullable(),
  release_year: z.number().int().nullable(),
  pages: z.number().int().positive().nullable(),
  language: z.string().nullable(),
  isbn: z.string().nullable(),
});

export const PickSpecsSchema = z.object({
  origin: z.string().nullable(),
  release_year: z.number().int().nullable(),
  material: z.string().nullable(),
  thickness_mm: z.number().nullable(),
  shape: z.string().nullable(),
  size: z.string().nullable(),
  grip: z.boolean().nullable(),
  finish: z.string().nullable(),
  flexibility: z.enum(["soft", "medium", "hard"]).nullable(),
  color: z.string().nullable(),
  pack_quantity: z.number().int().nullable(),
});

export const DigitalPedalboardSpecsSchema = z.object({
  brand: z.string().nullable(),
  model: z.string().nullable(),

  processing_type: z.string().nullable(),
  effects_count: z.number().int().nullable(),
  amp_models: z.boolean().nullable(),

  inputs: z.number().int().nullable(),
  outputs: z.number().int().nullable(),
  midi: z.boolean().nullable(),
  expression_pedal: z.boolean().nullable(),

  connectivity: z.string().nullable(),
  power_type: z.string().nullable(),

  color: z.string().nullable(),
  made_in: z.string().nullable(),
});

export const TShirtSpecsSchema = z.object({
  material: z.string().nullable(),
  fabric_weight_gsm: z.number().nullable(),
  fit: z.enum(["regular", "slim", "oversize"]).nullable(),
  size: z.string().nullable(),
  color: z.string().nullable(),
  print_type: z.string().nullable(),
  collar_type: z.string().nullable(),
  sleeve_type: z.string().nullable(),
  unisex: z.boolean().nullable(),
  made_in: z.string().nullable(),
});
