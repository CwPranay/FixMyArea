"use client";

import { motion } from "framer-motion";
import { FileDown, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function QuickActionsBar() {
  const t = useTranslations('AuthorityDashboard');
  const [exporting, setExporting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportReport = async () => {
    setExporting(true);
    try {
      // Fetch all dashboard data
      const [kpiRes, chartsRes, attentionRes, feedbackRes] = await Promise.all([
        fetch('/api/authority/dashboard/kpi'),
        fetch('/api/authority/dashboard/charts'),
        fetch('/api/authority/dashboard/attention'),
        fetch('/api/authority/dashboard/feedback')
      ]);

      const [kpiData, chartsData, attentionData, feedbackData] = await Promise.all([
        kpiRes.json(),
        chartsRes.json(),
        attentionRes.json(),
        feedbackRes.json()
      ]);

      // Create report content
      const reportDate = new Date().toLocaleDateString();
      const reportContent = `
AUTHORITY DASHBOARD REPORT
Generated: ${reportDate}

===========================================
KEY PERFORMANCE INDICATORS
===========================================

Overall Efficiency: ${kpiData.efficiency.value}% (${kpiData.efficiency.improved ? '↑' : '↓'} ${Math.abs(kpiData.efficiency.trend)}%)
Most Reported Category: ${kpiData.mostReported.category} (${kpiData.mostReported.count} reports)
Top Hotspots: ${kpiData.hotspots.join(', ')}
Average Response Time: ${kpiData.avgResponseTime.value} days (${kpiData.avgResponseTime.improved ? '↓' : '↑'} ${Math.abs(kpiData.avgResponseTime.trend)}%)
Overdue Issues: ${kpiData.overdueIssues}

===========================================
ISSUES BY CATEGORY
===========================================

${chartsData.categoryData.map((cat: any) => `${cat.name}: ${cat.value} issues`).join('\n')}

===========================================
WEEKLY TRENDS
===========================================

${chartsData.weeklyData.map((week: any) => `${week.week}: ${week.new} new, ${week.resolved} resolved`).join('\n')}

===========================================
DEPARTMENT PERFORMANCE
===========================================

${chartsData.departmentData.map((dept: any) => `${dept.dept}: ${dept.resolved} resolved, ${dept.avgTime} days avg`).join('\n')}

===========================================
ISSUES NEEDING ATTENTION (${attentionData.length})
===========================================

${attentionData.map((item: any, i: number) => `${i + 1}. ${item.title} [${item.category}] - ${item.reason}`).join('\n')}

===========================================
CITIZEN FEEDBACK
===========================================

Satisfaction Score: ${feedbackData.satisfactionScore}/100
Positive Feedback: ${feedbackData.feedbackData[0].value}
Negative Feedback: ${feedbackData.feedbackData[1].value}

Recent Comments:
${feedbackData.recentFeedback.map((fb: any, i: number) => `${i + 1}. ${fb.name} (${fb.rating}★): ${fb.comment}`).join('\n')}

===========================================
END OF REPORT
===========================================
      `.trim();

      // Create and download file
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `authority-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showNotification('success', t('exportSuccess'));
    } catch (error) {
      console.error('Error exporting report:', error);
      showNotification('error', t('exportError'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-20 right-4 z-50 max-w-md"
        >
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-sm ${
            notification.type === 'success'
              ? 'bg-green-50/90 border-green-300 text-green-800'
              : 'bg-red-50/90 border-red-300 text-red-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 flex-shrink-0" />
            )}
            <p className="font-bold">{notification.message}</p>
          </div>
        </motion.div>
      )}

      {/* Export Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportReport}
            disabled={exporting}
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-bold transition-all shadow-xl ${
              exporting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:shadow-2xl hover:shadow-green-200'
            }`}
          >
            <FileDown className={`w-6 h-6 ${exporting ? 'animate-bounce' : ''}`} />
            <span className="text-lg">{exporting ? t('exporting') : t('exportReport')}</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
