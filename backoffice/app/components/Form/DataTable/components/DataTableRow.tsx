"use client";

import { Pencil, Trash } from "lucide-react";
import { alignClass } from "../helpers";
import { Column } from "../DataTable";

interface DataTableRowProps<T extends { _id: string }> {
  row: T;
  columns: Column<T>[];
  showActions: boolean;
  canEdit: boolean;
  canRemove: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

export default function DataTableRow<T extends { _id: string }>({
  row,
  columns,
  showActions,
  canEdit,
  canRemove,
  onEdit,
  onRemove,
}: DataTableRowProps<T>) {
  return (
    <tr
      key={row._id}
      className="border-t border-neutral-100 hover:bg-neutral-50"
    >
      {columns.map((col) => {
        const value = row[col.key];
        const truncated = col.truncate ?? true;

        return (
          <td
            key={String(col.key)}
            className={`px-4 py-4 ${truncated ? "truncate" : ""} ${alignClass(
              col.align,
            )}`}
          >
            {col.render ? col.render(value, row) : String(value ?? "")}
          </td>
        );
      })}

      {showActions && (
        <td className="px-4 py-4 text-right">
          <div className="inline-flex gap-1">
            {canEdit && (
              <button
                onClick={onEdit}
                className="p-2 rounded hover:bg-neutral-100"
              >
                <Pencil size={16} />
              </button>
            )}
            {canRemove && (
              <button
                onClick={onRemove}
                className="p-2 rounded hover:bg-red-50 text-red-600"
              >
                <Trash size={16} />
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}
