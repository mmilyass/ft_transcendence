'use client';


export default function DashboardHeader({ name }: { name: string }) {
  return (
        <header className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold font-manrope tracking-tight text-on-surface">
                Clinic Overview
              </h1>
              <p className="text-slate-500 font-medium">
                Welcome back, Dr. {name}. Here&apos;s what&apos;s happening today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                <span className="text-sm font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
        </header>
  );
}