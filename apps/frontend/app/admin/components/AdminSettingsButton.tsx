'use client';

import { useRouter } from 'next/navigation';

export default function AdminSettingsButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/admin/settings')}
      className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-all"
    >
      <span className="material-symbols-outlined">
        settings
      </span>
    </button>
  );
}