'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function HeroSection() {
  const t = useTranslations('HeroSection');

  return (
    <section className="pt-20 min-h-[calc(100vh-80px)] [font-family:var(--font-poppins)] bg-gray-50 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* LEFT: Text & Buttons */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            "{t('title')}"
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl">
            {t('subTitle')}
          </p>
          <div className="flex flex-col sm:flex-row mt-6 gap-4">
            <Link
              href="/"
              className="btn-primary-gradient text-white px-6 py-2 rounded-md transition hover:opacity-90 shadow text-center"
            >
              {t('ReportButton')}
            </Link>
            <Link
              href="/"
              className="btn-secondary-glass px-6 py-2 rounded-md transition hover:opacity-90 shadow text-center"
            >
              {t('viewAllIssue')}
            </Link>
          </div>
        </div>

        {/* RIGHT: Map */}
        <div className="h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden shadow-lg">
          <MapComponent />
        </div>
      </div>
    </section>
  );
}
