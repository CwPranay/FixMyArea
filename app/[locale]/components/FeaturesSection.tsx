'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Features() {
  const t = useTranslations('Features');

  return (
    <section
      id="features"
      className="py-16 px-4 sm:px-6 md:px-8 bg-gray-50 [font-family:var(--font-poppins)]"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {t('title')}
        </h2>
        <p className="mt-4 text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-6 max-w-6xl mx-auto">
        {/* Feature 1 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <div className="text-indigo-600 text-4xl mb-4">📍</div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t('locationBased.title')}
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            {t('locationBased.description')}
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <div className="text-green-600 text-4xl mb-4">🌐</div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t('multiLanguage.title')}
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            {t('multiLanguage.description')}
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <div className="text-blue-600 text-4xl mb-4">📸</div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t('photoEvidence.title')}
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            {t('photoEvidence.description')}
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
          <div className="text-yellow-600 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t('trackProgress.title')}
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            {t('trackProgress.description')}
          </p>
        </div>
      </div>
    </section>
  );
}
