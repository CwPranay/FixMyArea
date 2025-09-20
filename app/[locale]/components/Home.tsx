// app/[locale]/HomeClient.tsx
"use client";

import HeroSection from './Herosection';
import HowItWorksSection from './HowItWorks';
import Features from './FeaturesSection';
import ImpactStats from './Impact';
import TestimonialsSection from './TestimonialsSection';
import FaqSection from './FaqSection';
import Footer from './Footer';

const commonSectionClasses = "section-padding [font-family:var(--font-poppins)]";
const lightSection = `${commonSectionClasses} bg-slate-50`;
const darkSection = `${commonSectionClasses} bg-white`;

export default function HomeClient() {
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
