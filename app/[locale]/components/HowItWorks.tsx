'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function HowItWorksSection() {
  const t = useTranslations('HowItWorks');
  const { role } = useAuth();

  const steps = [
    { key: "step1", icon: '📍' },
    { key: "step2", icon: '📝' },
    { key: "step3", icon: '⚙️' }
  ];

  if (role === "admin") return null;

  return (
    <section className="py-16 px-4 sm:px-6 bg-gray-50 [font-family:var(--font-poppins)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {t('title')}
        </h2>

        <div className="relative">
          {/* Timeline line - hidden on mobile */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-200 -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Step number bubble */}
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mb-4 mx-auto md:mb-8 relative z-10">
                  {index + 1}
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    {t(`${step.key}.title`)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                    {t(`${step.key}.description`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
