/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useEffect } from "react";
import { X } from "lucide-react";

interface ProductStoryCardPreviewProps {
  imagePath: string;
  productName: string;
  price: number;
  onClose: () => void;
}

const BOX_HEIGHT = 520;
const MARGIN_X = 60;
const LINE_HEIGHT = 70;

function setTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  containerWidth: number,
  containerHeight: number
) {
  const startY = containerHeight - 300;

  ctx.fillStyle = "white";
  ctx.font = "bold 60px sans-serif";

  let wordsPerLine = 4;
  if (containerWidth < 900) wordsPerLine = 3;
  if (containerWidth < 700) wordsPerLine = 2;
  if (containerWidth < 500) wordsPerLine = 1;

  const words = text.trim().split(" ");
  const lines = [];
  let line: string[] = [];

  const maxLines = Math.floor(containerHeight / LINE_HEIGHT);

  for (let i = 0; i < words.length; i++) {
    line.push(words[i]);

    if (line.length === wordsPerLine) {
      lines.push(line.join(" "));
      line = [];
      if (lines.length === maxLines) break;
    }
  }

  if (line.length && lines.length < maxLines) lines.push(line.join(" "));

  lines.forEach((l, i) => {
    ctx.fillText(l, MARGIN_X, startY + i * LINE_HEIGHT);
  });
}

function setPrice(
  ctx: CanvasRenderingContext2D,
  price: number,
  containerHeight: number
) {
  const y = containerHeight - 400;

  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 80px sans-serif";

  ctx.fillText(
    price.toLocaleString("es-PE", {
      currency: "PEN",
      minimumFractionDigits: 0,
      style: "currency",
    }),
    MARGIN_X,
    y
  );
}

function setBrandName(
  ctx: CanvasRenderingContext2D,
  containerWidth: number,
  containerHeight: number
) {
  const baseY = containerHeight - 120;

  ctx.textAlign = "right";

  ctx.fillStyle = "white";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText("peruguitar.com", containerWidth - MARGIN_X, baseY);

  ctx.fillStyle = "rgba(230,230,230,0.92)";
  ctx.font = "italic 32px sans-serif";
  ctx.fillText(
    "Tu marketplace exclusivo de guitarras",
    containerWidth - MARGIN_X,
    baseY + 45
  );

  ctx.textAlign = "left";
}

function setImageBackground(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number
) {
  const imgAspect = img.width / img.height;
  const canvasAspect = width / height;

  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imgAspect > canvasAspect) {
    drawWidth = height * imgAspect;
    offsetX = (width - drawWidth) / 2;
  } else {
    drawHeight = width / imgAspect;
    offsetY = (height - drawHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function setGradientBox(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fillRect(0, height - BOX_HEIGHT, width, BOX_HEIGHT);

  const fade = ctx.createLinearGradient(
    0,
    height - BOX_HEIGHT,
    0,
    height - BOX_HEIGHT - 200
  );
  fade.addColorStop(0, "rgba(0,0,0,0.65)");
  fade.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = fade;
  ctx.fillRect(0, height - BOX_HEIGHT - 200, width, 200);
}

export default function ProductStoryCardPreview({
  imagePath,
  productName,
  price,
  onClose,
}: ProductStoryCardPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateCard = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 1080;
      const height = 1920;

      canvas.width = width;
      canvas.height = height;

      const img = new Image();
      img.src = imagePath;
      img.crossOrigin = "anonymous";

      await new Promise((res) => (img.onload = res));

      setImageBackground(ctx, img, width, height);
      setGradientBox(ctx, width, height);
      setTitle(ctx, productName, width, height);
      setPrice(ctx, price, height);
      setBrandName(ctx, width, height);
    };

    generateCard();
  }, [imagePath, productName, price]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-10"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition"
      >
        <X className="w-7 h-7" />
      </button>

      <canvas
        ref={canvasRef}
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-lg shadow-xl"
      />

      <p className="text-gray-300 text-sm mt-4 select-none">
        Click derecho para guardar imagen
      </p>
    </div>
  );
}
