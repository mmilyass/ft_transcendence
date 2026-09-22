'use client';

import Img from "next/image";

function DoctorRegisterHero() {
  return (
    <section className="lg:col-span-5 space-y-8 pt-12">
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold tracking-widest uppercase">
          Professional Network
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold text-on-background tracking-tight leading-[1.1]">
          Partner with clinical excellence.
        </h1>

        <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
          Join over 12,000 board-certified specialists using Maou
          <span className="text-blue-500">3</span>
          idy to streamline their digital practice and connect with patients.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary-fixed-dim p-3 rounded-xl text-primary">
            <span className="material-symbols-outlined">
              verified_user
            </span>
          </div>

          <div>
            <h3 className="font-bold text-on-surface">
              Verified Identity
            </h3>

            <p className="text-sm text-on-surface-variant">
              Secure credential verification for patient trust.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-primary-fixed-dim p-3 rounded-xl text-primary">
            <span className="material-symbols-outlined">
              analytics
            </span>
          </div>

          <div>
            <h3 className="font-bold text-on-surface">
              Practice Analytics
            </h3>

            <p className="text-sm text-on-surface-variant">
              Real-time data on patient bookings and retention.
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl h-64 shadow-xl">
        <Img
          fill
          loading="eager"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="absolute inset-0 object-cover"
          alt="Modern medical office with glass walls, clean minimalist interior, and a professional doctor holding a tablet in a soft lit environment"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuxGWOK3Rac8eDP76IXKsXa1MlbxnjHvgmeBpoTuCvnITlEUUekdeDiY7xbRssnn3HJb7v4C155JzPsub59XW_bREF8VjDuubuWsegRqZDWY6lpEC-VtgknwD0hJoLOXQpijuE5HUD3Fvz8wAWRt4bsooVX4aLNx9uu-2DN32P5p4rR-s4GY-aAXbGi9k_mAprlxCiOj1ZxXx7-T7w37hKLIeU_7azJwujTiDRvuwV_hYR4NWPDrO6tgLkD6YVs6jkHwdSpvXjrL0"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
          <p className="text-white font-medium italic text-sm">
            &quot;Maou
            <span className="text-blue-500">3</span>
            idy has transformed how I manage my cardiologist clinic in
            Manhattan.&quot;
          </p>

          <p className="text-white/80 text-xs mt-2">
            — Dr. Elena Rossi
          </p>
        </div>
      </div>
    </section>
  );
}

export default DoctorRegisterHero;