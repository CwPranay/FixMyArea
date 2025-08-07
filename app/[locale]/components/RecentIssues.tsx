'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Issue {
  image: string;
  id: string;
}

const recentIssues: Issue[] = [
  {
    image: 'https://media.istockphoto.com/id/174662203/photo/pot-hole.jpg?s=1024x1024&w=is&k=20&c=LKiVcmmPb1i6FXtcx9LUz7EahvV7aF_YiVOk_b5x9gE=',
    id: 'pothole',
  },
  {
    image: 'https://media.istockphoto.com/id/496026170/photo/broken-street-lamp.jpg?s=1024x1024&w=is&k=20&c=mnRMAYFkiFnwKoIu3ff35sUn92YdMy4tG8WPEQHUbSA=',
    id: 'streetlight',
  },
  {
    image: 'https://media.istockphoto.com/id/155382228/photo/overflowing-wheelie-bin.jpg?s=1024x1024&w=is&k=20&c=eqUOjcgt5rkhgLKG08-fkF6O_xiRHHZ1ch93A1DQRWE=',
    id: 'garbageOverflow',
  },
];

export default function RecentIssues() {
  const t = useTranslations("RecentIssues");
  return (
    <section
      id="recent-issues"
      className="py-12 px-4 sm:px-6 md:px-8 bg-gray-50  [font-family:var(--font-poppins)]"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-900">
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recentIssues.map((issue,index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 text-left"
            >
              <Image
                src={issue.image}
                alt={t(`issues.${issue.id}.title`) || "Issue image"}

                width={400}
                height={200}
                loading="lazy"
                className="rounded-lg mb-4 object-cover w-full h-[200px]"
              />
              <h3 className="text-lg font-semibold text-gray-800">{t(`issues.${issue.id}.title`)}</h3>
              <p className="text-gray-600 text-sm mb-2">{t(`issues.${issue.id}.description`)}</p>
              <span className="text-xs text-gray-500 block">📍{t(`issues.${issue.id}.location`)}</span>
            </div>
          ))}
        </div>

        <button aria-label={t('viewAll')}
          title={t('viewAll')} className="mt-10 px-6 py-3  text-white font-semibold rounded-lg btn-primary-gradient transition">
          {t('viewAll')}
        </button>
      </div>
    </section>
  );
}
