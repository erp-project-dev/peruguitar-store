import { SettingsHandler } from "../handlers/settings/index.handler";

export const metadata = {
  title: "Publica tu instrumento | Peru Guitar",
  description:
    "Publica tu instrumento musical en Peru Guitar. Contáctate con el administrador para coordinar la publicación.",
};

export default function Publish() {
  const WHATSAPP_NUMBER = SettingsHandler().publishNumber;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola, deseo publicar un instrumento en Peru Guitar."
  )}`;

  return (
    <section className="w-full flex justify-center px-4 py-12">
      <div className="max-w-3xl space-y-10">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold">Publica tu instrumento</h1>

          <p className="text-lg text-gray-700">
            Publicar en <strong>Peru Guitar</strong> es rápido y directo.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">¿Cómo funciona?</h2>

          <ul className="space-y-2 text-gray-700">
            <li>• Envías un mensaje al administrador.</li>
            <li>• Coordinamos fotos, detalles y precio.</li>
            <li>• Publicamos tu instrumento en el catálogo.</li>
          </ul>

          <p className="text-sm text-gray-500">
            No participamos en transacciones. Solo damos exposición a tu
            anuncio.
          </p>
        </div>

        <a
          href={whatsappUrl}
          className="block w-full text-center bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-xl text-lg font-medium text-white"
        >
          Contactar por WhatsApp
        </a>
      </div>
    </section>
  );
}
