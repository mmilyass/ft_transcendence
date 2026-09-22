'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UsersPageHeaderProps {
  search?: string;
  role?: string;
}

export default function UsersPageHeader({
  search,
  role,
}: UsersPageHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set('page', '1');

    router.push(`/admin/users?${params.toString()}`);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentFilterLabel =
    role === 'DOCTOR'
      ? 'Doctors'
      : role === 'USER'
      ? 'Patients'
      : 'All Users';

  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-1">
          Users Management
        </h1>

        <p className="text-on-surface-variant font-medium">
          Oversee and manage system access for clinical personnel and patients.
        </p>
      </div>

      <div className="flex gap-3">
        {/* Search */}
        <div className="flex items-center px-6 bg-surface-container-low rounded-xl">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              search
            </span>

            <input
              type="text"
              defaultValue={search}
              placeholder="Search users..."
              className="pl-10 pr-4 py-3 bg-transparent border-none rounded-full text-sm w-64 outline-none"
              onChange={(e) => updateParam('search', e.target.value)}
            />
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="w-44 px-5 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm flex items-center justify-between shadow-sm hover:opacity-90 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                filter_list
              </span>

              <span>{currentFilterLabel}</span>
            </div>

            <span
              className={`material-symbols-outlined text-sm transition-transform ${
                isFilterOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-surface-container-lowest rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <button
                onClick={() => updateParam('role', '')}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  !role
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  people
                </span>
                All Users
              </button>

              <button
                onClick={() => updateParam('role', 'DOCTOR')}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  role === 'DOCTOR'
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  medical_services
                </span>
                Doctors
              </button>

              <button
                onClick={() => updateParam('role', 'USER')}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  role === 'USER'
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  groups
                </span>
                Patients
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}