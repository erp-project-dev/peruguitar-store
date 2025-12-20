import Link from "next/link";
import { ChevronRight, GitCommit } from "lucide-react";

import { SettingGetCommand } from "../commands/settings/index.command";
import { MetalGetCommand } from "../commands/meta/index.command";

export default function Footer() {
  const { whatsappLinks, instagram } = SettingGetCommand.handle();
  const { release_date, release_version } = MetalGetCommand.handle();

  return (
    <footer className="w-full bg-white/35 text-neutral-600">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="text-base font-medium text-neutral-800">
            Peru Guitar
          </span>

          <ChevronRight
            size={16}
            className="hidden sm:inline text-neutral-400"
          />

          <span className="text-sm text-neutral-500">
            Marketplace exclusivo de guitarras eléctricas.
          </span>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 text-sm sm:grid-cols-4">
          <div className="space-y-3">
            <p className="font-medium text-neutral-800">Peru Guitar</p>
            <Link
              href="/acerca-de-nosotros"
              className="block hover:text-neutral-900"
            >
              Acerca de nosotros
            </Link>
            <Link href="/publicar" className="block hover:text-neutral-900">
              Publicar
            </Link>
          </div>

          <div className="space-y-3">
            <p className="font-medium text-neutral-800">Comunidad</p>
            <a
              href={whatsappLinks.store}
              className="block hover:text-neutral-900"
            >
              Grupo de compra y venta
            </a>
            <a
              href={whatsappLinks.community}
              className="block hover:text-neutral-900"
            >
              Comunidad oficial
            </a>
          </div>

          <div className="space-y-3">
            <p className="font-medium text-neutral-800">Redes</p>
            <a href={instagram} className="block hover:text-neutral-900">
              Instagram oficial
            </a>
          </div>

          <div className="space-y-3">
            <p className="font-medium text-neutral-800">Otros</p>
            <a
              href="https://instagram.com/erpprojectofficial"
              className="block hover:text-neutral-900"
            >
              ERP Project
            </a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-neutral-300 flex flex-col sm:flex-row sm:justify-between gap-4 text-sm">
          <span>
            © {new Date().getFullYear()} Peru Guitar. Todos los derechos
            reservados.
          </span>

          <span className="flex items-center gap-1 text-neutral-500 sm:justify-end">
            <GitCommit size={14} />v{release_version} ·{" "}
            {new Date(release_date).getTime()}
          </span>
        </div>
      </div>
    </footer>
  );
}
