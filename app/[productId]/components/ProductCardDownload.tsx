"use client";

import { useRef } from "react";

import { sendClarityEvent } from "@/app/helpers/clarity.helper";

type ProductCardDownloadProps = {
  imagePath: string;
  productName: string;
  price: number;
};

export default function ProductCardDownload({
  imagePath,
  productName,
  price,
}: ProductCardDownloadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sendClarityEvent("instagram_card_download");

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Instagram Story size
    const width = 1080;
    const height = 1920;

    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.src = imagePath;
    img.crossOrigin = "anonymous";

    await new Promise((res) => (img.onload = res));

    // 1. Draw full image (cover mode)
    const imgAspect = img.width / img.height;
    const canvasAspect = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > canvasAspect) {
      // Image is wider → scale by height
      drawWidth = height * imgAspect;
      offsetX = (width - drawWidth) / 2;
    } else {
      // Image is taller → scale by width
      drawHeight = width / imgAspect;
      offsetY = (height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // 2. Bottom gradient (moved lower for 1920px height)
    const grad = ctx.createLinearGradient(0, height, 0, height - 450);
    grad.addColorStop(0, "rgba(0,0,0,0.80)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.40)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, height - 450, width, 450);

    // 3. Product name (moved lower)
    ctx.fillStyle = "white";
    ctx.font = "bold 60px sans-serif";
    wrapText(ctx, productName, 60, height - 320, width - 120, 70);

    // 4. Price
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 72px sans-serif";
    ctx.fillText(`S/ ${price.toLocaleString("es-PE")}`, 60, height - 150);

    // 5. Watermark bottom-right
    ctx.textAlign = "right";

    ctx.fillStyle = "white";
    ctx.font = "40px sans-serif";
    ctx.fillText("peruguitar.com", width - 60, height - 100);

    ctx.fillStyle = "rgba(230,230,230,0.92)";
    ctx.font = "italic 32px sans-serif";
    ctx.fillText(
      "Tu marketplace exclusivo de guitarras",
      width - 60,
      height - 55
    );

    // 6. Dynamic filename
    const ext = imagePath.split(".").pop() || "png";
    const slug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const filename = `${slug}-story-card.${ext}`;

    // 7. Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  return (
    <>
      <p className="text-lg font-medium">
        <button
          onClick={generateCard}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg transition-all hover:scale-[1.03] cursor-pointer"
        >
          Descargar
        </button>
      </p>
      <canvas
        ref={canvasRef}
        style={{
          display: "none",
          visibility: "hidden",
          width: 0,
          height: 0,
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
