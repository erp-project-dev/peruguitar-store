import { translateProductStatus } from "@/app/helpers/product.helper";

interface PurchaseInfoProps {
  merchantName: string;
  productName: string;
  price: number;
  status: string;
  score: number;
  whatsapp: string;
}

export default function PurchaseInfo({
  merchantName,
  productName,
  price,
  status,
  score,
  whatsapp,
}: PurchaseInfoProps) {
  const message = encodeURIComponent(
    `Hola ${merchantName}, estoy interesado en "${productName} que encontré en Peru Guitar". ¿Sigue disponible?`
  );

  return (
    <section className="max-w-5xl mx-auto px-4 mt-20 mb-10">
      <div
        className="flex flex-col md:flex-row 
            items-center md:items-start 
            justify-center md:justify-between 
            text-center md:text-left 
            gap-10 p-10 rounded-xl bg-gray-800 shadow-xl border border-white/10"
      >
        <div>
          <p className="text-amber-400 font-bold text-5xl drop-shadow">
            {price.toLocaleString("es-PE", {
              minimumFractionDigits: 0,
              currency: "PEN",
              style: "currency",
            })}
          </p>

          <p className="text-green-300 font-semibold text-xl mt-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
            {translateProductStatus(status)} ({score}/5)
          </p>
        </div>

        <a
          href={`https://wa.me/${whatsapp}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-4 rounded-lg bg-[#25D366] hover:bg-[#1EBE58] text-black font-bold text-lg shadow-lg transition-all hover:scale-[1.03]"
        >
          Contactar por WhatsApp
        </a>
      </div>
    </section>
  );
}
