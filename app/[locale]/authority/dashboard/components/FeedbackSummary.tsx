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
      <div className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100 flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const { feedbackData, satisfactionScore, recentFeedback } = feedback;

  return (
    <div className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">💬 {t('title')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Feedback Ratio Chart */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-gray-600">
            {t('distribution')}
          </h4>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={feedbackData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {feedbackData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">{feedbackData[0].value}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">{feedbackData[1].value}</span>
            </div>
          </div>
        </div>

        {/* Satisfaction Score */}
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-sm font-medium mb-3 text-gray-600">
            {t('satisfactionIndex')}
          </h4>
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - satisfactionScore / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{satisfactionScore}</span>
            </div>
          </div>
          <p className="text-sm mt-2 text-gray-600">
            {t('outOf')}
          </p>
        </div>
      </div>

      {/* Recent Feedback */}
      <div>
        <h4 className="text-sm font-medium mb-3 text-gray-600">
          {t('recentComments')}
        </h4>
        <div className="space-y-3">
          {recentFeedback.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg bg-gray-50 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-gray-200">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-sm text-gray-900">{item.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < item.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm mb-1 text-gray-700">
                {item.comment}
              </p>
              <p className="text-xs text-gray-500">
                {item.date}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
