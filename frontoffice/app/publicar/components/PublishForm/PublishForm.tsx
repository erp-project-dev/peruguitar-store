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

  const showPrice = category !== "service" && category !== "";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-600 md:col-span-2"
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
            className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-600 md:col-span-2"
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
            className={`
            w-full px-4 py-4 bg-white border border-gray-300 rounded-xl
            outline-none focus:ring-2 focus:ring-gray-600
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
              className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-600"
            />
          )}
        </div>

        <button
          type="submit"
          className="block w-full text-center bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-xl text-lg font-medium text-white cursor-pointer"
        >
          Contactar por WhatsApp
        </button>
      </form>
    )
  );
}
