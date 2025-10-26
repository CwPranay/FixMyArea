'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const t = useTranslations('FAQ');
  const {role} = useAuth();
 
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    'anonymity',
    'process',
    'languages',
    'response',
    'verification'
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

   if (role === "admin") return null;

  return (
    <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white [font-family:var(--font-poppins)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full mb-4 border border-blue-100">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">{t('badge')}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                openIndex === index 
                  ? 'border-blue-500 shadow-xl shadow-blue-100' 
                  : 'border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-xl'
              }`}>
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 transition-colors duration-200 focus:outline-none"
                >
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`font-semibold text-lg transition-colors ${
                      openIndex === index ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
                    }`}>
                      {t(`${faq}.question`)}
                    </h3>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === index 
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 rotate-180' 
                        : 'bg-gray-100 group-hover:bg-blue-50'
                    }`}>
                      {openIndex === index ? (
                        <Minus className="w-5 h-5 text-white" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                      )}
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="pl-4 border-l-4 border-blue-500">
                          <p className="text-gray-600 leading-relaxed">
                            {t(`${faq}.answer`)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
            <p className="text-gray-700 mb-4 font-medium">{t('ctaText')}</p>
            <button
              onClick={() => {
                const email = 'infofixmyarea@gmail.com';
                const subject = 'Support Request from FixMyArea';
                const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
                
                // Try mailto first
                window.location.href = mailtoLink;
                
                // Fallback: If mailto doesn't work (no email client), open Gmail
                setTimeout(() => {
                  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`;
                  window.open(gmailUrl, '_blank');
                }, 500);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all cursor-pointer"
            >
              <span>{t('ctaButton')}</span>
              <span>→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}