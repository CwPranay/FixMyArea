"use client";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { useEffect, useState } from "react";


export default  function AdminDashboard() {
const [authorities, setAuthorities] = useState<any[]>([]);
 useEffect(() => {
     async function fetchAuthorities() {
      const res = await fetch("/api/authorities"); // you’ll need an API route that returns authorities
      const data = await res.json();
      setAuthorities(data);
    }
    fetchAuthorities();


 },[])

  async function handleVerify(id: string, status: "approved" | "rejected") {
    try {
      const res = await fetch(`/api/authority/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      
     
      setAuthorities(prev=>prev.map(auth => auth._id === id ? { ...auth, authorityVerified: status } : auth))
    
    } catch (err) {
      console.error(err);
    }
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Authority Documents Verification
        </h2>
        <p className="text-gray-600 mb-8">
          Review and approve documents submitted by registered authorities.
        </p>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

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

                    <a
                      href={auth.authorityDocs[0]}
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
                    >
                      <FileText size={16} /> View Docs
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full 
    ${auth.authorityVerified === "approved"
                          ? "bg-green-100 text-green-700"
                          : auth.authorityVerified === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {auth.authorityVerified}
                    </span>

                  </td>
                  <td className="px-6 py-4 flex justify-end gap-3">
                    <button onClick={() => handleVerify(auth._id, "approved")} className="px-4 cursor-pointer py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm hover:shadow-md hover:scale-105 transition">
                      <CheckCircle size={14} className="inline mr-1" />
                      Approve
                    </button>
                    <button onClick={() => handleVerify(auth._id, "rejected")} className="px-4 cursor-pointer py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm hover:shadow-md hover:scale-105 transition">
                      <XCircle size={14} className="inline mr-1" />
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
