'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { MapPin, FileText, Activity, ArrowRight } from 'lucide-react';

export default function HowItWorksSection() {
  const t = useTranslations('HowItWorks');
  const { role } = useAuth();

  const steps = [
    {
      key: "step1",
      icon: MapPin,
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0
    },
    {
      key: "step2",
      icon: FileText,
      gradient: 'from-cyan-500 to-teal-500',
      delay: 0.2
    },
    {
      key: "step3",
      icon: Activity,
      gradient: 'from-teal-500 to-green-500',
      delay: 0.4
    }
  ];

  if (role === "admin") return null;

  return (
    <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50 [font-family:var(--font-poppins)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full mb-4 border border-blue-100">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-blue-600">{t('badge')}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 animate-pulse opacity-30"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: step.delay, duration: 0.6 }}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
                    {/* Step number badge */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <span className="text-2xl font-bold text-white">{index + 1}</span>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mt-8 mb-6 flex justify-center">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center transform group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {t(`${step.key}.title`)}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t(`${step.key}.description`)}
                      </p>
                    </div>

                    {/* Decorative gradient */}
                    <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${step.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  </div>

                  {/* Arrow connector - desktop only */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-24 -right-6 z-20">
                      <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-blue-100">
                        <ArrowRight className="w-6 h-6 text-blue-500 animate-pulse" />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <button
            onClick={() => {
              const locale = window.location.pathname.split('/')[1];
              window.location.href = `/${locale}/report-issue`;
            }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all cursor-pointer"
          >
            <span>{t('ctaButton')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
