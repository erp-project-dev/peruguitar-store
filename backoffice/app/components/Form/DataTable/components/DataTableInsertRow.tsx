"use client";

import { Plus, Save, X } from "lucide-react";
import { alignClass } from "../helpers";
import { Column } from "../DataTable";
import DataTableMultipleInput from "./controls/DataTableMultipleInput";
import DataTableSelect from "./controls/DataTableSelect";

interface DataTableInsertRowProps<T> {
  columns: Column<T>[];
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
      {columns.map((col) => {
        const rawValue = insertDraft[col.key];

        return (
          <td
            key={String(col.key)}
            className={`px-4 py-2 ${alignClass(col.align)}`}
          >
            {inserting &&
            col.editable &&
            (!col.editableOn || col.editableOn === "insert") ? (
              col.values ? (
                col.multiple ? (
                  <DataTableMultipleInput
                    options={col.values.map((v) => ({
                      key: v.value,
                      value: v.label,
                    }))}
                    onChange={(next) => onChange(col.key, next)}
                    defaultValues={col.defaultValue as string[]}
                  />
                ) : (
                  <DataTableSelect
                    value={String(rawValue ?? "")}
                    options={col.values.map((opt) => ({
                      value: opt.value,
                      label: opt.label,
                    }))}
                    onChange={(value) => onChange(col.key, value)}
                  />
                )
              ) : (
                <input
                  className="w-full rounded border border-neutral-300 px-2 py-1 text-sm"
                  value={String(rawValue ?? "")}
                  onChange={(e) => onChange(col.key, e.target.value)}
                />
              )
            ) : null}
          </td>
        );
      })}

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
