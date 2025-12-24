/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { compareValues } from "./helpers";

import TablePagination from "./components/DataTablePaging";
import TableHeader from "./components/DataTableHeader";
import DataTableBody from "./components/DataTableBody";

export type ActionType = "edit" | "insert" | "remove";

export type SelectOption = {
  value: string | null;
  label: string;
};

export type Column<T> = {
  key: keyof T;
  label: string;

  editable?: boolean;
  editableOn?: "insert" | "edit";

  sortable?: boolean;

  width?: number;
  align?: "left" | "center" | "right";

  values?: SelectOption[];
  defaultValue?: string | string[] | null;
  multiple?: boolean;

  truncate?: boolean;

  render?: (value: any, row: T) => React.ReactNode;
};

export type DataTableProps<T extends { _id: string; editable?: boolean }> = {
  columns: Column<T>[];
  data: T[];
  actions?: ActionType[];
  pageSize?: number;
  onSave?: (id: string, values: Partial<T>) => Promise<void> | void;
  onInsert?: (values: Partial<T>) => Promise<void> | void;
  onRemove?: (id: string) => Promise<void> | void;
};

export default function DataTable<
  T extends { _id: string; editable?: boolean }
>({
  columns,
  data,
  actions = [],
  pageSize = 20,
  onSave,
  onInsert,
  onRemove,
}: DataTableProps<T>) {
  const canEdit = actions.includes("edit");
  const canInsert = actions.includes("insert");
  const canRemove = actions.includes("remove");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<T>>({});
  const [insertDraft, setInsertDraft] = useState<Partial<T>>({});
  const [inserting, setInserting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const sortedData = useMemo(() => {
    if (!sort.key) return data;
    return [...data].sort((a, b) => {
      const key = sort.key as keyof T;
      return compareValues(a[key], b[key], sort.direction);
    });
  }, [data, sort]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const saveEdit = async () => {
    if (!editingId || !onSave) return;

    const toastId = toast.loading("Saving...");

    try {
      setLoading(true);
      await onSave(editingId, draft);
      setEditingId(null);
      setDraft({});
      toast.success("Saved successfully", { id: toastId });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error saving record";
      toast.error(message, { id: toastId });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  /* -------------------- INSERT -------------------- */
  const startInsert = () => {
    if (!canInsert) return;

    const initialDraft: Partial<T> = {};

    columns.forEach((col) => {
      if (!col.editable) return;

      if (col.values?.length && col.defaultValue !== undefined) {
        initialDraft[col.key] = col.defaultValue as any;
      }
    });

    setInsertDraft(initialDraft);
    setInserting(true);
  };

  const saveInsert = async () => {
    if (!onInsert) return;

    const toastId = toast.loading("Creating...");

    try {
      setLoading(true);
      await onInsert(insertDraft);
      setInserting(false);
      setInsertDraft({});
      toast.success("Created successfully", { id: toastId });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error creating record";
      toast.error(message, { id: toastId });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const cancelInsert = () => {
    setInserting(false);
    setInsertDraft({});
  };

  /* -------------------- DELETE -------------------- */

  const confirmRemove = (id: string) => {
    if (!onRemove) return;

    toast("Delete record?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          const toastId = toast.loading("Deleting...");

          try {
            setLoading(true);
            await onRemove(id);
            toast.success("Deleted successfully", { id: toastId });
          } catch (e) {
            const message =
              e instanceof Error ? e.message : "Error deleting record";
            toast.error(message, { id: toastId });
            throw e;
          } finally {
            setLoading(false);
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick() {},
      },
    });
  };

  const toggleSort = (key: keyof T) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="bg-white border border-neutral-200 rounded overflow-hidden">
      <table className="w-full text-sm table-fixed">
        <TableHeader
          columns={columns}
          sort={sort}
          onSort={toggleSort}
          showActions={canEdit || canInsert || canRemove}
        />

        <DataTableBody<T>
          columns={columns}
          data={paginatedData}
          canInsert={canInsert}
          canEdit={canEdit}
          canRemove={canRemove}
          inserting={inserting}
          insertDraft={insertDraft}
          draft={draft}
          editingId={editingId}
          loading={loading}
          onStartInsert={startInsert}
          onSaveInsert={saveInsert}
          onCancelInsert={cancelInsert}
          onInsertChange={(key, value) =>
            setInsertDraft((prev) => ({ ...prev, [key]: value }))
          }
          onEditStart={(row) => {
            setEditingId(row._id);
            setDraft({ ...row } as Partial<T>);
          }}
          onEditSave={saveEdit}
          onEditCancel={cancelEdit}
          onEditChange={(key, value) =>
            setDraft((prev) => ({ ...prev, [key]: value }))
          }
          onRemove={confirmRemove}
        />
      </table>

      <TablePagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}
