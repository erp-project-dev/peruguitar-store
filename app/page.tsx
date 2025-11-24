export const metadata = {
  title: "Peru Guitar – Marketplace de Guitarras en Perú",
  description:
    "Publica, descubre y encuentra guitarras en venta en Perú. Marketplace gratuito con fotos, especificaciones y contacto directo por WhatsApp.",
};

import Catalog from "./components/catalog/Catalog";

export default function Home() {
  return <Catalog />;
}
