// app/[locale]/HomeClient.tsx
"use client";

import HeroSection from './Herosection';
import HowItWorksSection from './HowItWorks';
import RecentIssues from './FeaturesSection';

export default function HomeClient() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <RecentIssues />
    </>
  );
}
