import { SettingGetCommand } from "@/app/commands/settings/index.command";
import { Instagram, UsersRound } from "lucide-react";

const { instagram, whatsappLinks } = SettingGetCommand.handle();

export const NAV_LINKS = [
  {
    label: "Acerca de nosotros",
    href: "/acerca-de-nosotros",
  },

  {
    label: "Grupo",
    href: whatsappLinks.store,
    icon: <UsersRound className="w-6 h-6" />,
    external: true,
  },
  {
    label: "Instagram",
    href: instagram,
    icon: <Instagram className="w-6 h-6" />,
    external: true,
  },
  {
    label: "Publica tu guitarra",
    href: "/publicar",
    className:
      "bg-yellow-400 text-[#0B2545] font-semibold px-4 py-2 rounded-md hover:bg-yellow-300 transition",
    mobileClass:
      "block w-full text-center bg-yellow-400 text-[#0B2545] font-semibold px-4 py-2 rounded-md hover:bg-yellow-300 transition",
  },
];
