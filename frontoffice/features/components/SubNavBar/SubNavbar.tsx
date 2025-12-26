"use client";

import Link from "next/link";

import { CategoryGetCommand } from "@/features/commands/category/index.command";

export default function SubNavbar() {
  const categories = CategoryGetCommand.handle({
    onlyParents: true,
    onlyInCatalog: true,
  });

  return (
    <nav className="w-full bg-neutral-800 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <ul className="flex items-center gap-4 overflow-x-auto text-sm text-gray-300">
          {categories.map((cat, index) => (
            <li key={cat.id} className="flex items-center gap-4">
              <Link
                href={`/catalogo/${cat.id}`}
                className="whitespace-nowrap hover:text-white transition"
              >
                {cat.name}
              </Link>

              {/* Dot separator */}
              {index < categories.length - 1 && (
                <span className="text-white/20 select-none">•</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
