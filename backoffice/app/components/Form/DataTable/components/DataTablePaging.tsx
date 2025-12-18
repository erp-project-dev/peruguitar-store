"use client";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function TablePagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-neutral-50 flex items-center justify-between px-4 py-2">
      <span className="text-xs text-neutral-500">
        Page {page} of {totalPages}
      </span>

      <div className="flex gap-1">
        <button
          disabled={page === 1}
          onClick={onPrev}
          className="px-2 py-1 text-xs border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <button
          disabled={page === totalPages}
          onClick={onNext}
          className="px-2 py-1 text-xs border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
