'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Features() {
  const t = useTranslations('Features');

  const features = [
    { key: 'locationBased', icon: '📍', color: 'from-blue-600 to-blue-700' },
    { key: 'multiLanguage', icon: '🌐', color: 'from-blue-600 to-blue-700' },
    { key: 'photoEvidence', icon: '📸', color: 'from-blue-600 to-blue-700' },
    { key: 'trackProgress', icon: '📊', color: 'from-blue-600 to-blue-700' }
  ];

  return (
    <section className="py-6 sm:py-12 px-4 sm:px-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 [font-family:var(--font-poppins)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-lg p-3 sm:p-5 
                         hover:shadow-sm transition-all duration-300 
                         border border-gray-100"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg 
                                bg-gradient-to-br ${feature.color} 
                                flex items-center justify-center 
                                flex-shrink-0`}>
                  <span className="text-base sm:text-xl text-white">
                    {feature.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 
                               mb-1 group-hover:text-blue-600 transition-colors">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
