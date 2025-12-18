"use client";

import { MessageCircle } from "lucide-react";

import { sendClarityEvent } from "@/features/helpers/clarity.helper";
import { getBasePath } from "@/features/helpers/path.helper";
import { getWhatsappLink } from "@/features/helpers/merchant.helper";

interface ProductWhatsappButtonProps {
  phoneNumber: string;
  merchantName: string;
  merchantCountry: string;
  productId: string;
  productName: string;
  className?: string;
}

export default function ProductWhatsappButton({
  phoneNumber,
  merchantName,
  merchantCountry,
  productId,
  productName,
  className,
}: ProductWhatsappButtonProps) {
  const handleClick = () => {
    sendClarityEvent("whatsapp_click");

    const message = `
Hola ${merchantName}, estoy interesado en *${productName}* que encontré en *Peru Guitar*. ¿Sigue disponible?

ref: _${getBasePath(productId)}_
`;

    window.open(
      getWhatsappLink(merchantCountry, phoneNumber, message),
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className={
        className ??
        "w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#25D366] text-black font-bold hover:brightness-95 transition cursor-pointer"
      }
    >
      <MessageCircle className="w-5 h-5" />
      Contactar por WhatsApp
    </button>
  );
}
