'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }

    params.set('page', '1');

    router.push(`/specialties?${params.toString()}`);
  };

  return (
    <section className="mb-12">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
          Find a Specialist
        </h1>

        <p className="text-on-surface-variant text-lg">
          Book appointments with top-rated medical professionals in your area.
        </p>
      </div>

      <div className="relative max-w-3xl">
        <div className="flex items-center bg-surface-container-lowest rounded-xl shadow-sm p-2">
          <span className="material-symbols-outlined px-4 text-outline">
            search
          </span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="w-full border-none focus:ring-0 bg-transparent text-on-surface py-3 text-lg"
            placeholder="Search by doctor name, specialty, or hospital..."
          />

          <button
            className="bg-primary text-white px-8 py-3 rounded-lg font-bold"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}