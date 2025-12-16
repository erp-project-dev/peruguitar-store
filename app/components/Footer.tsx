import { SettingGetCommand } from "../commands/settings/index.command";

export default function Footer() {
  const { whatsappLinks, instagram } = SettingGetCommand.handle();

  return (
    <footer className="w-full py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:items-center text-neutral-600">
        <p className="text-left sm:text-center">
          © {new Date().getFullYear()} Peru Guitar — Marketplace exclusivo de
          guitarras eléctricas.
        </p>

        <div
          className="
            mt-3
            w-full
            grid grid-cols-2 gap-x-6 gap-y-2
            text-xs text-center
            place-items-center
            sm:mt-0
            sm:w-auto
            sm:flex sm:flex-row sm:items-center sm:gap-4
            sm:text-sm sm:text-left
          "
        >
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
