"use client";

import { Plus, Save, X } from "lucide-react";

import { alignClass } from "../helpers";
import { SelectOption } from "../DataTable";

interface InsertColumn<T> {
  key: keyof T;
  editable?: boolean;
  align?: "left" | "center" | "right";
  values?: SelectOption[];
}

interface DataTableInsertRowProps<T> {
  columns: InsertColumn<T>[];
  inserting: boolean;
  insertDraft: Partial<T>;
  loading: boolean;
  onStart: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (key: keyof T, value: unknown) => void;
}

export default function DataTableInsertRow<T>({
  columns,
  inserting,
  insertDraft,
  loading,
  onStart,
  onSave,
  onCancel,
  onChange,
}: DataTableInsertRowProps<T>) {
  return (
    <tr className="border-b border-neutral-200 bg-neutral-50">
      {columns.map((col) => (
        <td
          key={String(col.key)}
          className={`px-4 py-2 ${alignClass(col.align)}`}
        >
          {inserting && col.editable ? (
            col.values ? (
              <select
                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm bg-white"
                value={String(insertDraft[col.key] ?? "")}
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
                value={String(insertDraft[col.key] ?? "")}
                onChange={(e) => onChange(col.key, e.target.value)}
              />
            )
          ) : null}
        </td>
      ))}

      <td className="px-4 py-2 text-right">
        {!inserting ? (
          <button
            onClick={onStart}
            className="p-2 rounded hover:bg-neutral-100"
          >
            <Plus size={16} />
          </button>
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
