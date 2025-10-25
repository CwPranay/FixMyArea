"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ThumbsUp, ThumbsDown, Star, User, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface FeedbackData {
  feedbackData: Array<{ name: string; value: number; color: string }>;
  satisfactionScore: number;
  recentFeedback: Array<{
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export default function FeedbackSummary() {
  const t = useTranslations('AuthorityDashboard.feedback');
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const response = await fetch('/api/authority/dashboard/feedback');
        if (!response.ok) throw new Error('Failed to fetch feedback');
        const data = await response.json();
        setFeedback(data);
      } catch (err) {
        console.error('Error fetching feedback:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
    const interval = setInterval(fetchFeedback, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !feedback) {
    return (
      <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-xl border border-white/50 flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const { feedbackData, satisfactionScore, recentFeedback } = feedback;

  return (
    <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-xl border border-white/50">
      <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
        💬 {t('title')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Feedback Ratio Chart */}
        <div>
          <h4 className="text-sm font-bold mb-3 text-slate-700 uppercase tracking-wide">
            {t('distribution')}
          </h4>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={feedbackData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {feedbackData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <span className="text-base font-bold text-green-700">{feedbackData[0].value}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
              <ThumbsDown className="w-5 h-5 text-red-600" />
              <span className="text-base font-bold text-red-700">{feedbackData[1].value}</span>
            </div>
          </div>
        </div>

        {/* Satisfaction Score */}
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-sm font-bold mb-3 text-slate-700 uppercase tracking-wide">
            {t('satisfactionIndex')}
          </h4>
          <div className="relative w-36 h-36">
            <svg className="transform -rotate-90 w-36 h-36">
              <defs>
                <linearGradient id="satisfactionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="url(#satisfactionGradient)"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - satisfactionScore / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{satisfactionScore}</span>
              <span className="text-xs font-semibold text-slate-500 mt-1">SCORE</span>
            </div>
          </div>
          <p className="text-sm mt-3 text-slate-600 font-semibold">
            {t('outOf')}
          </p>
        </div>
      </div>

      {/* Recent Feedback */}
      <div>
        <h4 className="text-sm font-bold mb-4 text-slate-700 uppercase tracking-wide">
          {t('recentComments')}
        </h4>
        <div className="space-y-3">
          {recentFeedback.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm text-slate-900">{item.name}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < item.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm mb-2 text-slate-700 leading-relaxed">
                {item.comment}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {item.date}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
