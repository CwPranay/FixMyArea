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
          <div key={i} className="rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-xl border border-white/50 flex items-center justify-center h-[330px]">
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
      <div className="group rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
        <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{t('issuesByCategory')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={85}
              innerRadius={45}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={3}
            >
              {categoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                color: chartColors.text,
                fontWeight: "600"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Weekly Trend */}
      <div className="group rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
        <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{t('newVsResolved')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyData}>
            <defs>
              <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} strokeOpacity={0.5} />
            <XAxis 
              dataKey="week" 
              stroke={chartColors.text} 
              style={{ fontSize: '12px', fontWeight: '600' }}
            />
            <YAxis 
              stroke={chartColors.text}
              style={{ fontSize: '12px', fontWeight: '600' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                color: chartColors.text,
                fontWeight: "600"
              }}
            />
            <Legend 
              wrapperStyle={{ fontWeight: '600', fontSize: '13px' }}
            />
            <Line
              type="monotone"
              dataKey="new"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", r: 5, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7, strokeWidth: 2 }}
              fill="url(#colorNew)"
            />
            <Line
              type="monotone"
              dataKey="resolved"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", r: 5, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7, strokeWidth: 2 }}
              fill="url(#colorResolved)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Department Performance */}
      <div className="group rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
        <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{t('departmentPerformance')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={departmentData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} strokeOpacity={0.5} />
            <XAxis 
              dataKey="dept" 
              stroke={chartColors.text}
              style={{ fontSize: '12px', fontWeight: '600' }}
            />
            <YAxis 
              stroke={chartColors.text}
              style={{ fontSize: '12px', fontWeight: '600' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                color: chartColors.text,
                fontWeight: "600"
              }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Legend 
              wrapperStyle={{ fontWeight: '600', fontSize: '13px' }}
            />
            <Bar 
              dataKey="resolved" 
              fill="url(#barGradient)" 
              radius={[10, 10, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
