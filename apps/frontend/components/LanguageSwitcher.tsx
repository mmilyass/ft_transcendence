'use client';

import { useRef, useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { locales } from '@/lib/i18n/translations';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = locales.find((l) => l.code === locale);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-600"
        aria-label="Change language"
      >
        <span className="material-symbols-outlined text-lg">language</span>
        <span className="hidden sm:inline">{current?.code.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors ${
                l.code === locale ? 'font-bold text-blue-600' : 'text-slate-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
