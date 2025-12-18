export default function MetricGrid({
  children,
  cols = 4,
}: {
  children: React.ReactNode;
  cols?: 2 | 4 | 6;
}) {
  const gridColsClass =
    cols === 2 ? "grid-cols-2" : cols === 6 ? "grid-cols-6" : "grid-cols-4";

  return (
    <div className={`grid ${gridColsClass} gap-4 text-sm`}>{children}</div>
  );
}
