// app/[locale]/HomeClient.tsx
"use client";

import { useAuth } from '@/context/AuthContext';
import HeroSection from './Herosection';
import HowItWorksSection from './HowItWorks';
import Features from './FeaturesSection';
import ImpactStats from './Impact';
import TestimonialsSection from './TestimonialsSection';
import FaqSection from './FaqSection';
import Footer from './Footer';
import AuthorityDashboardClient from '../authority/dashboard/AuthorityDashboardClient';

const commonSectionClasses = "section-padding [font-family:var(--font-poppins)]";
const lightSection = `${commonSectionClasses} bg-slate-50`;
const darkSection = `${commonSectionClasses} bg-white`;

export default function HomeClient() {
  const { user, isAuthenticated } = useAuth();

  // If user is an authority, show the dashboard instead of home page
  if (isAuthenticated && user?.role === 'authority') {
    return <AuthorityDashboardClient />;
  }

  // For normal users, guests, and admins - show the regular home page
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <Features/>
      <ImpactStats/>
      <TestimonialsSection />
      <FaqSection />
      <Footer/>
    </>
  );
}
