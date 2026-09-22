'use client';

import Img from 'next/image';
import { useRouter } from 'next/navigation';
import { DoctorLocation } from '@/types/doctor';

type DoctorCardProps = {
  id: string;
  name: string;
  image?: string | null;
  speciality: string;
  experience: number;
  rating: number;
  location: DoctorLocation[];
};

export default function DoctorCard({
  id,
  name,
  speciality,
  image,
  rating,
  experience,
  location,
}: DoctorCardProps) {
  const router = useRouter();

  return (
    <div className="group bg-surface-container-lowest rounded-xl overflow-hidden hover:shadow-lg transition-all">
      <div className="relative h-64 overflow-hidden">
        <Img
          src={image || '/default-doctor.png'}
          alt={name}
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-lg">
          ⭐ {rating.toFixed(1)}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-xl font-bold">{name}</h3>

          <p className="text-primary font-semibold text-sm">
            {speciality}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-surface-container-low px-3 py-1 rounded-full text-xs">
            {experience} years exp
          </span>

          {location.length > 0 && (
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
              {location[0].city}, {location[0].state}
            </span>
          )}
        </div>

        <button
          onClick={() =>
            router.push(`/booking?doctorId=${id}`)
          }
          className="w-full bg-surface-container-highest py-3 rounded-lg font-bold"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}