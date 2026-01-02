"use client";

import { sendClarityEvent } from "@/features/helpers/clarity.helper";
import { getBasePath } from "@/features/helpers/path.helper";
import { getWhatsappLink } from "@/features/helpers/merchant.helper";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";

interface ProductWhatsappButtonProps {
  phoneNumber: string;
  merchantName: string;
  merchantCountry: string;
  productId: string;
  productName: string;
  className?: string;
  disabled: boolean;
}

export default function ProductWhatsappButton({
  phoneNumber,
  merchantName,
  merchantCountry,
  productId,
  productName,
  className,
  disabled,
}: ProductWhatsappButtonProps) {
  const handleClick = () => {
    if (disabled) return;

    sendClarityEvent("whatsapp_click");

    const message = `
Hola ${merchantName}, estoy interesado en *${productName}* que encontré en *Peru Guitar*. ¿Sigue disponible?
ref: ${getBasePath(productId)}
`;

    window.open(
      getWhatsappLink(merchantCountry, phoneNumber, message),
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={
        className ??
        `
        w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition
        ${
          disabled
            ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
            : "bg-[#25D366] text-black hover:brightness-95 cursor-pointer"
        }
      `
      }
    >
      <SiWhatsapp className="w-5 h-5" />
      {disabled ? "Producto vendido" : "Contactar por WhatsApp"}
    </button>
  );
}
