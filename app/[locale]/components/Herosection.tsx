'use client';

import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '../admin/dashboard/page';
import LoadingButton from './LoadingButton';
import { Sparkles, TrendingUp, MapPin } from 'lucide-react';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function HeroSection() {
  const t = useTranslations('HeroSection');
  const { user, role } = useAuth();
  const locale = useLocale();

  if (role === "admin") {
    return <AdminDashboard />
  }

  return (
    <section className="relative pt-24 lg:pt-28 pb-16 lg:min-h-[calc(100vh-80px)] [font-family:var(--font-poppins)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative z-10">
        {/* LEFT: Text & Buttons */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left justify-center space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">{t('badge')}</span>
          </div>

          {/* Heading with gradient */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            {t('title').split(' ').map((word, i) => (
              <span key={i} className={i === 2 ? 'blue-gradient-text' : ''}>
                {word}{' '}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
            {t('subTitle')}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1000+</p>
                <p className="text-xs text-gray-600">{t('issuesResolved')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">50+</p>
                <p className="text-xs text-gray-600">{t('activeAreas')}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <LoadingButton
              loadingText={t('ReportButton')}
              onClick={() => window.location.href = `/${locale}/report-issue`}
              text={t('ReportButton')}
              className="btn-primary-gradient text-white px-8 py-3.5 rounded-xl shadow-lg text-center font-semibold hover:shadow-xl transition-all transform hover:-translate-y-1"
            />
            <LoadingButton
              onClick={() => window.location.href = `/${locale}/viewAll-issues`}
              loadingText={t('viewAllIssue')}
              text={t('viewAllIssue')}
              className="btn-secondary-glass px-8 py-3.5 rounded-xl shadow-md text-center font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1"
            />
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white"></div>
              ))}
            </div>
            <span>{t('trustedBy')} <strong className="text-gray-900">5000+</strong> {t('citizens')}</span>
          </div>
        </div>

        {/* RIGHT: Map with modern styling */}
        <div className="hidden md:block relative animate-slide-in-right">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/50 backdrop-blur-sm transform hover:scale-[1.02] transition-transform duration-500">
            <MapComponent />
          </div>
          {/* Floating card */}
          <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t('realTimeUpdates')}</p>
                <p className="text-xs text-gray-600">{t('trackReports')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
        <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
