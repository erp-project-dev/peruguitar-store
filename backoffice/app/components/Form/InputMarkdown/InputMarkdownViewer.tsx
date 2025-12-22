import ReactMarkdown from "react-markdown";

import "./InputMarkdownViewer.css";

type MarkdownViewerProps = {
  value?: string;
};

export function InputMarkdownViewer({ value }: MarkdownViewerProps) {
  const hasText = value && value.trim().length > 0;

  if (!hasText) {
    return <div className="h-full bg-neutral-100" />;
  }

  return (
    <div className="relative h-full bg-neutral-100">
      <div className="markdown-preview h-full overflow-auto pt-5 px-3">
        <ReactMarkdown>{value ?? ""}</ReactMarkdown>
      </div>
    </div>
  );
}
