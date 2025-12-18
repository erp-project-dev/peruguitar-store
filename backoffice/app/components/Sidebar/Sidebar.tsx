import { ExternalLink } from "lucide-react";
import { SIDEBAR_MENU } from "./sidebar.config";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-neutral-900 border-r border-neutral-800 text-neutral-200 flex flex-col">
      <div className="h-14 flex items-center px-4 border-b border-neutral-800 font-bold text-sm tracking-wide">
        Peru Guitar Panel
      </div>

      <nav className="flex-1 px-2 py-3 text-sm">
        {SIDEBAR_MENU.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={item.id}>
              <a
                className="
                  group w-full flex items-center gap-3
                  px-3 py-2 rounded-md
                  text-neutral-400
                  hover:bg-neutral-800 hover:text-neutral-100
                  transition-colors cursor-pointer
                "
                href={item.path}
              >
                <Icon
                  size={16}
                  className="text-neutral-500 group-hover:text-neutral-100 transition-colors"
                />
                <span>{item.label}</span>
              </a>

              {index < SIDEBAR_MENU.length - 1 && (
                <div className="mx-3 my-1 h-px bg-neutral-800" />
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-neutral-800 p-2">
        <a
          href="https://peruguitar.com"
          target="_blank"
          rel="noopener noreferrer"
          className="
            group flex items-center gap-2
            px-3 py-2 rounded-md
            text-sm text-neutral-400
            hover:bg-neutral-800 hover:text-neutral-100
            transition-colors cursor-pointer
          "
        >
          <ExternalLink
            size={14}
            className="text-neutral-500 group-hover:text-neutral-100 transition-colors"
          />
          <span>Visitar peruguitar.com</span>
        </a>
      </div>
    </aside>
  );
}
