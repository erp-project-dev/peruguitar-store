"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import Input from "@/app/components/Form/Input";
import Button from "@/app/components/Form/Button";
import { Field } from "@/app/components/Form/Field";

export type PromptHelperOption = {
  label: string;
  value: string;
  description?: string;
};

/* ----------------------------------------
 * Prompt sections
 * ------------------------------------- */

function sectionProvidedData(
  name: string,
  description: string,
  techNotes: string
) {
  return `PROVIDED DATA:
- Original product name:
${name || "(empty)"}

- Base description (written by me):
${description || "(empty)"}

- Additional technical notes (optional):
${techNotes || "(not provided)"}
`;
}

function sectionCatalogValidation(
  brands: PromptHelperOption[],
  types: PromptHelperOption[]
) {
  const brandList = brands.map((b) => `- ${b.label}`).join("\n") || "(none)";
  const typeList = types.map((t) => `- ${t.label}`).join("\n") || "(none)";

  return `EXISTING CATALOG DATA (FOR VALIDATION):

Available brands:
${brandList}

Available product types:
${typeList}
`;
}

function sectionRules() {
  return `GENERAL RULES (MANDATORY):
- Use ONLY the provided information.
- DO NOT invent, assume, or add external information.
- If a value is not explicitly present, leave it empty or null.
- Do NOT infer technical specifications.
- Do NOT add opinions or marketing language.
- Do NOT include explanations or comments.
- Output must be ONLY the requested table.
`;
}

function sectionTasks() {
  return `GENERATE THE FOLLOWING:

1. Marca
   Extract the brand directly from the original product name.
   Validate against the available brands list.
   If it does not exist, mark as WARNING.

2. Modelo
   Extract the exact model exactly as written in the original product name.
   Do not abbreviate or reinterpret.

3. Nombre final del producto
   Build using:
   - Marca
   - Modelo
   Keep the natural order, no extra text.

4. Descripción final
   - Based on the base description provided
   - Complement ONLY with explicit information from name or notes
   - Maximum 150 characters
   - Do NOT invent features

5. Ficha técnica (JSON)
   - Use only explicitly known data
   - Unknown fields must remain null
   - Return a valid MINIFIED JSON (single line)
   - This JSON will be deserialized in JavaScript
   - Expose the data as CODE to easy copy

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
   Choose ONLY ONE of the following values:
   standard | high_end | signature | rare | limited | vintage | handcrafted | boutique

   - Base the choice ONLY on the provided data
   - Do NOT assume rarity, exclusivity, or quality
`;
}

function sectionOutputFormat() {
  return `OUTPUT FORMAT (MANDATORY):
- RESPOND ALWAYS IN SPANISH
- Do NOT include comments or explanations
- Return ONLY a table with EXACTLY these columns:

| Campo | Valor | Estado |

Estado values:
- OK
- WARNING: <motivo>
- EMPTY
`;
}

function buildProductPrompt(
  name: string,
  description: string,
  techNotes: string,
  brands: PromptHelperOption[],
  types: PromptHelperOption[]
) {
  return `NEW PRODUCT — STRUCTURING PROMPT

${sectionProvidedData(name, description, techNotes)}

${sectionCatalogValidation(brands, types)}

${sectionRules()}

${sectionTasks()}

${sectionOutputFormat()}`;
}

/* ----------------------------------------
 * Component
 * ------------------------------------- */

type ProductPromptHelpProps = {
  brands: PromptHelperOption[];
  types: PromptHelperOption[];
};

export default function ProductPromptHelp({
  brands,
  types,
}: ProductPromptHelpProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techNotes, setTechNotes] = useState("");

  const prompt = useMemo(
    () => buildProductPrompt(name, description, techNotes, brands, types),
    [name, description, techNotes, brands, types]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied");
  };

  return (
    <div className="space-y-6 rounded-md border border-neutral-300 bg-neutral-200 p-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-neutral-800">
          Prompt Helper
        </h2>
        <p className="text-sm text-neutral-600">
          Generate a validated AI prompt using live catalog data
        </p>
      </div>

      <div className="space-y-5">
        <Field label="Original product name">
          <Input
            value={name}
            onChange={(v) => setName(v)}
            placeholder="e.g. Fender Stratocaster American Special 2013"
          />
        </Field>

        <Field label="Base description">
          <Input
            type="textarea"
            rows={4}
            value={description}
            onChange={(v) => setDescription(v)}
          />
        </Field>

        <Field label="Additional technical notes (optional)">
          <Input
            type="textarea"
            rows={4}
            value={techNotes}
            onChange={(v) => setTechNotes(v)}
          />
        </Field>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          icon={Copy}
          onClick={handleCopy}
          disabled={!name && !description && !techNotes}
          size="lg"
        >
          Copy prompt
        </Button>
      </div>
    </div>
  );
}
