"use client";

import { useEffect, useState } from "react";
import { ExternalLink, LogOut, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { SIDEBAR_MENU } from "./sidebar.config";

import { StoreCommand } from "@/app/api/store/store.command";
import { StoreClient } from "@/app/common/store.client";
import type { User } from "@/infrastracture/domain/user.entity";
import { DataSyncButton } from "./components/DataSyncButton";

const storeClient = new StoreClient();

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await storeClient.execute<User>(StoreCommand.UserFindMe, {
          options: {
            cacheTtlSeconds: 60 * 60 * 24,
          },
        });
        setUser(me);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await storeClient.execute(StoreCommand.AuthSignOut);
      router.replace("/auth");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-neutral-900 border-r border-neutral-800 text-neutral-200 flex flex-col">
      <div className="border-b border-neutral-800">
        <div className="h-14 flex items-center justify-between px-4 font-bold text-sm tracking-wide">
          <span>Peru Guitar Panel</span>
          <DataSyncButton />
        </div>

        {user && (
          <div className="px-4 py-3 border-t border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800">
                <UserIcon size={14} className="text-neutral-400" />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-medium text-neutral-100 truncate">
                  {user.name}
                </div>

                {user.role && (
                  <div className="text-xs text-neutral-400 capitalize">
                    {user.role}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-3 text-sm">
        {SIDEBAR_MENU.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={item.id}>
              <a
                href={item.path}
                className="
                  group w-full flex items-center gap-3
                  px-3 py-2 rounded-md
                  text-neutral-400
                  hover:bg-neutral-800 hover:text-neutral-100
                  transition-colors cursor-pointer
                "
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

      <div className="border-t border-neutral-800 p-2 space-y-1">
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

        <button
          type="button"
          onClick={handleLogout}
          className="
            group w-full flex items-center gap-2
            px-3 py-2 rounded-md
            text-sm font-medium text-white
            bg-red-500/10
            hover:bg-red-500/20
            transition-colors cursor-pointer
          "
        >
          <LogOut
            size={14}
            className="text-red-400 group-hover:text-red-300 transition-colors"
          />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
