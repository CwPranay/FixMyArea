'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '../admin/dashboard/page';
const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function HeroSection() {
  const t = useTranslations('HeroSection');
  const {user,role}=useAuth();

 
  if(role==="admin")
  {
    return <AdminDashboard/>
  }
  else
       return (
    <section className="pt-22  lg:pt-20    sm:h-auto md:height-auto  lg:min-h-[calc(100vh-80px)] [font-family:var(--font-poppins)] bg-gray-50 px-4">
      
       <div className="max-w-7xl  mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        
        {/* LEFT: Text & Buttons */}
        <div className="flex  flex-col items-center md:items-start text-center md:text-left justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-6">
            {t('subTitle')}
          </p>
          <div className="flex  sm:flex-row gap-4">
            <Link
              href="/report-issue"
              className="btn-primary-gradient text-white px-6 py-2 rounded-md transition hover:opacity-90 shadow text-center"
            >
              {t('ReportButton')}
            </Link>
            <Link
              href="/viewAll-issues"
              className="btn-secondary-glass px-6 py-2 rounded-md transition hover:opacity-90 shadow text-center"
            >
              {t('viewAllIssue')}
            </Link>
          </div>
        </div>

        {/* RIGHT: Map — only visible on md+ */}
        <div className="hidden md:block lg:block rounded-xl z-0 overflow-hidden shadow-lg">
          <MapComponent />
        </div>
      </div>
    </section>
  );
}
