"use client";

import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/context/AuthContext';

export default function AccessDenied() {
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated, role } = useAuth();

  const handleGoBack = () => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
    } else if (role === 'admin') {
      router.push(`/${locale}/admin/dashboard`);
    } else {
      router.push(`/${locale}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
          <p className="text-slate-600">
            You don't have permission to access this page. Please make sure you are logged in with the correct account.
          </p>
        </div>
        <button
          onClick={handleGoBack}
          className="w-full px-4 py-3 btn-primary-gradient rounded-xl transition-transform active:scale-[0.98]"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
