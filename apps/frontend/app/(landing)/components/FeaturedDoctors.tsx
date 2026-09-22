'use client';

import Img from 'next/image';
import { useRouter } from 'next/navigation';
import { FeaturedDoctor } from '@/services/landingPageService';

type Props = {
  doctors: FeaturedDoctor[];
};

export default function FeaturedDoctors({ doctors }: Props) {
  const router = useRouter();

  return (
    <section className="py-16 sm:py-24 bg-surface-container-low px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
              Our Top-Rated Specialists
            </h2>
            <p className="text-on-surface-variant">
              Qualified professionals across multiple disciplines.
            </p>
          </div>

          <button
            onClick={() => router.push('/specialties')}
            className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
          >
            View all specialties
            <span className="material-symbols-outlined">
              arrow_forward
            </span>
          </button>
        </div>

{doctors.length === 0 ? (
  <div className="bg-surface-container-lowest rounded-3xl p-12 text-center border border-outline-variant">
    <div className="flex justify-center mb-4">
      <span className="material-symbols-outlined text-6xl text-primary">
        medical_services
      </span>
    </div>

    <h3 className="text-2xl font-bold mb-2">
      No Featured Doctors Available
    </h3>

    <p className="text-on-surface-variant max-w-md mx-auto mb-6">
      We don&apos;t have any featured specialists to display right now.
      Please check back later or explore our specialties.
    </p>

    <button
      onClick={() => router.push('/specialties')}
      className="px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold hover:opacity-90 transition"
    >
      Browse Specialties
    </button>
  </div>
) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-surface-container-lowest p-5 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="relative mb-4 rounded-xl overflow-hidden aspect-square">
                <Img
                  width={500}
                  height={500}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  src={doctor.user.image}
                  alt={`${doctor.user.name}`}
                />

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                  <span
                    className="material-symbols-outlined text-yellow-500 text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  {doctor.rating}
                </div>
              </div>

              <h3 className="font-bold text-lg mb-1">
                Dr. {doctor.user.name}
              </h3>

              <p className="text-primary text-sm font-semibold mb-4">
                {doctor.speciality}
              </p>

              <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-6">
                <span className="material-symbols-outlined text-sm">
                  location_on
                </span>
                {doctor.location[0]
                  ? `${doctor.location[0].address}, ${doctor.location[0].city}, ${doctor.location[0].state}`
                  : "Location not available"}
              </div>

              <button
                onClick={() => router.push(`/booking?doctorId=${doctor.id}`)}
                className="w-full py-3 bg-surface-container-high rounded-xl font-bold text-sm hover:bg-primary hover:text-on-primary transition-colors"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
)} 
      </div>
    </section>
  );
}