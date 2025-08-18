// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import axios from "axios";
import Link from "next/link";


export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Auth.Login');

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        
        // Create and dispatch a CustomEvent instead of Event
        const authEvent = new CustomEvent('auth-change', {
          detail: { token: res.data.token }
        });
        window.dispatchEvent(authEvent);
        
        setMessage("Login successful! Redirecting...");
        
        // Add a small delay before redirect to allow state updates
        await new Promise(resolve => setTimeout(resolve, 100));
       router.push(res.data.redirectTo || '/')
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen [font-family:var(--font-poppins)] bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <p className="text-slate-600 text-sm">{t('secureLogin')}</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
              {t('title')}
            </h2>
            <p className="text-slate-600 text-center text-sm">
              {t('welcomeBack')}
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm text-center mb-4 ${
              message.includes("successful")
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
                name="email"
                placeholder={t('emailPlaceholder')}
                value={form.email}
                onChange={handleChange}
                required
                className="w-full text-black px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('passwordLabel')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t('passwordPlaceholder')}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href={`/${locale}/forgot-password`}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {t('forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-gradient active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('signingIn')}</span>
                </div>
              ) : (
                t('signInButton')
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="px-4 text-sm text-slate-500">or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Sign Up Links */}
          <div className="space-y-3">
            <p className="text-center text-sm text-slate-600">
              {t('noAccount')}
            </p>
            <div className="flex flex-col space-y-2">
              <Link 
                href={`/${locale}/signup?role=user`}
                className="w-full px-4 py-3 btn-secondary-glass text-center border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                {t('signUpUser')}
              </Link>
              <Link 
                href={`/${locale}/signup?role=authority`}
                className="w-full px-4 py-3 text-center border btn-primary-gradient bg-blue-50 rounded-xl hover:bg-blue-100 hover:border-blue-400 transition-colors"
              >
                {t('signUpAuthority')}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            {t('secureLogin')}
          </p>
        </div>
      </div>
    </div>
  );
}