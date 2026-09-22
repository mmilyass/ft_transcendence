'use client';

import Img from 'next/image';
import { DoctorDetailResponse } from "@/types/types";

type Props = {
  doctor: DoctorDetailResponse['doctor'];
};

export default function DoctorHero({ doctor }: Props) {
  const primaryLocation = doctor.location.find((l) => l.isPrimary) ?? doctor.location[0] ?? null;
  const imageSrc = doctor.profileImage || doctor.user.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user.name)}`;

    return (
                <section className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 mb-8 sm:mb-12">
                  <div className="md:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden flex flex-col md:flex-row items-center md:items-end p-5 sm:p-8 gap-5 sm:gap-8 relative">
                    {/* Profile Image */}
                    <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 shrink-0">
                      <Img
                        width={400}
                        height={400}
                        loading="eager"
                        alt={`Dr. ${doctor.user.name}`}
                        className="w-full h-full object-cover rounded-2xl shadow-xl shadow-primary/10"
                        src={imageSrc}
                      />
                    </div>
                    <div className="grow space-y-3 sm:space-y-4 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        {doctor.verified && (
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1 uppercase">
                            <span className="material-symbols-outlined text-sm material-fill">verified</span>
                            Verified Specialist
                          </span>
                        )}
                      </div>
                      <div>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">
                          Dr. {doctor.user.name}
                        </h1>
                        <p className="text-base sm:text-xl text-secondary font-medium mt-1">
                          {doctor.speciality} • {doctor.experience}+ Years Experience
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">location_on</span>
                          <span className="text-sm font-medium text-on-surface-variant">
                            {primaryLocation
                              ? `${primaryLocation.city}, ${primaryLocation.state}`
                              : 'Location not available'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">star</span>
                          <span className="text-sm font-bold text-on-surface">{doctor.rating}</span>
                          <span className="text-sm text-on-surface-variant">({doctor.reviewCount} Reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Quick Stats Bento Item */}
                  <div className="md:col-span-4 grid grid-cols-2 gap-4">
                    <div className="bg-primary-fixed-dim/30 p-6 rounded-3xl flex flex-col justify-between">
                      <span className="material-symbols-outlined text-primary text-3xl">
                        groups
                      </span>
                      <div>
                        <div className="text-2xl font-headline font-bold text-on-primary-fixed">
                          {doctor.experience}+
                        </div>
                        <div className="text-xs font-label uppercase tracking-widest text-on-primary-fixed-variant">
                          Years Exp.
                        </div>
                      </div>
                    </div>
                    <div className="bg-secondary-fixed-dim/30 p-6 rounded-3xl flex flex-col justify-between">
                      <span className="material-symbols-outlined text-secondary text-3xl">
                        workspace_premium
                      </span>
                      <div>
                        <div className="text-2xl font-headline font-bold text-on-secondary-fixed">
                          {doctor.rating.toFixed(1)}
                        </div>
                        <div className="text-xs font-label uppercase tracking-widest text-on-secondary-fixed-variant">
                          Rating
                        </div>
                      </div>
                    </div>
                    {doctor.languages.length > 0 && (
                      <div className="col-span-2 bg-surface-container-low p-6 rounded-3xl">
                        <h4 className="font-headline font-bold mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">language</span>
                          Languages
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {doctor.languages.map((lang) => (
                            <span key={lang} className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-medium">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
    );
}
