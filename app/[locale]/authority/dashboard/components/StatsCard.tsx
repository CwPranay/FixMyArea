"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  improved?: boolean;
  icon: React.ReactNode;
  alert?: boolean;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  trend,
  improved,
  icon,
  alert = false
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`rounded-2xl p-6 bg-white shadow-lg transition-all border ${
        alert ? "border-red-300 shadow-red-100" : "border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${
          alert 
            ? "bg-red-50 text-red-600" 
            : "bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600"
        }`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
            improved ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}>
            {improved ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium mb-2 text-gray-600">
        {title}
      </h3>
      <p className="text-2xl font-bold mb-1 text-gray-900">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
