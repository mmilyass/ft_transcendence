"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function PrivacyPolicy() {
    const year = new Date().getFullYear();
    const { t } = useI18n();
    return (
        <>
            <footer className="w-full border-t border-slate-200 bg-slate-50">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-6 max-w-screen-2xl mx-auto">
                    <div className="text-xs text-slate-500 font-inter">© {year} Maou<span className="text-blue-500">3</span>idy Clinical Systems. {t('footer.rights')}</div>
                    <div className="flex flex-wrap justify-center gap-8 font-inter text-xs">
                        <Link href="/privacy-policy" className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">{t('footer.privacyPolicy')}</Link>
                        <Link href="/terms-of-service" className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">{t('footer.termsOfService')}</Link>
                        <Link href="/status" className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">{t('footer.status')}</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}
