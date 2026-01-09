/* eslint-disable react-hooks/refs */
"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import "./ProductFullDescription.css";
import ReactMarkdown from "react-markdown";

type Props = {
  text: string;
  collapsedHeight?: number;
};

export default function ProductFullDescription({
  text,
  collapsedHeight = 180,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    setCanExpand(ref.current.scrollHeight > collapsedHeight);
  }, [text, collapsedHeight]);

  if (!text) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Más información</h2>

      <div
        className={`relative overflow-hidden transition-[max-height] duration-300 ${
          !open && canExpand ? "fade-mask-text" : ""
        }`}
        style={{
          maxHeight: open
            ? (ref.current?.scrollHeight ?? 0) + 16
            : collapsedHeight,
        }}
      >
        <div ref={ref} className="text-gray-800 markdown-preview">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>

      {canExpand && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 cursor-pointer mt-2"
        >
          {open ? (
            <>
              Ver menos <ChevronUp size={16} />
            </>
          ) : (
            <>
              Ver más <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
