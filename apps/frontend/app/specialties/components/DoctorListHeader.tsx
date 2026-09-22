'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface DoctorListHeaderProps {
  totalDoctors: number;
}

export default function DoctorListHeader({
  totalDoctors,
}: DoctorListHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = searchParams.get('sort') || 'rating';

  const handleSortChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set('sort', e.target.value);
    params.set('page', '1');

    router.push(
      `/specialties?${params.toString()}`
    );
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-on-surface-variant font-medium">
        Showing{' '}
        <span className="font-bold text-on-surface">
          {totalDoctors}
        </span>{' '}
        Doctors
      </p>

      <div className="flex items-center gap-2">
        <span className="text-sm text-outline">
          Sort by:
        </span>

        <select
          value={sort}
          onChange={handleSortChange}
          className="bg-transparent font-bold text-primary outline-none"
        >
          <option value="rating">
            Highest Rated
          </option>

          <option value="experience">
            Most Experience
          </option>

          <option value="availability">
            Availability
          </option>
        </select>
      </div>
    </div>
  );
}