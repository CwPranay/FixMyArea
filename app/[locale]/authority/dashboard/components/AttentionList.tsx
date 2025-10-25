"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock, Star, UserX, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface AttentionItem {
  id: string;
  title: string;
  category: string;
  reason: "overdue" | "critical" | "low-rating" | "unassigned";
  days?: number;
  rating?: number;
}

export default function AttentionList() {
  const t = useTranslations('AuthorityDashboard.attention');
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewAllLoading, setViewAllLoading] = useState(false);

  useEffect(() => {
    async function fetchAttentionItems() {
      try {
        const response = await fetch('/api/authority/dashboard/attention');
        if (!response.ok) throw new Error('Failed to fetch attention items');
        const data = await response.json();
        setAttentionItems(data);
      } catch (err) {
        console.error('Error fetching attention items:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAttentionItems();
    const interval = setInterval(fetchAttentionItems, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTakeAction = (issueId: string) => {
    setActionLoading(issueId);
    // Simulate loading for better UX
    setTimeout(() => {
      window.location.href = `/en/viewAll-issues?filter=${issueId}`;
    }, 300);
  };

  const handleViewAll = () => {
    setViewAllLoading(true);
    // Simulate loading for better UX
    setTimeout(() => {
      window.location.href = '/en/viewAll-issues';
    }, 300);
  };

  const getReasonBadge = (item: AttentionItem) => {
    switch (item.reason) {
      case "overdue":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            {item.days} {t('daysOverdue')}
          </span>
        );
      case "critical":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            {t('critical')}
          </span>
        );
      case "low-rating":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Star className="w-3 h-3" />
            {t('rating')}: {item.rating}/5
          </span>
        );
      case "unassigned":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            <UserX className="w-3 h-3" />
            {t('unassigned')}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-xl border border-white/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
          🚨 {t('title')}
        </h3>
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-sm font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
        >
          {attentionItems.length} {t('items')}
        </motion.span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : attentionItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {t('noUrgentIssues')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {attentionItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="group p-5 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <h4 className="font-bold mb-3 text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{item.title}</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md">
                      {item.category}
                    </span>
                    {getReasonBadge(item)}
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTakeAction(item.id)}
                  disabled={actionLoading === item.id}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 shadow-lg ${
                    actionLoading === item.id
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:shadow-xl text-white'
                  }`}
                >
                  {actionLoading === item.id && <Loader2 className="w-4 h-4 animate-spin" />}
                  {actionLoading === item.id ? t('loading') : t('takeAction')}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleViewAll}
        disabled={viewAllLoading}
        className={`w-full mt-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
          viewAllLoading
            ? 'bg-gray-300 cursor-not-allowed text-gray-600'
            : 'bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 hover:shadow-lg'
        }`}
      >
        {viewAllLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {viewAllLoading ? t('loading') : t('viewAllPending')}
      </motion.button>
    </div>
  );
}
