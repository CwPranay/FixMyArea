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
    <div className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🚨 {t('title')}</h3>
        <span className="text-sm text-gray-600">
          {attentionItems.length} {t('items')}
        </span>
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
              className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <h4 className="font-medium mb-2 text-gray-900">{item.title}</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {item.category}
                    </span>
                    {getReasonBadge(item)}
                  </div>
                </div>
                <button 
                  onClick={() => handleTakeAction(item.id)}
                  disabled={actionLoading === item.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                    actionLoading === item.id
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg text-white'
                  }`}
                >
                  {actionLoading === item.id && <Loader2 className="w-4 h-4 animate-spin" />}
                  {actionLoading === item.id ? t('loading') : t('takeAction')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <button 
        onClick={handleViewAll}
        disabled={viewAllLoading}
        className={`w-full mt-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
          viewAllLoading
            ? 'bg-gray-300 cursor-not-allowed text-gray-600'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        {viewAllLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {viewAllLoading ? t('loading') : t('viewAllPending')}
      </button>
    </div>
  );
}
