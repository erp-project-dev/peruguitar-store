// -----------------------------
// Paths
// -----------------------------
export function getCatalogImagePath(
  username: string,
  filename: string
): string {
  return `/catalog/${username}/${filename}`;
}

// -----------------------------
// Product status
// -----------------------------
export function translateProductStatus(status: string): string {
  const map: Record<string, string> = {
    new: "Nuevo",
    like_new: "Como nuevo",
  };

  return map[status] ?? status;
}

// -----------------------------
// Status score
// -----------------------------
export function translateStatusScore(score: number): string {
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

// -----------------------------
// Product type
// -----------------------------
export function translateProductType(type: string): string {
  const map: Record<string, string> = {
    standard: "Estándar",
    high_end: "Serie alta",
    signature: "Signature",
    rare: "Rareza",
    limited: "Edición limitada",
    vintage: "Vintage",
    handcrafted: "Hecho a mano",
    boutique: "Boutique",
  };

  return map[type] ?? type;
}

export function explainProductType(type: string): string {
  const map: Record<string, string> = {
    standard:
      "Modelo de producción regular dentro del catálogo del fabricante, pensado para una disponibilidad amplia y uso general.",

    high_end:
      "Serie alta de una marca reconocida, con mejores materiales, acabados cuidados y especificaciones por encima de los modelos estándar.",

    signature:
      "Modelo asociado a un artista específico, desarrollado en colaboración y ajustado a sus preferencias musicales y técnicas.",

    rare: "Modelo poco común y difícil de encontrar en el mercado actual, valorado por su escasez, características especiales o contexto particular.",

    limited:
      "Edición especial o conmemorativa producida en cantidades limitadas, creada para marcar un momento o una serie específica.",

    vintage:
      "Instrumento de una época pasada, representativo de su periodo y apreciado por su valor histórico y carácter distintivo.",

    handcrafted:
      "Instrumento realizado de forma artesanal o personalizada, con intervención directa de un luthier en su construcción o modificación.",

    boutique:
      "Instrumento producido por una marca boutique o en series pequeñas, con atención especial al detalle y a la calidad final.",
  };

  return map[type] ?? "";
}
