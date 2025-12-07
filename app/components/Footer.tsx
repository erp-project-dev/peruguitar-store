import { SettingsHandler } from "../handlers/settings/index.handler";

export default function Footer() {
  const { whatsappLinks, instagram } = SettingsHandler();

  return (
    <footer className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4 text-neutral-600">
        <p>
          © {new Date().getFullYear()} Peru Guitar — Todos los derechos
          reservados.
        </p>

        <p className="-mt-4 italic">Marketplace exclusivo de guitarras</p>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <a href={whatsappLinks.store} className="hover:text-black transition">
            Grupo de compra y venta
          </a>

          <span className="hidden sm:inline text-neutral-400">•</span>

          <a
            href={whatsappLinks.community}
            className="hover:text-black transition"
          >
            Comunidad oficial
          </a>

          <span className="hidden sm:inline text-neutral-400">•</span>

          <a href={instagram} className="hover:text-black transition">
            Instagram oficial
          </a>

          <span className="hidden sm:inline text-neutral-400">•</span>

          <a
            href="https://instagram.com/erpprojectofficial"
            className="hover:text-black transition"
          >
            ERP Project
          </a>
        </div>
      </div>
    </footer>
  );
}
