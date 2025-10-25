'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Quote, Star } from 'lucide-react';

export default function TestimonialsSection() {
  const t = useTranslations('Testimonials');
  const { role } = useAuth();

  if (role === "admin") return null;

  const testimonials = [
    { 
      key: 'user1', 
      initials: 'RK', 
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    { 
      key: 'user2', 
      initials: 'SP', 
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    { 
      key: 'user3', 
      initials: 'AM', 
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white [font-family:var(--font-poppins)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-4 border border-blue-100">
            <Quote className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">{t('badge')}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Quote icon */}
                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Quote text */}
                  <blockquote className="text-gray-700 leading-relaxed mb-6 text-lg">
                    "{t(`${testimonial.key}.quote`)}"
                  </blockquote>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {t(`${testimonial.key}.name`)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t(`${testimonial.key}.location`)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative gradient */}
                <div className={`absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br ${testimonial.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              </div>

              {/* Verified badge */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-white text-lg">✓</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
