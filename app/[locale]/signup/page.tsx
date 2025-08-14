// pages/signup.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

      setMessage(res.data.message || "Signup successful!");
      router.push("/login");
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
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">FixMyArea</h1>
          </div>
          <p className="text-slate-600 text-sm">Join our community to report and fix local issues</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
              Create Account
            </h2>
            <p className="text-slate-600 text-center text-sm">
              {role === "authority" ? "Join as a Local Authority" : "Join as a Community Member"}
            </p>
            {role === "authority" && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700 text-xs text-center">
                  🏛️ Authority accounts require verification documents
                </p>
              </div>
            )}
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
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-xl transition-colors placeholder-slate-400 focus:ring-2 ${
                  passwordMatch 
                    ? "border-slate-300 focus:ring-blue-500 focus:border-blue-500" 
                    : "border-red-300 focus:ring-red-500 focus:border-red-500"
                }`}
              />
              {!passwordMatch && form.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            {role === "authority" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  📄 Authority Verification Documents
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
                    Upload ID proof, official documents (JPG, PNG, PDF)
                  </p>
                </div>
                {authorityDocs.length > 0 && (
                  <div className="mt-2 text-sm text-slate-600">
                    ✓ {authorityDocs.length} file(s) selected
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !passwordMatch}
              className="w-full btn-primary-gradient  active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                `Create ${role === "authority" ? "Authority" : "User"} Account`
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            By creating an account, you agree to help make your community better
          </p>
        </div>
      </div>
    </div>
  );
}