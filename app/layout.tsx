import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peru Guitar - Marketplace de Guitarras en Perú",
  description:
    "Publica, descubre y encuentra guitarras en venta en Perú. Marketplace gratuito con fotos, especificaciones y contacto directo por WhatsApp.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />

        <div className="flex mt-40 mb-20 items-center justify-center font-sans">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}
