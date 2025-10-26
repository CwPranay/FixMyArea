'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Globe, Camera, TrendingUp } from 'lucide-react';

export default function Features() {
  const t = useTranslations('Features');
  const { role } = useAuth();

  const features = [
    { 
      key: 'locationBased', 
      icon: MapPin, 
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    { 
      key: 'multiLanguage', 
      icon: Globe, 
      gradient: 'from-cyan-500 to-teal-500',
      bgGradient: 'from-cyan-50 to-teal-50'
    },
    { 
      key: 'photoEvidence', 
      icon: Camera, 
      gradient: 'from-cyan-500 to-teal-500',
      bgGradient: 'from-cyan-50 to-teal-50'
    },
    { 
      key: 'trackProgress', 
      icon: TrendingUp, 
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ];

  if (role === "admin") return null;

  return (
    <section className="py-20 px-4 sm:px-6 bg-white [font-family:var(--font-poppins)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-blue-600">{t('badge')}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {t(`${feature.key}.title`)}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {t(`${feature.key}.description`)}
                    </p>

                    {/* Decorative element */}
                    <div className={`absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full opacity-50"></div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">{t('ctaText')}</p>
          <button
            onClick={() => {
              const locale = window.location.pathname.split('/')[1];
              window.location.href = `/${locale}/report-issue`;
            }}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-4 transition-all cursor-pointer"
          >
            <span>{t('ctaButton')}</span>
            <span>→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
