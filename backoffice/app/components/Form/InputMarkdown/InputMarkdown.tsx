import { useRef, useState } from "react";
import { InputMarkdownViewer } from "./InputMarkdownViewer";

type InputMarkdownProps = {
  value?: string;
  onChange: (value: string) => void;
  rootLabel?: string;
  placeholder?: string;
  className?: string;
};

export function InputMarkdown({
  value,
  onChange,
  placeholder,
  className = "",
}: InputMarkdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(50);
  const draggingRef = useRef(false);

  const startDrag = () => {
    draggingRef.current = true;
    document.body.style.cursor = "col-resize";
  };

  const stopDrag = () => {
    draggingRef.current = false;
    document.body.style.cursor = "default";
  };

  const onDrag = (e: MouseEvent) => {
    if (!draggingRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;

    setLeftWidth(Math.min(80, Math.max(20, percentage)));
  };

  const bindEvents = () => {
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  const unbindEvents = () => {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
  };

  const onMouseDown = () => {
    startDrag();
    bindEvents();
  };

  const onMouseUp = () => {
    stopDrag();
    unbindEvents();
  };

  return (
    <div
      ref={containerRef}
      className={`flex h-100 w-full overflow-hidden rounded-md border border-neutral-300 ${className}`}
      onMouseUp={onMouseUp}
    >
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: `${leftWidth}%` }}
        className="
          h-full resize-none border-none bg-white p-3
          text-sm font-mono text-neutral-900
          focus:outline-none
        "
      />

      <div
        onMouseDown={onMouseDown}
        className="
          w-2 cursor-col-resize bg-neutral-200
          hover:bg-neutral-300
        "
      />

      <div className="flex-1 bg-neutral-50">
        <InputMarkdownViewer value={value} />
      </div>
    </div>
  );
}
