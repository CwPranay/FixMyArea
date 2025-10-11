'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function TestimonialsSection() {
  const t = useTranslations('Testimonials');
  const {role} = useAuth();
  if (role === "admin") return null;

  const testimonials = [
    { key: 'user1', initials: 'RK', color: 'from-blue-400 to-blue-600' },
    { key: 'user2', initials: 'SP', color: 'from-indigo-400 to-indigo-600' },
    { key: 'user3', initials: 'AM', color: 'from-cyan-400 to-cyan-600' }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 bg-gradient-to-br from-white to-slate-50 [font-family:var(--font-poppins)]">
      <div className="max-w-7xl mx-auto">
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

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} 
                              flex items-center justify-center text-white font-semibold text-lg`}>
                  {testimonial.initials}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">
                    {t(`${testimonial.key}.name`)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t(`${testimonial.key}.location`)}
                  </p>
                </div>
              </div>
              <blockquote className="text-gray-600 leading-relaxed">
                "{t(`${testimonial.key}.quote`)}"
              </blockquote>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}