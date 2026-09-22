'use client';

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_URL + '/doctor/specialities');
        setSpecialities(response.data.specialties);
      } catch (error) {
        console.error('Failed to load specialities:', error);
      }
    };
    fetchSpecialities();
  }, []);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    params.set('page', '1');
    router.push(`/specialties?${params.toString()}`);
  };

  const resetFilters = () => {
    const search = searchParams.get('search');
    const params = new URLSearchParams();
    if (search) { params.set('search', search); }
    params.set('page', '1');
    router.push(`/specialties?${params.toString()}`);
  };

  const filterContent = (
    <>
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-4">Speciality</label>
        <div className="space-y-3">
          {specialities.map((speciality) => (
            <label key={speciality} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="speciality" checked={searchParams.get('speciality') === speciality} onChange={() => updateFilter('speciality', speciality)} />
              <span>{speciality}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-4">Minimum Rating</label>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="radio" name="rating" checked={searchParams.get('rating') === '4.5'} onChange={() => updateFilter('rating', '4.5')} />
            <span>4.5 ★ & above</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="radio" name="rating" checked={searchParams.get('rating') === '4.0'} onChange={() => updateFilter('rating', '4.0')} />
            <span>4.0 ★ & above</span>
          </label>
        </div>
      </div>
    </>
  );

  return (
    <aside className="w-full lg:w-72 shrink-0">
      {/* Mobile toggle button */}
      <button
        className="lg:hidden w-full flex items-center justify-between bg-surface-container-low rounded-xl px-5 py-3 font-bold mb-2"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Filters</span>
        <span className="material-symbols-outlined">{open ? 'expand_less' : 'expand_more'}</span>
      </button>

      {/* Mobile collapsible panel */}
      {open && (
        <div className="lg:hidden bg-surface-container-low rounded-xl p-5 mb-4">
          <div className="flex justify-end mb-4">
            <button onClick={resetFilters} className="text-primary text-sm font-semibold hover:underline">Reset All</button>
          </div>
          {filterContent}
        </div>
      )}

      {/* Desktop always-visible panel */}
      <div className="hidden lg:block bg-surface-container-low rounded-xl p-6 sticky top-28">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Filters</h2>
          <button onClick={resetFilters} className="text-primary text-sm font-semibold hover:underline">Reset All</button>
        </div>
        {filterContent}
      </div>
    </aside>
  );
}