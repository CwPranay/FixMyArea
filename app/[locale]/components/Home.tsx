// app/[locale]/HomeClient.tsx
"use client";

import HeroSection from './Herosection';
import HowItWorksSection from './HowItWorks';
import Features from './FeaturesSection';
import ImpactStats from './Impact';
import TestimonialsSection from './TestimonialsSection';
import FaqSection from './FaqSection';

export default function HomeClient() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <Features/>
      <ImpactStats/>
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
