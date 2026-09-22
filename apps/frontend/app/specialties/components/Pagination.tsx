'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set('page', page.toString());

    router.push(
      `/specialties?${params.toString()}`
    );
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="mt-12 flex justify-center items-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className="px-4 py-2 rounded-lg bg-surface-container-low disabled:opacity-50"
      >
        Previous
      </button>

      {Array.from(
        { length: totalPages },
        (_, i) => i + 1
      ).map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`w-10 h-10 rounded-lg font-semibold transition ${
            page === currentPage
              ? 'bg-primary text-white'
              : 'bg-surface-container-low hover:bg-surface-container-high'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="px-4 py-2 rounded-lg bg-surface-container-low disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}