/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

import { CategoryGetCommand } from "@/features/commands/category/index.command";
import { SettingGetCommand } from "@/features/commands/settings/index.command";
import { getWhatsappLink } from "@/features/helpers/merchant.helper";
import { getQueryStringParam } from "@/features/helpers/query.helper";
import { getMessageTemplate } from "./message.template";

export default function PublishForm() {
  const categories = CategoryGetCommand.handle({
    onlyParents: true,
    onlyInCatalog: true,
  });

  const WHATSAPP_NUMBER = SettingGetCommand.handle().publishNumber;

  const [isReady, setIsReady] = useState(false);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    setCategory(getQueryStringParam("category") ?? "");
    setIsReady(true);
  }, []);

  const hasCategory = category !== "";
  const showPrice = hasCategory && category !== "service";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    const merchantName = (
      form.elements.namedItem("merchantName") as HTMLInputElement
    ).value;

    const productName = (
      form.elements.namedItem("productName") as HTMLInputElement
    ).value;

    const productPriceInput = form.elements.namedItem(
      "productPrice"
    ) as HTMLInputElement | null;

    const productPrice = productPriceInput?.value;

    const message = getMessageTemplate({
      merchantName,
      productName,
      productPrice,
      showPrice,
    });

    window.open(getWhatsappLink("peru", WHATSAPP_NUMBER, message), "_blank");
  };

  return (
    isReady && (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <select
            name="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 outline-none focus:ring-2 focus:ring-gray-600 md:col-span-2"
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            name="merchantName"
            type="text"
            placeholder="Tu nombre completo"
            required
            maxLength={100}
            disabled={!hasCategory}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 outline-none focus:ring-2 focus:ring-gray-600 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
          />

          <input
            name="productName"
            type="text"
            placeholder={
              category === "service"
                ? "Nombre del servicio"
                : "Nombre del producto"
            }
            required
            maxLength={100}
            disabled={!hasCategory}
            className={`
              w-full rounded-xl border border-gray-300 bg-white px-4 py-4
              outline-none focus:ring-2 focus:ring-gray-600
              disabled:cursor-not-allowed disabled:opacity-50
              ${category === "service" ? "md:col-span-2" : ""}
            `}
          />

          {showPrice && (
            <input
              name="productPrice"
              type="number"
              placeholder="Precio (S/)"
              min={0}
              max={999999}
              required
              disabled={!hasCategory}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 outline-none focus:ring-2 focus:ring-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={!hasCategory}
          className="block w-full cursor-pointer rounded-xl bg-green-600 px-6 py-3 text-center text-lg font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Contactar por WhatsApp
        </button>
      </form>
    )
  );
}
