'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AuthNavbarProps {
  variant?: 'default' | 'minimal';
}

export default function AuthNavbar({ variant = 'default' }: AuthNavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-4 sm:px-6 py-4 max-w-screen-2xl mx-auto w-full">
        <div
          onClick={() => router.push('/')}
          className="text-xl font-bold tracking-tighter text-slate-900 cursor-pointer font-manrope hover:opacity-80 transition-opacity"
        >
          Maou<span className="text-blue-500">3</span>idy
        </div>

        {variant === 'default' && (
          <>
            <nav className="hidden md:flex gap-8">
              <a className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-blue-700 transition-colors cursor-pointer">Find Doctors</a>
              <a className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-blue-700 transition-colors cursor-pointer">Specialties</a>
              <a className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-blue-700 transition-colors cursor-pointer">About Us</a>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => router.push('/login')} className="text-slate-600 font-manrope tracking-tight font-semibold px-4 py-2 hover:text-blue-700 active:scale-95 duration-200 transition-colors">Sign In</button>
              <button onClick={() => router.push('/doctor-register')} className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-95 duration-200 transition-all font-manrope">Join as Doctor</button>
            </div>

            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </>
        )}
      </div>
      <div className="bg-slate-200/50 h-px"></div>

      {variant === 'default' && mobileOpen && (
        <div className="md:hidden bg-slate-50 border-t border-slate-200 px-4 py-4 space-y-2">
          <a className="block px-3 py-2 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer">Find Doctors</a>
          <a className="block px-3 py-2 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer">Specialties</a>
          <a className="block px-3 py-2 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer">About Us</a>
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <button onClick={() => { router.push('/login'); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-semibold hover:bg-slate-100">Sign In</button>
            <button onClick={() => { router.push('/doctor-register'); setMobileOpen(false); }} className="w-full px-3 py-2 bg-primary text-on-primary rounded-xl font-semibold">Join as Doctor</button>
          </div>
        </div>
      )}
    </nav>
  );
}
