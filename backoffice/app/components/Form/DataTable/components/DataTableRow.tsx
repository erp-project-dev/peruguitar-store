"use client";

import { Pencil, Save, X, Trash } from "lucide-react";
import { alignClass } from "../helpers";
import { Column } from "../DataTable";

interface DataTableRowProps<T extends { _id: string }> {
  row: T;
  columns: Column<T>[];
  isEditing: boolean;
  draft: Partial<T>;
  loading: boolean;
  canEdit: boolean;
  canRemove: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onRemove: () => void;
  onChange: (key: keyof T, value: string) => void;
}

export default function DataTableRow<T extends { _id: string }>({
  row,
  columns,
  isEditing,
  draft,
  loading,
  canEdit,
  canRemove,
  onEdit,
  onSave,
  onCancel,
  onRemove,
  onChange,
}: DataTableRowProps<T>) {
  return (
    <tr className="border-t border-neutral-100 hover:bg-neutral-50">
      {columns.map((col) => {
        const value = row[col.key];

        return (
          <td
            key={String(col.key)}
            className={`px-4 py-2 truncate ${alignClass(col.align)}`}
          >
            {isEditing && col.editable ? (
              col.values ? (
                <select
                  className="w-full rounded border border-neutral-300 px-2 py-1 text-sm bg-white"
                  value={String(draft[col.key] ?? "")}
                  onChange={(e) => onChange(col.key, e.target.value)}
                >
                  {col.values.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="w-full rounded border border-neutral-300 px-2 py-1 text-sm"
                  value={String(draft[col.key] ?? "")}
                  onChange={(e) => onChange(col.key, e.target.value)}
                />
              )
            ) : col.render ? (
              col.render(value, row)
            ) : (
              String(value ?? "")
            )}
          </td>
        );
      })}

      <td className="px-4 py-2 text-right">
        {!isEditing ? (
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
        ) : (
          <div className="inline-flex gap-1">
            <button
              onClick={onSave}
              disabled={loading}
              className="p-2 rounded hover:bg-green-50 text-green-600"
            >
              <Save size={16} />
            </button>
            <button
              onClick={onCancel}
              className="p-2 rounded hover:bg-red-50 text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
