import Link from "next/link";

interface Props {
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

export default function UsersPagination({
  totalResults,
  currentPage,
  totalPages,
}: Props) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <p className="text-xs font-medium text-slate-500">
        Showing {(currentPage - 1) * 10 + 1} to{" "}
        {Math.min(currentPage * 10, totalResults)} of{" "}
        {totalResults} results
      </p>

      <div className="flex gap-1">
        {/* Previous */}
        {currentPage > 1 ? (
          <Link
            href={`/admin/users?page=${currentPage - 1}`}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
          </Link>
        ) : (
          <button
            disabled
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 opacity-30"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
          </button>
        )}

        {/* Page numbers */}
        {Array.from(
          { length: totalPages },
          (_, i) => i + 1
        ).map((page) => (
          <Link
            key={page}
            href={`/admin/users?page=${page}`}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm ${
              currentPage === page
                ? "bg-primary text-on-primary"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {page}
          </Link>
        ))}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={`/admin/users?page=${currentPage + 1}`}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </Link>
        ) : (
          <button
            disabled
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 opacity-30"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </button>
        )}
      </div>
    </div>
  );
}