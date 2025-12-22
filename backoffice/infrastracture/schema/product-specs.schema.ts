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
