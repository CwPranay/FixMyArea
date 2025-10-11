'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

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
    <section className="py-12 px-4 sm:px-6 bg-white [font-family:var(--font-poppins)]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
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
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 
                         transition-colors duration-200 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:ring-opacity-50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">
                    {t(`${faq}.question`)}
                  </h3>
                  <span className={`transform transition-transform duration-200 
                                ${openIndex === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 text-gray-600 text-sm sm:text-base">
                      {t(`${faq}.answer`)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}