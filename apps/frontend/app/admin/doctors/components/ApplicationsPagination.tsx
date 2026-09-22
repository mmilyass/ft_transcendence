'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface ApplicationsPaginationProps {
  total: number;
  page: number;
  totalPages: number;
}

export default function ApplicationsPagination({
  total,
  page,
  totalPages,
}: ApplicationsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mt-8 flex items-center justify-between px-4">
      <div className="text-sm text-on-surface-variant font-medium">
        Page <span className="font-bold">{page}</span> of{' '}
        <span className="font-bold">{totalPages}</span> •{' '}
        <span className="font-bold">{total}</span> applications
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => updatePage(page - 1)}
          className="w-10 h-10 rounded-xl bg-surface-container-low disabled:opacity-50"
        >
          <span className="material-symbols-outlined">
            chevron_left
          </span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => updatePage(pageNumber)}
              className={`w-10 h-10 rounded-xl ${
                page === pageNumber
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              {pageNumber}
            </button>
          )
        )}

        <button
          disabled={page === totalPages}
          onClick={() => updatePage(page + 1)}
          className="w-10 h-10 rounded-xl bg-surface-container-low disabled:opacity-50"
        >
          <span className="material-symbols-outlined">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}