export function getCatalogImagePath(
  username: string,
  filename: string
): string {
  return `/catalog/${username}/${filename}`;
}

export function translateProductStatus(status: string): string {
  switch (status) {
    case "new":
      return "Nuevo";
    case "like_new":
      return "Como nuevo";
    default:
      return status;
  }
}

export function translateProductSpec(spec: string): string {
  switch (spec) {
    case "release_year":
      return "Año de lanzamiento";
    case "origin":
      return "Origen";

    case "body_wood":
      return "Madera del cuerpo";
    case "body_finish":
      return "Acabado del cuerpo";
    case "body_type":
      return "Tipo de cuerpo";

    case "neck_wood":
      return "Madera del mástil";
    case "fingerboard_wood":
      return "Madera del diapasón";

    case "scale_length_mm":
      return "Escala (mm)";
    case "number_of_strings":
      return "Número de cuerdas";

    case "hand_orientation":
      return "Orientación";

    case "color":
      return "Color";
    case "bridge_type":
      return "Puente";
    case "pickups":
      return "Pastillas";
    case "hardware_color":
      return "Color de herrajes";

    default:
      return spec.replace(/_/g, " ");
  }
}
