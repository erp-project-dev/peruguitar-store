"use client";

import { Column } from "../DataTable";
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

      {data.map((row) => (
        <DataTableRow<T>
          key={row._id}
          row={row}
          columns={columns}
          isEditing={row._id === editingId}
          draft={draft}
          loading={loading}
          canEdit={canEdit}
          canRemove={canRemove}
          onEdit={() => onEditStart(row)}
          onSave={onEditSave}
          onCancel={onEditCancel}
          onRemove={() => onRemove(row._id)}
          onChange={onEditChange}
        />
      ))}
    </tbody>
  );
}
