"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ChartData {
  categoryData: Array<{ name: string; value: number; color: string }>;
  weeklyData: Array<{ week: string; new: number; resolved: number }>;
  departmentData: Array<{ dept: string; resolved: number; avgTime: number }>;
}

export default function TrendChart() {
  const t = useTranslations('AuthorityDashboard.charts');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch('/api/authority/dashboard/charts');
        if (!response.ok) throw new Error('Failed to fetch chart data');
        const data = await response.json();
        setChartData(data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
    const interval = setInterval(fetchChartData, 30000);
    return () => clearInterval(interval);
  }, []);

  const chartColors = {
    text: "#374151",
    grid: "#e5e7eb",
  };

  if (loading || !chartData) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100 flex items-center justify-center h-[330px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ))}
      </>
    );
  }

  const { categoryData, weeklyData, departmentData } = chartData;

  return (
    <>
      {/* Pie Chart - Issues by Category */}
      <div className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('issuesByCategory')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                color: chartColors.text
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Weekly Trend */}
      <div className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('newVsResolved')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="week" stroke={chartColors.text} />
            <YAxis stroke={chartColors.text} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                color: chartColors.text
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="new"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444" }}
            />
            <Line
              type="monotone"
              dataKey="resolved"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Department Performance */}
      <div className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('departmentPerformance')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={departmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="dept" stroke={chartColors.text} />
            <YAxis stroke={chartColors.text} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                color: chartColors.text
              }}
            />
            <Legend />
            <Bar dataKey="resolved" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
