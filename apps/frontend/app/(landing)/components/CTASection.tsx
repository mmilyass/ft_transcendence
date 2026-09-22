'use client';

import { useRouter } from 'next/navigation';


export function formatCount(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

export default function CTASection({doctorCount}: {doctorCount: number}) {
  const router = useRouter();

  const Count = formatCount(doctorCount);

  return (
        <section className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto rounded-3xl sm:rounded-[2.5rem] bg-linear-to-br from-primary to-blue-700 p-6 sm:p-12 lg:p-24 relative overflow-hidden text-center lg:text-left">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 sm:mb-8">Ready to prioritize your health?</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button onClick={() => router.push('/register')} className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-primary font-bold rounded-2xl text-base sm:text-lg hover:scale-105 active:scale-95 transition-all">Get Started</button>
                  <button onClick={() => router.push('/doctor-register')} className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/30 text-white font-bold rounded-2xl text-base sm:text-lg hover:bg-white/10 transition-all">Join as Doctor</button>
                </div>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 max-w-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold">{Count} Doctors</p>
                      <p className="text-white/60 text-xs">Ready to assist you today</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 bg-white/20 rounded-full w-full"></div>
                    <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded-full w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  );
}