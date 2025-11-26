"use client";

import { useState } from "react";
import { Instagram, Menu, X } from "lucide-react";

import Link from "next/link";
import Image from "next/image";

import { SettingsHandler } from "../handlers/settings/index.handler";
import logo from "../assets/logo.png";

export default function NavBar() {
  const { instagram } = SettingsHandler();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#171717] text-white shadow-md">
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
          <Link
            href="/acerca-de-nosotros"
            className="hover:text-yellow-400 transition"
          >
            Acerca de nosotros
          </Link>

          <Link
            href="/publicar"
            className="bg-yellow-400 text-[#0B2545] font-semibold px-4 py-2 rounded-md hover:bg-yellow-300 transition"
          >
            Publica tu guitarra
          </Link>

          <a
            href="https://www.instagram.com/peruguitar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition"
          >
            <Instagram className="w-6 h-6" />
          </a>
        </div>

        <button
          className="md:hidden hover:opacity-80 transition"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#111] px-4 pt-2 pb-4 space-y-4 border-t border-white/10">
          <Link
            href="/acerca-de-nosotros"
            className="block text-lg hover:text-yellow-400 transition"
            onClick={() => setOpen(false)}
          >
            Acerca de nosotros
          </Link>

          <Link
            href="/publicar"
            className="block w-full text-center bg-yellow-400 text-[#0B2545] font-semibold px-4 py-2 rounded-md hover:bg-yellow-300 transition"
            onClick={() => setOpen(false)}
          >
            Publica tu guitarra
          </Link>

          <Link
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg hover:text-red-400 transition"
            onClick={() => setOpen(false)}
          >
            <Instagram className="w-5 h-5" />
            Instagram
          </Link>
        </div>
      )}
    </nav>
  );
}
