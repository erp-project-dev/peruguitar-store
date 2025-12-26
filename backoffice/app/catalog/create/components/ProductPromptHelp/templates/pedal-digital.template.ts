type PedalDigitalPromptVars = {
  name: string;
  description?: string;
  notes?: string;
  brands: string[];
};

export function getPedalDigitalPromptTemplate({
  name,
  description,
  notes,
  brands,
}: PedalDigitalPromptVars): string {
  const brandList =
    brands.length > 0 ? brands.map((b) => `- ${b}`).join("\n") : "(none)";

  const template = `
NEW PRODUCT — DIGITAL PEDALBOARD STRUCTURING PROMPT

PROVIDED DATA:
- Original product name:
[NAME]

- Base description (written by me):
[DESCRIPTION]

- Additional technical notes (optional):
[NOTES]

EXISTING CATALOG DATA (FOR VALIDATION):

Available brands:
[BRANDS]

GENERAL RULES (MANDATORY):
- Use ONLY the provided information.
- DO NOT invent, assume, or add external information.
- If a value is not explicitly present, leave it empty or null.
- Do NOT infer unsupported technical specifications.
- Do NOT add opinions or marketing language.
- Do NOT include explanations or comments.
- Output must be ONLY the requested table.

GENERATE THE FOLLOWING:

1. Marca
   - Extract the brand directly from the original product name.
   - Validate against the available brands list.
   - If it does not exist, mark as WARNING.

2. Modelo
   - Extract the exact model exactly as written in the original product name.

3. Nombre final del producto
   - Build using:
     - Marca
     - Modelo

4. Descripción final
   - Based on the base description
   - Maximum 150 characters
   - Do NOT invent features or usage

5. Ficha técnica (JSON)
   - Use only explicitly known data
   - Unknown fields must remain null
   - Return a valid MINIFIED JSON

   JSON BASE:
   {
     "brand": null,
     "model": null,
     "processing_type": null,
     "effects_count": null,
     "amp_models": null,
     "inputs": null,
     "outputs": null,
     "midi": null,
     "expression_pedal": null,
     "connectivity": null,
     "power_type": null,
     "color": null,
     "made_in": null
   }

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
    .replace("[NAME]", name || "(empty)")
    .replace("[DESCRIPTION]", description || "(empty)")
    .replace("[NOTES]", notes || "(not provided)")
    .replace("[BRANDS]", brandList);
}
