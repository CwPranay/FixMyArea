"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useLocale } from 'next-intl';
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { X, FileText, Image } from "lucide-react";
interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UploadedFile {
  url: string;
  name: string;
}

interface SelectedFile {
  file: File;
  preview: string;
  name: string;
}

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('Auth.Signup');
  
  const role = useMemo(() => searchParams?.get("role") || "user", [searchParams]);

  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [authorityDocs, setAuthorityDocs] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
    const [signupSuccess, setSignupSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "confirmPassword" || name === "password") {
      const newForm = { ...form, [name]: value };
      setPasswordMatch(newForm.password === newForm.confirmPassword || newForm.confirmPassword === "");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate file types and sizes
      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith("image/") || file.type === "application/pdf";
        const isValidSize = file.size <= 4 * 1024 * 1024; // 4MB
        return isValidType && isValidSize;
      });
      
      // Create preview URLs for images
      const newSelectedFiles: SelectedFile[] = validFiles.map(file => ({
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
        name: file.name
      }));
      
      setSelectedFiles(prev => [...prev, ...newSelectedFiles]);
      
      // Show warning if any files were invalid
      if (validFiles.length !== files.length) {
        setMessage(t('errors.invalidFiles'));
      }
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Revoke object URL to prevent memory leaks
      if (prev[index].preview) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return newFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage(t('passwordMismatch'));
      return;
    }

    if (role === "authority" && selectedFiles.length === 0) {
      setMessage(t('documentsRequired'));
      return;
    }

    setLoading(true);
    setMessage("");
    setSignupSuccess(false);

    try {
      let uploadedFiles: UploadedFile[] = [];
      
      // Upload files to UploadThing if authority role
      if (role === "authority" && selectedFiles.length > 0) {
        setMessage(t('uploadingDocuments'));
        
        try {
          console.log("Starting upload for", selectedFiles.length, "files");
          
          const formData = new FormData();
          selectedFiles.forEach(file => {
            formData.append("files", file.file);
          });

          const uploadResponse = await fetch("/api/upload-files", {
            method: "POST",
            body: formData
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || t('errors.uploadFailed'));
          }

          const uploadData = await uploadResponse.json();
          console.log("Upload response:", uploadData);
          
          uploadedFiles = uploadData.files;
          console.log("Extracted files:", uploadedFiles);
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(t('errors.uploadFailed'));
        }
      }

      setMessage(t('creatingAccount'));
      const response = await axios.post("/api/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        authorityDocs: uploadedFiles.map(file => file.url)
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.error || t('errors.signupFailed'));
      }

      setSignupSuccess(true);
      setMessage(
        role === "authority" 
          ? t('success.authority')
          : t('success.user')
      );
    } catch (error: any) {
      console.error("Signup error:", error);
      setMessage(error.response?.data?.error || error.message || t('errors.signupFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen [font-family:var(--font-poppins)] bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-slate-600 text-sm">{t('joinCommunity')}</p>
        </div>

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
              {message}
              <div className="mt-4">
                <button
                  className="px-4 py-2 btn-primary-gradient transition"
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
                  message.includes(t('success.user')) 
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
                    className="w-full px-4 py-3 text-black border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
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
                    className="w-full px-4 py-3 border text-black border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
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
                    className="w-full px-4 py-3 text-black border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
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
                    className={`w-full px-4 py-3 text-black border rounded-xl transition-colors placeholder-slate-400 focus:ring-2 ${
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
                        required={role === "authority"}
                        className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        {t('docsHelper')}
                      </p>
                    </div>
                    
                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <h4 className="text-sm font-medium text-slate-700">{t('selectedFiles')}:</h4>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                            >
                              <div className="flex items-center space-x-3">
                                {file.preview ? (
                                  <img 
                                    src={file.preview} 
                                    alt={file.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                ) : (
                                  <FileText className="w-10 h-10 text-red-500" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-slate-700 truncate max-w-xs">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSelectedFile(index)}
                                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                              >
                                <X className="w-4 h-4 text-slate-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !passwordMatch}
                  className="w-full px-4 py-3 btn-primary-gradient disabled:bg-blue-300 transition-colors"
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

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            {t('agreement')}
          </p>
        </div>
      </div>
    </div>
  );
}