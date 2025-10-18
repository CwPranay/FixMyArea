"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
    const t = useTranslations('Auth.ResetPassword');
    const locale = useLocale();
    const params = useParams();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageCode, setMessageCode] = useState("");


    if (!params || !params.token) {
        throw new Error("Token is missing from URL");
    }

    const token = params.token;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessageCode("passwordMismatch");
            setMessage(t('passwordMismatch'));
            return;
        }

        setLoading(true);
        setMessage("");
        setMessageCode("");

        try {
            const res = await fetch(`/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessageCode("passwordResetSuccess");
                setMessage(t(data.code || "passwordResetSuccess"));
                setTimeout(() => router.push(`/${locale}/login`), 3000);
            } else {
                setMessageCode(data.code || "serverError");
                setMessage(t(data.code || "serverError"));
            }
        }
        catch (err: any) {
            setMessageCode("serverError");
            setMessage(t("serverError"));
        }
        setLoading(false);
    };


    return (
        <div className="min-h-screen [font-family:var(--font-poppins)] flex text-black items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                <h2 className="text-2xl font-bold text-center mb-4">{t("title")}</h2>
                <p className="text-sm text-slate-600 text-center mb-6">{t("description")}</p>

                {message && (
                    <div
                        className={`p-3 rounded-lg text-sm text-center mb-4 ${messageCode === "passwordResetSuccess"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-2">{t("newPassword")}</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder={t("newPasswordPlaceholder")}
                                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{t("confirmPassword")}</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder={t("confirmPasswordPlaceholder")}
                                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary-gradient active:scale-[0.98]"
                    >
                        {loading ? t("resetting") : t("resetButton")}
                    </button>
                </form>
            </div>
        </div>
    );

}