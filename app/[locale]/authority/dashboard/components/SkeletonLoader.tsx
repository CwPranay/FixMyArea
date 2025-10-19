"use client";

import { useTranslations } from "next-intl";

export function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-gray-200 w-12 h-12"></div>
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-20 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-32"></div>
    </div>
  );
}

export function SkeletonChart() {
  const t = useTranslations('AuthorityDashboard.charts');
  
  return (
    <div className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
      <div className="h-[250px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-300 text-sm">{t('loadingChart')}</div>
      </div>
    </div>
  );
}

export function SkeletonAttentionItem() {
  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 animate-pulse">
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div className="flex-1 w-full">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export function SkeletonAttentionList() {
  return (
    <div className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonAttentionItem key={i} />
        ))}
      </div>
      <div className="h-10 bg-gray-200 rounded-lg mt-4 animate-pulse"></div>
    </div>
  );
}

export function SkeletonFeedback() {
  return (
    <div className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="h-[150px] bg-gray-100 rounded-lg"></div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      <div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-3 h-3 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  const t = useTranslations('AuthorityDashboard');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions Skeleton */}
        <div className="mb-8 flex justify-center">
          <div className="h-12 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <SkeletonChart key={i} />
          ))}
        </div>

        {/* Attention List Skeleton */}
        <div className="mb-8">
          <SkeletonAttentionList />
        </div>

        {/* Feedback Skeleton */}
        <SkeletonFeedback />
      </main>
    </div>
  );
}
