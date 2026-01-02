"use client";

import { useCallback } from "react";
import { Copy } from "lucide-react";
import {
  SiWhatsapp,
  SiFacebook,
  SiX,
  SiTelegram,
} from "@icons-pack/react-simple-icons";

interface ShareButtonsProps {
  url: string;
  title?: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title ?? "");

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(url);
  }, [url]);

  const baseClass =
    "flex h-10 w-10 items-center justify-center rounded-lg cursor-pointer transition-colors";

  return (
    <div className="flex gap-2 justify-center">
      <a
        href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} bg-green-500 hover:bg-green-600 text-white`}
        aria-label="WhatsApp"
      >
        <SiWhatsapp size={18} />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} bg-blue-600 hover:bg-blue-700 text-white`}
        aria-label="Facebook"
      >
        <SiFacebook size={18} />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} bg-black hover:bg-neutral-800 text-white`}
        aria-label="X"
      >
        <SiX size={18} />
      </a>

      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} bg-sky-500 hover:bg-sky-600 text-white`}
        aria-label="Telegram"
      >
        <SiTelegram size={18} />
      </a>

      <button
        onClick={handleCopy}
        className={`${baseClass} bg-gray-700 hover:bg-gray-800 text-white`}
        aria-label="Copiar link"
      >
        <Copy size={18} />
      </button>
    </div>
  );
}
