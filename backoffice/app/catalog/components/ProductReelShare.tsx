"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import Modal from "@/app/components/Modal/Modal";

type Props = {
  open: boolean;
  image: string;
  name: string;
  price: number;
  currency?: string;
  onClose: () => void;
};

const REEL_WIDTH = 1080;
const REEL_HEIGHT = 1920;

export default function ProductReelShareModal({
  open,
  image,
  name,
  price,
  currency = "USD",
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const formattedPrice = useMemo(() => {
    return price.toLocaleString("es-PE", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    });
  }, [price, currency]);

  const baseText = useMemo(() => {
    return `${name}
Precio: ${formattedPrice}

Encuéntralo en peruguitar.com
Tu marketplace exclusivo para guitarristas 🎸

#peruguitar #fyp #riffwars #rockperu`;
  }, [name, formattedPrice]);

  useEffect(() => {
    setText(baseText);
  }, [baseText]);

  useEffect(() => {
    if (!open || !image) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = REEL_WIDTH;
      canvas.height = REEL_HEIGHT;

      ctx.clearRect(0, 0, REEL_WIDTH, REEL_HEIGHT);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);

      const scale = Math.max(REEL_WIDTH / img.width, REEL_HEIGHT / img.height);

      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      const x = (REEL_WIDTH - drawWidth) / 2;
      const y = (REEL_HEIGHT - drawHeight) / 2;

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
    };

    img.onerror = () => {
      console.error("Image failed to load:", image);
    };

    img.src = image;
  }, [image, open]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `${name.replace(/\s+/g, "-").toLowerCase()}-reel.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      "image/jpeg",
      0.95,
    );
  };

  return (
    <Modal title="Reel Share" open={open} onClose={onClose} size="xl">
      <div className="flex w-full gap-6">
        <div className="flex w-1/2 items-center justify-center bg-black rounded-lg">
          <canvas
            ref={canvasRef}
            className="w-67.5 aspect-9/16 rounded-lg bg-neutral-900"
          />
        </div>

        <div className="flex w-1/2 flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 resize-none rounded-md border border-neutral-200 p-3 text-sm focus:outline-none"
          />

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-black py-2 text-white transition hover:bg-neutral-800"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copiar texto
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-100"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
