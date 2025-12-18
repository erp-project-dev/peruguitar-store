export function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div
      className={[full ? "md:col-span-2" : "", "flex flex-col gap-1.5"].join(
        " "
      )}
    >
      <label className="text-xs font-medium text-neutral-700">{label}</label>
      <div className="group relative">{children}</div>
    </div>
  );
}
