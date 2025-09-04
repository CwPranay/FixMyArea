"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLocale } from "next-intl";

export default function AdminDashboardPage() {
  const [user, setUser] = useState<null | { id: string; name: string; email: string; role: string }>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    async function verifyAuth() {
      try {
        setLoading(true);
        const res = await fetch('/api/auth/verify/', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Authentication failed');
        }
        
        const data = await res.json().catch(() => ({}));
        if (!data?.user) {
          router.push(`/${locale}/login`);
          return;
        }

        if (data.user.role !== 'admin') {
          router.push(`/${locale}/access-denied`);
          return;
        }
        
        setUser(data.user);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        router.push(`/${locale}/login`);
      } finally {
        setLoading(false);
      }
    }
    
    verifyAuth();
  }, [router]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <AdminDashboardClient user={user} />;
}
