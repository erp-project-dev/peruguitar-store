import { ReactNode, useEffect } from "react";
import { Loader2 } from "lucide-react";

type PageSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  loading?: boolean;
};

export default function PageSection({
  title,
  description,
  children,
  loading = false,
}: PageSectionProps) {
  useEffect(() => {
    const el = document.getElementById("page-content");
    if (!el) return;

    el.style.overflowY = loading ? "hidden" : "auto";

    return () => {
      el.style.overflowY = "auto";
    };
  }, [loading]);

  return (
    <main className="ml-64 flex-1 bg-neutral-100 text-neutral-900 h-screen flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-neutral-100 border-b border-neutral-200">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

          {description && (
            <p className="mt-2 max-w-3xl text-sm text-neutral-600">
              {description}
            </p>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <section
        id="page-content"
        className="relative flex-1 overflow-y-auto p-6"
      >
        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center gap-4 text-neutral-700">
              <Loader2 className="w-12 h-12 animate-spin" strokeWidth={2.4} />
              <span className="text-base font-semibold tracking-wide">
                Loading…
              </span>
            </div>
          </div>
        )}

        <div className="bg-white border border-neutral-200 rounded-lg p-5 text-sm">
          {children}
        </div>
      </section>
    </main>
  );
}
