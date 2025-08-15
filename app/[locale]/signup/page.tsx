// pages/signup.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useLocale } from 'next-intl';
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('Auth.Signup');
  
  // Null-safe role fetching
  const role = useMemo(() => searchParams?.get("role") || "user", [searchParams]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [authorityDocs, setAuthorityDocs] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Check password match in real-time
    if (name === "confirmPassword" || name === "password") {
      const newForm = { ...form, [name]: value };
      setPasswordMatch(newForm.password === newForm.confirmPassword || newForm.confirmPassword === "");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAuthorityDocs(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");
    setSignupSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", role);

      if (role === "authority") {
        authorityDocs.forEach((file) => formData.append("authorityDocs", file));
      }

      const res = await axios.post("/api/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSignupSuccess(true);
      if (role === "authority") {
        setMessage("Account created! Your documents are under verification. You can login after approval.");
      } else {
        setMessage("Account created! You can login now.");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen [font-family:var(--font-poppins)] bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
         
          <p className="text-slate-600 text-sm">{t('joinCommunity')}</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
              {t('title')}
            </h2>
            <p className="text-slate-600 text-center text-sm">
              {role === "authority" ? t('asAuthority') : t('asUser')}
            </p>
            {role === "authority" && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700 text-xs text-center">
                  {t('authorityNotice')}
                </p>
              </div>
            )}
          </div>

          {signupSuccess ? (
            <div className="p-3 rounded-lg text-sm text-center mb-4 bg-green-50 text-green-700 border border-green-200">
              {role === "authority" ? t('success.authority') : t('success.user')}
              <div className="mt-4">
                <button
                  className="px-4 py-2 btn-primary-gradient text-white rounded-lg transition"
                  onClick={() => router.push(`/${locale}/login`)}
                >
                  {t('success.goToLogin')}
                </button>
              </div>
            </div>
          ) : (
            <>
              {message && (
                <div className={`p-3 rounded-lg text-sm text-center mb-4 ${
                  message.includes("successful") || message.includes("created")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('fullNameLabel')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder={t('fullNamePlaceholder')}
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full text-black px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
                  />
                </div>

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
                  <input
                    type="password"
                    name="password"
                    placeholder={t('passwordPlaceholder')}
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full text-black px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('confirmPasswordLabel')}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder={t('confirmPasswordPlaceholder')}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full text-black px-4 py-3 border rounded-xl transition-colors placeholder-slate-400 focus:ring-2 ${
                      passwordMatch 
                        ? "border-slate-300 focus:ring-blue-500 focus:border-blue-500" 
                        : "border-red-300 focus:ring-red-500 focus:border-red-500"
                    }`}
                  />
                  {!passwordMatch && form.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{t('passwordMismatch')}</p>
                  )}
                </div>

                {role === "authority" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      📄 {t('docsLabel')}
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        required
                        className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        {t('docsHelper')}
                      </p>
                    </div>
                    {authorityDocs.length > 0 && (
                      <div className="mt-2 text-sm text-slate-600">
                        ✓ {authorityDocs.length} {t('filesSelected')}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !passwordMatch}
                  className="w-full btn-primary-gradient active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('creatingAccount')}</span>
                    </div>
                  ) : (
                    role === "authority" ? t('createAuthorityButton') : t('createUserButton')
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            {t('agreement')}
          </p>
        </div>
      </div>
    </div>
  );
}