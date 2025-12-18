"use client";

import { SettingGetCommand } from "@/features/commands/settings/index.command";
import { getWhatsappLink } from "@/features/helpers/merchant.helper";

export default function PublishForm() {
  const WHATSAPP_NUMBER = SettingGetCommand.handle().publishNumber;

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

    const productPrice = (
      form.elements.namedItem("productPrice") as HTMLInputElement
    ).value;

    const message = `
Hola, te escribe *${merchantName}*. Deseo publicar un instrumento en Peru Guitar.

- *Modelo:* ${productName}  
- *Precio:* S/ ${productPrice}

Confirmo que mi instrumento cumple con los criterios de exclusividad de Peru Guitar  
(_gama alta, boutique, rareza o modelo rebuscado_).

Quedo atento a tus indicaciones para continuar.
    `.trim();

    window.open(getWhatsappLink("peru", WHATSAPP_NUMBER, message), "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          placeholder="Nombre del instrumento"
          required
          maxLength={100}
          className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-600"
        />

        <input
          name="productPrice"
          type="number"
          placeholder="Precio (S/)"
          required
          maxLength={6}
          className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-600"
        />
      </div>

      <button
        type="submit"
        className="block w-full text-center bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-xl text-lg font-medium text-white cursor-pointer"
      >
        Contactar por WhatsApp
      </button>
    </form>
  );
}
