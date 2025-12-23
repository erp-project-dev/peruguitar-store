import { Copy } from "lucide-react";
import { toast } from "sonner";

type JsonViewerProps = {
  value: string | undefined;
  rootLabel?: string;
};

function HighlightedJson({ value }: { value: string }) {
  const html = value
    .replace(/"(.*?)":/g, '<span class="text-blue-600">"$1"</span>:')
    .replace(/:\s?"(.*?)"/g, ': <span class="text-green-600">"$1"</span>')
    .replace(/:\s?(\d+(\.\d+)?)/g, ': <span class="text-purple-600">$1</span>')
    .replace(
      /:\s?(true|false|null)/g,
      ': <span class="text-orange-600">$1</span>'
    );

  return <code dangerouslySetInnerHTML={{ __html: html }} />;
}

export function InputJsonViewer({ value, rootLabel }: JsonViewerProps) {
  const hasText = value && value.trim().length > 0;

  if (!hasText) {
    return <div className="h-full bg-neutral-100" />;
  }

  let formatted = "";

  try {
    const parsed = JSON.parse(value);
    formatted = JSON.stringify(parsed, null, 2);
  } catch {
    return (
      <div className="h-full bg-neutral-100 p-3 text-xs font-mono text-red-600">
        Invalid JSON format
      </div>
    );
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(formatted);
    toast.success("Copy to clipboard !!");
  };

  return (
    <div className="relative h-full bg-neutral-100">
      {rootLabel && (
        <div className="px-3 py-2 text-xs font-bold text-neutral-500">
          {rootLabel}
        </div>
      )}

      <button
        onClick={copyToClipboard}
        className="
          absolute right-2 top-2
          flex items-center gap-1
          px-2 py-1
          text-xs text-neutral-500
          hover:text-black cursor-pointer
        "
      >
        <Copy size={12} />
        Copy
      </button>

      <pre
        className="
          h-full overflow-auto
          px-3 pb-3 pt-2
          text-sm font-mono leading-relaxed
          text-neutral-800
        "
      >
        <HighlightedJson value={formatted} />
      </pre>
    </div>
  );
}
