// features/components/CategoryHeader.tsx

interface CategoryHeaderProps {
  title: string;
  description: string;
  backgroundUrl: string;
  contentWidthClass?: string; // default: max-w-7xl
}

export default function CategoryHeader({
  title,
  description,
  backgroundUrl,
  contentWidthClass = "max-w-7xl",
}: CategoryHeaderProps) {
  return (
    <header
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div
        className={`relative mx-auto px-4 py-8 md:px-4 md:py-12 ${contentWidthClass}`}
      >
        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl font-bold text-white md:text-3xl">{title}</h1>
          <p className="text-sm text-gray-200 md:text-base">{description}</p>
        </div>
      </div>
    </header>
  );
}
