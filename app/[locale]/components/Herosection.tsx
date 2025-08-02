'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

export default function HeroSection() {
  const t = useTranslations('HeroSection');
  return (
    <section className="pt-20 min-h-[calc(100vh-80px)] [font-family:var(--font-poppins)] bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          "{t('title')}"
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
          {t('subTitle')}
        </p>
        <div className="flex mt-4 space-x-4 ml-3">
          <Link
            href="/"
            className="btn-primary-gradient text-white px-4 py-2 rounded-md transition hover:opacity-90 shadow"
          >
            {t('ReportButton')}
          </Link>
          <Link
            href="/"
            className="btn-secondary-glass px-4 py-2 rounded-md transition hover:opacity-90 shadow"
          >
            {t('viewAllIssue')}
          </Link>
        </div>
      </div>
    </section>
  );
}