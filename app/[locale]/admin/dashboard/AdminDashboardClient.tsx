"use client";

import { CheckCircle, XCircle, FileText } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboardClient({ user }: { user: any }) {
  const [authorities, setAuthorities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAuthorities() {
      try {
        const res = await fetch("/api/authorities");
        if (!res.ok) {
          throw new Error("Failed to fetch authorities");
        }
        const data = await res.json();
        setAuthorities(data);
      } catch (err) {
        setError("Failed to load authorities");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthorities();
  }, []);

  async function handleVerify(id: string, status: "approved" | "rejected") {
    try {
      const res = await fetch(`/api/authority/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");

      setAuthorities(prev => prev.map(auth => auth._id === id ? { ...auth, authorityVerified: status === "approved" } : auth))

    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading authorities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <p className="mt-4 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl py-6 px-4 sm:py-10 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            Authority Documents Verification
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Review and approve documents submitted by registered authorities.
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-100/80">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Authority</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Documents</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {authorities.map((auth: any) => (
                <tr key={auth._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{auth.name}</td>
                  <td className="px-6 py-4 text-gray-600">{auth.email}</td>
                  <td className="px-6 py-4">
                    {auth.authorityDocs && auth.authorityDocs[0] && (
                      <a
                        href={auth.authorityDocs[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
                      >
                        <FileText size={16} /> View Docs
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full 
                        ${auth.authorityVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {auth.authorityVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-3">
                    {!auth.authorityVerified && (
                      <>
                        <button
                          onClick={() => handleVerify(auth._id, "approved")}
                          className="px-4 cursor-pointer py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm hover:shadow-md hover:scale-105 transition"
                        >
                          <CheckCircle size={14} className="inline mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(auth._id, "rejected")}
                          className="px-4 cursor-pointer py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm hover:shadow-md hover:scale-105 transition"
                        >
                          <XCircle size={14} className="inline mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {authorities.map((auth: any) => (
            <div key={auth._id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{auth.name}</h3>
                  <p className="text-sm text-gray-600 break-all">{auth.email}</p>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full 
                      ${auth.authorityVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {auth.authorityVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>

              {/* Documents Link */}
              <div className="mb-4">
                {auth.authorityDocs && auth.authorityDocs[0] && (
                  <a
                    href={auth.authorityDocs[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium text-sm"
                  >
                    <FileText size={18} /> View Documents
                  </a>
                )}
              </div>

              {!auth.authorityVerified && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVerify(auth._id, "approved")}
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 touch-manipulation"
                  >
                    <CheckCircle size={16} className="inline mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerify(auth._id, "rejected")}
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 touch-manipulation"
                  >
                    <XCircle size={16} className="inline mr-2" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {authorities.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No authorities to review</h3>
            <p className="text-gray-600">Check back later for new submissions.</p>
          </div>
        )}
      </main>
    </div>
  );
}
