'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import HeroSection from './components/Herosection';
import HowItWorksSection from './components/HowItWorks';
import RecentIssues from './components/RecentIssues';

export default function Home() {
  const router = useRouter();
  const [showHomePage, setShowHomePage] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        
        // IMMEDIATELY redirect admin users
        if (userData?.role === 'admin') {
          router.replace('/admin/dashboard'); // Use replace instead of push
          return; // Exit early, don't show home page
        }
      }
      
      // Only show home page if not admin
      setShowHomePage(true);
    }
  }, [router]);

  // Don't show anything until we check user role
  if (!showHomePage) {
    return <div>Loading...</div>;
  }

  // Only render home page for non-admin users
  return (
    <>
      <HeroSection />
      <HowItWorksSection/>
      <RecentIssues />
    </>
  );
}