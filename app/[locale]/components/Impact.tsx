'use client';

import { useTranslations } from 'next-intl';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TrendingUp, Zap, Users, Clock } from 'lucide-react';

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

      let start = 0;
      const end = value;
      const increment = end / (duration * 60);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [controls, inView, value, duration]);

  return (
    <motion.span
      ref={ref}
      animate={controls}
      className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
    >
      {count}
    </motion.span>
  );
}

export default function ImpactStats() {
  const t = useTranslations('ImpactStats');
  const { role } = useAuth();

  const stats = [
    {
      value: 70,
      suffix: '%',
      label: t('unreported'),
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      value: 3,
      suffix: 'x',
      label: t('fasterResolution'),
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    {
      value: 1000,
      suffix: '+',
      label: t('citizensHelped'),
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      value: 24,
      suffix: '/7',
      label: t('availability'),
      icon: Clock,
      gradient: 'from-teal-500 to-cyan-500',
      bgGradient: 'from-teal-50 to-cyan-50'
    },
  ];

  if (role === "admin") return null;

  return (
    <section className="py-24 px-4 sm:px-6 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 [font-family:var(--font-poppins)] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-cyan-300">{t('badge')}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Number */}
                    <div className="flex items-center justify-center mb-4">
                      <Counter value={stat.value} />
                      <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent ml-2">
                        {stat.suffix}
                      </span>
                    </div>

                    {/* Label */}
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {stat.label}
                    </p>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full"></div>
                  <div className={`absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-br ${stat.gradient} rounded-full opacity-0 group-hover:opacity-100 animate-ping`}></div>
                  <div className={`absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-br ${stat.gradient} rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-150`}></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <span className="text-white font-semibold">{t('bottomText')}</span>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-gray-900"></div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
