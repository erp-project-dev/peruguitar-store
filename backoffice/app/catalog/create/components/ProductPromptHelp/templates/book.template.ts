type BookPromptVars = {
  productName: string;
  description?: string;
  techNotes?: string;
};

export function getBookPromptTemplate({
  productName,
  description,
  techNotes,
}: BookPromptVars): string {
  const template = `
NEW PRODUCT — BOOK STRUCTURING PROMPT

PROVIDED DATA:
- Original book title:
[PRODUCT_NAME]

- Base description (written by me):
[DESCRIPTION]

- Additional notes (optional):
[TECH_NOTES]

GENERAL RULES (MANDATORY):
- Use ONLY the provided information.
- DO NOT invent authors, publishers, years, formats, or ISBNs.
- If a value is not explicitly present, leave it null.
- Do NOT add opinions or marketing language.
- Do NOT include explanations or comments.
- Output must be ONLY the requested table.

GENERATE THE FOLLOWING:

1. Título final del libro
   - Use the original book title exactly as written
   - Do NOT modify wording, order, or capitalization

2. Descripción final
   - Based ONLY on the base description provided
   - Maximum 200 characters
   - Do NOT invent content or context

3. Ficha técnica (JSON)
   - Use only explicitly known data
   - Unknown fields must remain null
   - Return a valid MINIFIED JSON (single line)
   - This JSON will be deserialized in JavaScript

   JSON BASE:
   {
     "release_year": null,
     "language": null,
     "author": null,
     "publisher": null,
     "pages": null,
     "format": null,
     "isbn": null
   }

OUTPUT FORMAT (MANDATORY):
- RESPOND ALWAYS IN SPANISH
- Do NOT include comments or explanations
- Return ONLY a table with EXACTLY these columns:

| Campo | Valor | Estado |

Estado values:
- OK
- WARNING: <motivo>
- EMPTY
`;

  return template
    .replace("[PRODUCT_NAME]", productName || "(empty)")
    .replace("[DESCRIPTION]", description || "(empty)")
    .replace("[TECH_NOTES]", techNotes || "(not provided)");
}
