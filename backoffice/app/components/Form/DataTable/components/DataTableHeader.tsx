"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { alignClass } from "../helpers";

interface TableHeaderProps<T> {
  columns: {
    key: keyof T;
    label: string;
    sortable?: boolean;
    width?: number;
    align?: "left" | "center" | "right";
  }[];
  sort: {
    key: keyof T | null;
    direction: "asc" | "desc";
  };
  onSort: (key: keyof T) => void;
  showActions: boolean;
}

export default function TableHeader<T>({
  columns,
  sort,
  onSort,
  showActions,
}: TableHeaderProps<T>) {
  return (
    <thead className="bg-neutral-50 text-neutral-500">
      <tr>
        {columns.map((col) => (
          <th
            key={String(col.key)}
            style={col.width ? { width: col.width } : undefined}
            className={`px-4 py-2 font-medium ${alignClass(col.align)}`}
          >
            <div
              className={`inline-flex items-center gap-1 ${
                col.sortable ? "cursor-pointer select-none" : ""
              }`}
              onClick={() => col.sortable && onSort(col.key)}
            >
              {col.label}
              {col.sortable &&
                sort.key === col.key &&
                (sort.direction === "asc" ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                ))}
            </div>
          </th>
        ))}

        {showActions && (
          <th className="px-4 py-2 text-right font-medium w-[96px]">Actions</th>
        )}
      </tr>
    </thead>
  );
}
