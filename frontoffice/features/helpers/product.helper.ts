// -----------------------------
// Paths

import { PriceType } from "../types/product.type";

// -----------------------------
export function getCatalogImagePath(filename: string): string {
  return `/catalog/${filename}`;
}

// -----------------------------
// Product status
// -----------------------------
export function translateProductCondition(status: string): string {
  const map: Record<string, string> = {
    new: "Nuevo",
    like_new: "Como nuevo",
  };

  return map[status] ?? status;
}

// -----------------------------
// Status score
// -----------------------------
export function translateProductConditionScore(score: number): string {
  const map: Record<number, string> = {
    5: "El producto se encuentra en excelente estado. Muy bien cuidado y con un desgaste mínimo o prácticamente imperceptible.",
    4: "El producto está en muy buen estado. Presenta un uso normal y algún detalle menor propio del tiempo, sin afectar su funcionamiento.",
    3: "El producto está en buen estado. Muestra signos de uso visibles, pero funciona correctamente y no presenta inconvenientes relevantes.",
    2: "El producto se encuentra en estado regular. Tiene desgaste evidente y podría requerir algún ajuste o mantenimiento ligero.",
    1: "El producto está en estado básico. Presenta desgaste notable y podría necesitar mantenimiento o reparaciones adicionales.",
  };

  return map[score] ?? "Sin información del estado.";
}

// -----------------------------
// Product specs
// -----------------------------
export function translateProductSpec(spec: string): string {
  const map: Record<string, string> = {
    release_year: "Año de lanzamiento",
    origin: "Origen",

    body_wood: "Madera del cuerpo",
    body_finish: "Acabado del cuerpo",
    body_type: "Tipo de cuerpo",

    neck_wood: "Madera del mástil",
    fingerboard_wood: "Madera del diapasón",

    scale_length_mm: "Escala (mm)",
    number_of_strings: "Número de cuerdas",

    hand_orientation: "Orientación",

    color: "Color",
    bridge_type: "Puente",
    pickups: "Pastillas",
    hardware_color: "Color de herrajes",
  };

  return map[spec] ?? spec.replace(/_/g, " ");
}

export function translatePriceType(type: PriceType): string {
  switch (type) {
    case "fixed":
      return "Precio fijo";

    case "negotiable":
      return "Precio negociable";

    default:
      return type;
  }
}
