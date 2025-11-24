import { Instagram } from "lucide-react";

import Link from "next/link";
import Image from "next/image";

import logo from "../assets/logo.png";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-4 px-4 flex items-center justify-between bg-[#171717] shadow-md text-white">
      <Link href="/" className="flex items-center">
        <Image
          src={logo}
          alt="Peru Guitar Logo"
          className="w-80 select-none cursor-pointer"
        />
      </Link>

      <div className="flex items-center space-x-8">
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
    </nav>
  );
}
