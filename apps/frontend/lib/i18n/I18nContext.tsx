'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Locale, locales, translations } from './translations';

type I18nContextValue = {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const STORAGE_KEY = 'locale';

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  dir: 'ltr',
  setLocale: () => {},
  t: (key) => key,
});

function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && locales.some((l) => l.code === stored)) return stored;
  } catch {
  }
  const browserLang = window.navigator.language?.slice(0, 2);
  const matched = locales.find((l) => l.code === browserLang);
  return matched?.code ?? 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    setLocaleState(resolveInitialLocale());
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
    }
  };

  const dir = locales.find((l) => l.code === locale)?.dir ?? 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const t = (key: string): string => {
    return translations[locale]?.[key] ?? translations.en[key] ?? key;
  };

  return (
    <I18nContext.Provider value={{ locale, dir, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
