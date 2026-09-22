'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Navbar from '@/components/Navbar';
import InformationFooter from '@/components/InformationFooter';

import SearchSection from './components/SearchSection';
import FilterSidebar from './components/FilterSidebar';
import DoctorGrid from './components/DoctorGrid';
import DoctorListHeader from './components/DoctorListHeader';
import Pagination from './components/Pagination';

import { getDoctors } from './components/doctors';
import { DoctorsResponse } from '@/types/doctor';

export default function DoctorPage() {
  return (
    <Suspense fallback={null}>
      <DoctorPageInner />
    </Suspense>
  );
}

function DoctorPageInner() {
  const searchParams = useSearchParams();

  const [data, setData] =
    useState<DoctorsResponse | null>(null);

  const search = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctors = await getDoctors({
          search,
          location,
          page,
        });

        setData(doctors);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDoctors();
  }, [search, location, page]);

  return (
    <div className="bg-surface text-on-surface">
      <Navbar activeLink="specialties" />

      <main className="pt-24 pb-12 max-w-screen-2xl mx-auto px-6">
        <SearchSection />

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar />

          <div className="flex-1">
            <DoctorListHeader
              totalDoctors={data?.total || 0}
            />

            <DoctorGrid
              doctors={data?.doctors || []}
            />

            <Pagination
              currentPage={data?.page || 1}
              totalPages={data?.totalPages || 1}
            />
          </div>
        </div>
      </main>

      <InformationFooter />
    </div>
  );
}