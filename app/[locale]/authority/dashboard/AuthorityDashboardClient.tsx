"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import StatsCard from "./components/StatsCard";
import TrendChart from "./components/TrendChart";
import AttentionList from "./components/AttentionList";
import FeedbackSummary from "./components/FeedbackSummary";
import QuickActionsBar from "./components/QuickActionsBar";
import { DashboardSkeleton } from "./components/SkeletonLoader";
import {
    TrendingUp,
    AlertTriangle,
    MapPin,
    Clock,
    AlertCircle
} from "lucide-react";

interface KPIData {
    efficiency: { value: number; trend: number; improved: boolean };
    mostReported: { category: string; count: number };
    hotspots: string[];
    avgResponseTime: { value: number; trend: number; improved: boolean };
    overdueIssues: number;
}

export default function AuthorityDashboardClient() {
    const t = useTranslations('AuthorityDashboard');
    const [kpiData, setKpiData] = useState<KPIData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchKPIData() {
            try {
                const response = await fetch('/api/authority/dashboard/kpi');
                if (!response.ok) throw new Error('Failed to fetch KPI data');
                const data = await response.json();
                setKpiData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching KPI data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        }

        fetchKPIData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchKPIData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error || !kpiData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">{error || t('failedToLoad')}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        {t('retry')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
            {/* Header */}
            <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-blue-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <motion.h1 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent"
                            >
                                {t('title')}
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-sm mt-2 text-slate-600 font-medium"
                            >
                                {t('subtitle')}
                            </motion.p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions Bar */}
                <QuickActionsBar />

                {/* KPI Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
                >
                    <StatsCard
                        title={t('kpi.overallEfficiency')}
                        value={`${kpiData.efficiency.value}%`}
                        trend={kpiData.efficiency.trend}
                        improved={kpiData.efficiency.improved}
                        icon={<TrendingUp className="w-6 h-6" />}
                    />
                    <StatsCard
                        title={t('kpi.mostReported')}
                        value={kpiData.mostReported.category}
                        subtitle={`${kpiData.mostReported.count} ${t('kpi.reports')}`}
                        icon={<AlertTriangle className="w-6 h-6" />}
                    />
                    <StatsCard
                        title={t('kpi.topHotspot')}
                        value={kpiData.hotspots[0]}
                        subtitle={kpiData.hotspots.length > 1 ? `+${kpiData.hotspots.length - 1} ${t('kpi.more')}` : ''}
                        icon={<MapPin className="w-6 h-6" />}
                    />
                    <StatsCard
                        title={t('kpi.avgResponseTime')}
                        value={`${kpiData.avgResponseTime.value} ${t('kpi.days')}`}
                        trend={kpiData.avgResponseTime.trend}
                        improved={kpiData.avgResponseTime.improved}
                        icon={<Clock className="w-6 h-6" />}
                    />
                    <StatsCard
                        title={t('kpi.overdueIssues')}
                        value={kpiData.overdueIssues.toString()}
                        subtitle={t('kpi.pendingDays')}
                        icon={<AlertCircle className="w-6 h-6" />}
                        alert={kpiData.overdueIssues > 0}
                    />
                </motion.div>

                {/* Charts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
                >
                    <TrendChart />
                </motion.div>

                {/* Attention List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                >
                    <AttentionList />
                </motion.div>

                {/* Feedback */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <FeedbackSummary />
                </motion.div>
            </main>
        </div>
    );
}
