"use client";

import { sendClarityEvent } from "@/app/helpers/clarity.helper";
import { getInternationalPhone } from "@/app/helpers/merchant.helper";
import { getBasePath } from "@/app/helpers/path.helper";
import { ProductCurrency } from "@/app/types/product.type";

interface ProductCallToActionProps {
  merchantName: string;
  productId: string;
  productName: string;
  currency: ProductCurrency;
  price: number;
  whatsapp: string;
  country: string;
  priceType: "fixed" | "negotiable";
}

export default function ProductCallToAction({
  merchantName,
  productId,
  productName,
  currency,
  price,
  whatsapp,
  country,
  priceType,
}: ProductCallToActionProps) {
  const handleClick = () => {
    console.info("Contacting via WhatsApp", productName);

    sendClarityEvent("whatsapp_click");

    const message = encodeURIComponent(
      `
Hola ${merchantName}, estoy interesado en *${productName}* que encontré en *Peru Guitar*. ¿Sigue disponible?

ref: _${getBasePath(productId)}_`
    );

    const url = `https://wa.me/${getInternationalPhone(country, whatsapp, {
      withPlus: false,
    })}?text=${message}`;

    window.open(url, "_blank");
  };

  return (
    <section className="max-w-5xl mx-auto px-4 mt-5 mb-10">
      <div
        className="flex flex-col md:flex-row 
      items-center md:items-center 
      justify-center md:justify-between 
      text-center md:text-left 
      gap-10 p-10 rounded-xl bg-gray-800 shadow-xl border border-white/10"
      >
        <div>
          <p className="text-amber-400 font-bold text-5xl drop-shadow">
            {price.toLocaleString("es-PE", {
              minimumFractionDigits: 0,
              currency,
              style: "currency",
            })}
          </p>

          <p className="text-white/80 font-medium text-2xl mt-2">
            {priceType === "fixed" ? "Precio fijo" : "Precio negociable"}
          </p>
        </div>

        <button
          onClick={handleClick}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-4 rounded-lg bg-[#25D366] hover:bg-[#1EBE58] text-black font-bold text-lg shadow-lg transition-all hover:scale-[1.03] cursor-pointer"
        >
          Contactar por WhatsApp
        </button>
      </div>
    </section>
  );
}
