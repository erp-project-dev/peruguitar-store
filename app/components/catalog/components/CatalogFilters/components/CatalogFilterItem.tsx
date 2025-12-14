import { ReactNode } from "react";

interface CatalogFilterItemProps {
  label: string;
  children: ReactNode;
}

export default function CatalogFilterItem({
  label,
  children,
}: CatalogFilterItemProps) {
  return (
    <span className="flex items-center gap-2 rounded-md bg-gray-800 text-gray-100 border border-gray-700 px-3 py-3 text-sm">
      <span className="font-bold whitespace-nowrap">{label}:</span>
      {children}
    </span>
  );
}
