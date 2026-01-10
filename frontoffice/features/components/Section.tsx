interface SectionProps {
  children: React.ReactNode;
  width?: "full" | "narrow";
  spaceY?: "4" | "6" | "8";
}

export default function Section({
  children,
  width,
  spaceY = "6",
}: SectionProps) {
  const widthClass =
    width === "full"
      ? "w-full px-4 -mt-6 -mb-6"
      : width === "narrow"
      ? "max-w-3xl px-4"
      : "max-w-7xl px-4";

  const spaceYClass =
    spaceY === "4" ? "space-y-4" : spaceY === "8" ? "space-y-8" : "space-y-6";

  return (
    <section className="mt-10 mb-10 w-full">
      <div className={`mx-auto ${widthClass} ${spaceYClass}`}>{children}</div>
    </section>
  );
}
