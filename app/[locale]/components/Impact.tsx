'use client';

import { useTranslations } from 'next-intl';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const controls = useAnimation();
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        scale: [0.5, 1],
        opacity: [0, 1],
        transition: { duration },
      });

      // Animate count separately
      let start = 0;
      const end = value;
      const stepTime = Math.abs(Math.floor((duration * 1000) / end));

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [controls, inView, value, duration]);

  return (
    <motion.span
      ref={ref}
      animate={controls}
      className="text-4xl sm:text-5xl font-bold blue-gradient-text"
    >
      {count}
    </motion.span>
  );
}

export default function ImpactStats() {
  const t = useTranslations('ImpactStats');

  const stats = [
    {
      value: 70,
      suffix: '%',
      label: t('unreported'),
      icon: '🚧',
    },
    {
      value: 3,
      suffix: 'x',
      label: t('fasterResolution'),
      icon: '⚡',
    },
    {
      value: 1000,
      suffix: '+',
      label: t('citizensHelped'),
      icon: '👥',
    },
    {
      value: 24,
      suffix: '/7',
      label: t('availability'),
      icon: '🌐',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 bg-gray-50 [font-family:var(--font-poppins)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t('title')}
          </h2>
          <p className="mt-4 text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="flex items-center blue-gradient-text justify-center space-x-1">
                <Counter value={stat.value}  />
                <span className="text-4xl sm:text-5xl font-bold blue-gradient-text">
                  {stat.suffix}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
