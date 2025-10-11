"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import axios from "axios";

export default function ForgetPassword() {
  const t = useTranslations('Auth.ForgetPassword');
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/auth/forget-password", { email });
      setMessage(t('resetLinkSent'));
    } catch (error: any) {
      setMessage(error.response?.data?.error || t('resetLinkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen [font-family:var(--font-poppins)] bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <p className="text-slate-600 text-sm">{t('secureReset')}</p>
        </div>

        {/* Reset Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
              {t('title')}
            </h2>
            <p className="text-slate-600 text-center text-sm">
              {t('description')}
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm text-center mb-4 ${
              message === t('resetLinkSent')
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                required
                className="w-full text-black px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-gradient active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('sending')}</span>
                </div>
              ) : (
                t('resetButton')
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              href={`/${locale}/login`}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {t('backToLogin')}
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            {t('secureReset')}
          </p>
        </div>
      </div>
    </div>
  );
}