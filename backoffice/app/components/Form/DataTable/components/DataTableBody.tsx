"use client";

import { Column } from "../DataTable";
import DataTableEditRow from "./DataTableEditRow";
import DataTableInsertRow from "./DataTableInsertRow";
import DataTableRow from "./DataTableRow";

interface TableBodyProps<T extends { _id: string }> {
  columns: Column<T>[];
  data: T[];

  canInsert: boolean;
  canEdit: boolean;
  canRemove: boolean;

  inserting: boolean;
  insertDraft: Partial<T>;
  draft: Partial<T>;
  editingId: string | null;
  loading: boolean;

  onStartInsert: () => void;
  onSaveInsert: () => void;
  onCancelInsert: () => void;
  onInsertChange: (key: keyof T, value: unknown) => void;

  onEditStart: (row: T) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditChange: (key: keyof T, value: unknown) => void;

  onRemove: (id: string) => void;
}

export default function TableBody<T extends { _id: string }>({
  columns,
  data,
  canInsert,
  canEdit,
  canRemove,
  inserting,
  insertDraft,
  draft,
  editingId,
  loading,
  onStartInsert,
  onSaveInsert,
  onCancelInsert,
  onInsertChange,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditChange,
  onRemove,
}: TableBodyProps<T>) {
  const showNoItems = !loading && data.length === 0;

  return (
    <tbody>
      {canInsert && (
        <DataTableInsertRow<T>
          columns={columns}
          inserting={inserting}
          insertDraft={insertDraft}
          loading={loading}
          onStart={onStartInsert}
          onSave={onSaveInsert}
          onCancel={onCancelInsert}
          onChange={onInsertChange}
        />
      )}

      {showNoItems && (
        <tr>
          <td
            colSpan={columns.length + (canEdit || canRemove ? 1 : 0)}
            className="h-100 text-center text-sm text-neutral-400"
          >
            No items found.
          </td>
        </tr>
      )}

      {data.map((row) =>
        row._id === editingId ? (
          <DataTableEditRow<T>
            key={row._id}
            row={row}
            columns={columns}
            draft={draft}
            loading={loading}
            onSave={onEditSave}
            onCancel={onEditCancel}
            onChange={onEditChange}
          />
        ) : (
          <DataTableRow<T>
            key={row._id}
            row={row}
            columns={columns}
            showActions={canEdit || canRemove}
            canEdit={canEdit}
            canRemove={canRemove}
            onEdit={() => onEditStart(row)}
            onRemove={() => onRemove(row._id)}
          />
        )
      )}
    </tbody>
  );
}
