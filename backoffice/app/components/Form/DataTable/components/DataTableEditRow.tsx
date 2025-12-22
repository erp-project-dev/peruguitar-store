"use client";

import { Save, X } from "lucide-react";
import { alignClass } from "../helpers";
import { Column } from "../DataTable";
import DataTableMultipleInput from "./controls/DataTableMultipleInput";
import DataTableSelect from "./controls/DataTableSelect";

interface DataTableEditRowProps<T extends { _id: string }> {
  row: T;
  draft: Partial<T>;
  columns: Column<T>[];
  loading: boolean;
  onChange: (key: keyof T, value: string | string[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function DataTableEditRow<T extends { _id: string }>({
  row,
  draft,
  columns,
  loading,
  onChange,
  onSave,
  onCancel,
}: DataTableEditRowProps<T>) {
  return (
    <tr className="border-t border-neutral-100 bg-neutral-50">
      {columns.map((col) => {
        const rawValue = draft[col.key] ?? col.defaultValue ?? "";

        return (
          <td
            key={String(col.key)}
            className={`px-4 py-4 ${alignClass(col.align)}`}
          >
            {col.editable &&
            col.editable &&
            (!col.editableOn || col.editableOn === "edit") ? (
              col.values ? (
                col.multiple ? (
                  <DataTableMultipleInput
                    options={col.values.map((v) => ({
                      key: v.value,
                      value: v.label,
                    }))}
                    defaultValues={rawValue as string[]}
                    onChange={(next) => onChange(col.key, next)}
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
                  value={String(rawValue)}
                  onChange={(e) => onChange(col.key, e.target.value)}
                />
              )
            ) : (
              String(row[col.key] ?? "")
            )}
          </td>
        );
      })}

      <td className="px-4 py-4 text-right">
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
      </td>
    </tr>
  );
}
