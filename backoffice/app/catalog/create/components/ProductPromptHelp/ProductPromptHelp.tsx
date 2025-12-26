"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import Input from "@/app/components/Form/Input";
import Button from "@/app/components/Form/Button";
import { Field } from "@/app/components/Form/Field";

import { getBookPromptTemplate } from "./templates/book.template";
import { getGuitarPromptTemplate } from "./templates/electric-guitar.template";
import { getLessonPromptTemplate } from "./templates/lesson.template";

import { CategoryId } from "@/infrastracture/domain/category.entity";
import { getPedalDigitalPromptTemplate } from "./templates/pedal-digital.template";

type ProductPromptHelpProps = {
  category: CategoryId;
  brands?: string[];
  types?: string[];
};

export default function ProductPromptHelp({
  category,
  brands = [],
  types = [],
}: ProductPromptHelpProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const prompt = useMemo(() => {
    if (!category) return "";

    const templateInput = {
      name,
      description,
      notes,
    };

    if (category === "book") {
      return getBookPromptTemplate(templateInput);
    }

    if (category === "lesson") {
      return getLessonPromptTemplate(templateInput);
    }

    if (category === "pedalboard-digital") {
      return getPedalDigitalPromptTemplate({
        ...templateInput,
        brands,
      });
    }

    return getGuitarPromptTemplate({
      ...templateInput,
      brands,
      types,
    });
  }, [category, name, description, notes, brands, types]);

  const handleCopy = async () => {
    if (!prompt) return;
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
          Generate an AI prompt based on the selected category
        </p>
      </div>

      {/* ---------- INPUTS (shared for all categories) ---------- */}
      <div className="space-y-5">
        <Field label="Original product name">
          <Input
            value={name}
            onChange={setName}
            placeholder={
              category === "book"
                ? "e.g. The Pragmatic Programmer"
                : "e.g. Fender Stratocaster American Special 2013"
            }
          />
        </Field>

        <Field label="Base description">
          <Input
            type="textarea"
            rows={4}
            value={description}
            onChange={setDescription}
          />
        </Field>

        <Field label="Additional notes (optional)">
          <Input type="textarea" rows={4} value={notes} onChange={setNotes} />
        </Field>
      </div>

      {/* ---------- ACTION ---------- */}
      <div className="flex justify-end pt-2">
        <Button icon={Copy} onClick={handleCopy} disabled={!prompt} size="lg">
          Copy prompt
        </Button>
      </div>
    </div>
  );
}
