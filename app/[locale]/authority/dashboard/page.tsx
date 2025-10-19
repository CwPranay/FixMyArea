"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AuthorityDashboardClient from "./AuthorityDashboardClient";
import { Loader2 } from 'lucide-react';

export default function AuthorityDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If not authenticated or not an authority, redirect to home
    if (!isAuthenticated || user?.role !== 'authority') {
      router.push('/');
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authority, show nothing (will redirect)
  if (!isAuthenticated || user?.role !== 'authority') {
    return null;
  }

  return <AuthorityDashboardClient />;
}
