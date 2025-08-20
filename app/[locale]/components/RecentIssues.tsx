'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface Issue {
  image: string;
  id: string;
  reportedBy?: string;
}

function getInitial(name?: string) {
  if (!name) return 'A';
  return name.charAt(0).toUpperCase();
}

const recentIssues: Issue[] = [
  {
    image: 'https://media.istockphoto.com/id/174662203/photo/pot-hole.jpg?s=1024x1024&w=is&k=20&c=LKiVcmmPb1i6FXtcx9LUz7EahvV7aF_YiVOk_b5x9gE=',
    id: 'pothole',
    reportedBy: 'Pranay Gurav',
  },
  {
    image: 'https://media.istockphoto.com/id/496026170/photo/broken-street-lamp.jpg?s=1024x1024&w=is&k=20&c=mnRMAYFkiFnwKoIu3ff35sUn92YdMy4tG8WPEQHUbSA=',
    id: 'streetlight',
    reportedBy: 'Pranay Gurav',
  },
  {
    image: 'https://media.istockphoto.com/id/155382228/photo/overflowing-wheelie-bin.jpg?s=1024x1024&w=is&k=20&c=eqUOjcgt5rkhgLKG08-fkF6O_xiRHHZ1ch93A1DQRWE=',
    id: 'garbageOverflow',
    reportedBy: 'Pranay Gurav',
  },
];

export default function RecentIssues() {
  const t = useTranslations('RecentIssues');
  const {role} =useAuth()
 if(role==="admin")
 {return null;}
 else
  return (
    <section
      id="recent-issues"
      className="py-12 px-4 sm:px-6 md:px-8 bg-gray-50 [font-family:var(--font-poppins)]"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-900">
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recentIssues.map((issue, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 text-left flex flex-col justify-between h-full"
            >
              <Image
                src={issue.image}
                alt={t(`issues.${issue.id}.title`, { default: 'Issue image' })}
                width={400}
                height={200}
                loading="lazy"
                className="rounded-lg object-cover w-full h-[200px] mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {t(`issues.${issue.id}.title`, { default: 'Untitled Issue' })}
              </h3>
              <p className="text-gray-600 text-sm mb-2 leading-snug">
                {t(`issues.${issue.id}.description`, { default: 'No description available.' })}
              </p>
              <span className="text-xs text-gray-500 mb-3 block">
                📍 {t(`issues.${issue.id}.location`, { default: 'Unknown location' })}
              </span>

              <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
                {/* Avatar Circle (WhatsApp-style) */}
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold text-white shadow">
                  {getInitial(issue.reportedBy)}
                </div>
                <span className="text-xs text-gray-700 font-medium">
                  {issue.reportedBy || t('anonymous')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          aria-label={t('viewAll')}
          title={t('viewAll')}
          className="mt-10 px-6 py-3 text-white font-semibold rounded-lg btn-primary-gradient transition"
        >
          {t('viewAll')}
        </button>
      </div>
    </section>
  );
}
