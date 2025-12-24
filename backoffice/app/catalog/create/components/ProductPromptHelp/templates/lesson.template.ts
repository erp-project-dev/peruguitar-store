type ServicePromptVars = {
  serviceName: string;
  description?: string;
  notes?: string;
};

export function getLessonPromptTemplate({
  serviceName,
  description,
  notes,
}: ServicePromptVars): string {
  const template = `
NEW SERVICE — STRUCTURING PROMPT

PROVIDED DATA:
- Original service name:
[SERVICE_NAME]

- Base description (written by me):
[DESCRIPTION]

- Additional notes (optional):
[NOTES]

GENERAL RULES (MANDATORY):
- Use ONLY the provided information.
- DO NOT invent, assume, or add external information.
- If a value is not explicitly present, leave it EMPTY.
- Do NOT add opinions, marketing language, or guarantees.
- Do NOT include explanations or comments.
- Output must be ONLY the requested table.

GENERATE THE FOLLOWING:

1. Nombre final del servicio
   - Use the original service name
   - Remove redundant words only if necessary

2. Descripción corta
   - Based strictly on the base description
   - Maximum 150 characters
   - Do NOT invent capabilities or outcomes

3. Descripción extendida
   - Use only the provided information
   - Do NOT add steps, promises, or assumptions
   - Use Markdown starting from H3 headings, and keep the output between 200 and 2000 characters only if necessary.

4. Enfoque / especialidad
   - Extract ONLY if explicitly mentioned
   - Otherwise mark as EMPTY

OUTPUT FORMAT (MANDATORY):
- RESPOND ALWAYS IN SPANISH
- Return ONLY a table

| Campo | Valor | Estado |
Estado values:
- OK
- EMPTY
`;

  return template
    .replace("[SERVICE_NAME]", serviceName || "(empty)")
    .replace("[DESCRIPTION]", description || "(empty)")
    .replace("[NOTES]", notes || "(not provided)");
}
