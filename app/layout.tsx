import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import ClarityInitializer from "./components/Clarity";

import { getPublicPath } from "./helpers/path.helper";
import { SettingsHandler } from "./handlers/settings/index.handler";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const { website } = SettingsHandler();

export const metadata: Metadata = {
  title: website.title,
  description: website.description,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: website.title,
    description: website.description,
    images: [
      {
        url: getPublicPath("/peruguitar-og-image.jpg"),
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}
      >
        <ClarityInitializer />
        <NavBar />
        <div className="flex mt-30 mb-10 items-center justify-center px-8">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
