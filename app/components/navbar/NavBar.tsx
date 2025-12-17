"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import logo from "@/app/assets/logo.png";
import { NAV_LINKS } from "./menu";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  // -------------------------------
  // CLASES BASE
  // -------------------------------
  const baseDesktop =
    "hover:text-yellow-400 transition flex items-center gap-2";

  const baseMobile =
    "block text-lg hover:text-yellow-400 transition flex items-center gap-2";

  return (
    <nav className="w-full z-50 bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="Peru Guitar Logo"
            className="w-48 sm:w-60 select-none cursor-pointer"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((item) => {
            const Comp = item.external ? "a" : Link;

            return (
              <Comp
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={item.className ?? baseDesktop}
              >
                {item.icon}
                {item.className ? item.label : <span>{item.label}</span>}
              </Comp>
            );
          })}
        </div>

        <button
          className="md:hidden hover:opacity-80 transition"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-[#111] px-4 pt-2 pb-4 space-y-4 border-t border-white/10">
          {NAV_LINKS.map((item) => {
            const Comp = item.external ? "a" : Link;

            return (
              <Comp
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className={item.mobileClass ?? baseMobile}
              >
                {item.icon}
                {item.label}
              </Comp>
            );
          })}
        </div>
      )}
    </nav>
  );
}
