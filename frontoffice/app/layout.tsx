import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/features/components/Navbar/Navbar";
import Footer from "@/features/components/Footer";
import ClarityInitializer from "@/features/components/Clarity";
import { getBasePath } from "@/features/helpers/path.helper";
import { SettingGetCommand } from "@/features/commands/settings/index.command";

import "./globals.css";
import SubNavbar from "@/features/components/SubNavBar/SubNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const { website, fbId } = SettingGetCommand.handle();

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
        url: getBasePath("/peruguitar-og-image.jpg"),
        width: 1200,
        height: 630,
      },
    ],
    url: getBasePath("/"),
    type: "website",
  },
  facebook: {
    appId: fbId,
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

        <Navbar />
        <SubNavbar />

        {children}
        <Footer />
      </body>
    </html>
  );
}
