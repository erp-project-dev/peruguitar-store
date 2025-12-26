"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center text-sm text-slate-500">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center hover:text-slate-900 transition-colors"
            aria-label="Inicio"
          >
            <Home className="h-4 w-4 mr-2" />
            <span>Inicio</span>
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-slate-400" />
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {isLast ? (
                <span className="text-slate-900 font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href!}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <ChevronRight className="mx-2 h-4 w-4 text-slate-400" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
