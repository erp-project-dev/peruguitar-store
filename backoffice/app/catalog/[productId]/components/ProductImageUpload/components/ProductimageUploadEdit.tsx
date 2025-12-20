/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Save, SlidersHorizontal } from "lucide-react";

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1350;

const VIEW_WIDTH = 460;
const VIEW_HEIGHT = Math.round((EXPORT_HEIGHT / EXPORT_WIDTH) * VIEW_WIDTH);

type AdjustMode = "zoom" | "brightness" | "saturation";

type Props = {
  file: File;
  onApply: (file: File) => void;
};

export default function ProductImageUploadEdit({ file, onApply }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [mode, setMode] = useState<AdjustMode>("zoom");

  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);

  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);

  const clampOffset = useCallback(
    (x: number, y: number) => {
      const img = imgRef.current;
      if (!img) return { x, y };

      const minX = EXPORT_WIDTH - img.width * zoom;
      const minY = EXPORT_HEIGHT - img.height * zoom;

      return {
        x: Math.min(0, Math.max(minX, x)),
        y: Math.min(0, Math.max(minY, y)),
      };
    },
    [zoom]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = VIEW_WIDTH;
    canvas.height = VIEW_HEIGHT;

    const scaleX = VIEW_WIDTH / EXPORT_WIDTH;
    const scaleY = VIEW_HEIGHT / EXPORT_HEIGHT;

    ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%)`;

    ctx.drawImage(
      img,
      offset.x * scaleX,
      offset.y * scaleY,
      img.width * zoom * scaleX,
      img.height * zoom * scaleY
    );

    ctx.filter = "none";
  }, [zoom, brightness, saturation, offset]);

  useEffect(() => {
    if (!(file instanceof File)) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      imgRef.current = img;

      const z = Math.max(EXPORT_WIDTH / img.width, EXPORT_HEIGHT / img.height);

      setMinZoom(z);
      setZoom(z);

      setOffset({
        x: (EXPORT_WIDTH - img.width * z) / 2,
        y: (EXPORT_HEIGHT - img.height * z) / 2,
      });
    };

    return () => URL.revokeObjectURL(img.src);
  }, [file]);

  useEffect(() => {
    setOffset((o) => clampOffset(o.x, o.y));
    draw();
  }, [zoom, brightness, saturation, draw, clampOffset]);

  const onMouseDown = () => {
    draggingRef.current = true;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;

    setOffset((o) =>
      clampOffset(
        o.x + e.movementX * (EXPORT_WIDTH / VIEW_WIDTH),
        o.y + e.movementY * (EXPORT_HEIGHT / VIEW_HEIGHT)
      )
    );
  };

  const onMouseUp = () => {
    draggingRef.current = false;
  };

  const apply = () => {
    const img = imgRef.current;
    if (!img) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = EXPORT_WIDTH;
    exportCanvas.height = EXPORT_HEIGHT;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%)`;

    ctx.drawImage(img, offset.x, offset.y, img.width * zoom, img.height * zoom);

    ctx.filter = "none";

    exportCanvas.toBlob((blob) => {
      if (!blob) return;

      onApply(
        new File([blob], file.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        })
      );
    }, "image/jpeg");
  };

  const sliderConfig = {
    zoom: {
      min: minZoom,
      max: 3,
      step: 0.01,
      value: zoom,
      onChange: setZoom,
    },
    brightness: {
      min: 70,
      max: 140,
      step: 1,
      value: brightness,
      onChange: setBrightness,
    },
    saturation: {
      min: 50,
      max: 150,
      step: 1,
      value: saturation,
      onChange: setSaturation,
    },
  }[mode];

  return (
    <div className="relative mx-auto w-fit">
      <canvas
        ref={canvasRef}
        className="cursor-move rounded-md border border-neutral-300 bg-neutral-100"
        style={{ width: VIEW_WIDTH, height: VIEW_HEIGHT }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />

      <div className="absolute bottom-2 left-1/2 z-20 flex w-[94%] -translate-x-1/2 items-center gap-3 rounded-full bg-black/70 px-4 py-2 backdrop-blur">
        <SlidersHorizontal size={14} className="text-white" />

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as AdjustMode)}
          className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-white outline-none focus:outline-none"
        >
          <option value="zoom">Zoom</option>
          <option value="brightness">Brightness</option>
          <option value="saturation">Saturation</option>
        </select>

        <input
          type="range"
          min={sliderConfig.min}
          max={sliderConfig.max}
          step={sliderConfig.step}
          value={sliderConfig.value}
          onChange={(e) => sliderConfig.onChange(Number(e.target.value))}
          className="flex-1 h-1 appearance-none rounded-full bg-neutral-500/40 accent-white"
        />

        <button
          onClick={apply}
          className="rounded-full bg-green-600 p-2 text-white hover:bg-green-500"
        >
          <Save size={16} />
        </button>
      </div>
    </div>
  );
}
