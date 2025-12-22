type GuitarPromptVars = {
  productName: string;
  description?: string;
  techNotes?: string;
  brands: string[];
  types: string[];
};

export function getGuitarPromptTemplate({
  productName,
  description,
  techNotes,
  brands,
  types,
}: GuitarPromptVars): string {
  const brandList =
    brands.length > 0 ? brands.map((b) => `- ${b}`).join("\n") : "(none)";

  const typeList =
    types.length > 0 ? types.map((t) => `- ${t}`).join("\n") : "(none)";

  const template = `
NEW PRODUCT — STRUCTURING PROMPT

PROVIDED DATA:
- Original product name:
[PRODUCT_NAME]

- Base description (written by me):
[DESCRIPTION]

- Additional technical notes (optional):
[TECH_NOTES]

EXISTING CATALOG DATA (FOR VALIDATION):

Available brands:
[BRANDS]

Available product types:
[TYPES]

GENERAL RULES (MANDATORY):
- Use ONLY the provided information.
- DO NOT invent, assume, or add external information.
- If a value is not explicitly present, leave it empty or null.
- Do NOT infer technical specifications.
- Do NOT add opinions or marketing language.
- Do NOT include explanations or comments.
- Output must be ONLY the requested table.

GENERATE THE FOLLOWING:

1. Marca
   Extract the brand directly from the original product name.
   Validate against the available brands list.
   If it does not exist, mark as WARNING.

2. Modelo
   Extract the exact model exactly as written in the original product name.

3. Nombre final del producto
   Build using:
   - Marca
   - Modelo

4. Descripción final
   - Based on the base description
   - Maximum 150 characters
   - Do NOT invent features

5. Ficha técnica (JSON)
   - Use only explicitly known data
   - Unknown fields must remain null
   - Return a valid MINIFIED JSON

   JSON BASE:
   {
     "release_year": null,
     "origin": null,
     "body_wood": null,
     "body_finish": null,
     "body_type": null,
     "neck_wood": null,
     "fingerboard_wood": null,
     "scale_length_mm": null,
     "number_of_strings": null,
     "hand_orientation": null,
     "color": null,
     "bridge_type": null,
     "pickups": null,
     "hardware_color": null
   }

6. Tipo de cualidad
   standard | high_end | signature | rare | limited | vintage | handcrafted | boutique

OUTPUT FORMAT (MANDATORY):
- RESPOND ALWAYS IN SPANISH
- Return ONLY a table

| Campo | Valor | Estado |
Estado values:
- OK
- WARNING: <motivo>
- EMPTY
`;

  return template
    .replace("[PRODUCT_NAME]", productName || "(empty)")
    .replace("[DESCRIPTION]", description || "(empty)")
    .replace("[TECH_NOTES]", techNotes || "(not provided)")
    .replace("[BRANDS]", brandList)
    .replace("[TYPES]", typeList);
}
