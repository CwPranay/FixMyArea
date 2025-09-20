// app/[locale]/HomeClient.tsx
"use client";

import HeroSection from './Herosection';
import HowItWorksSection from './HowItWorks';
import Features from './FeaturesSection';
import ImpactStats from './Impact';

export default function HomeClient() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <Features/>
      <ImpactStats/>
    </>
  );
}
