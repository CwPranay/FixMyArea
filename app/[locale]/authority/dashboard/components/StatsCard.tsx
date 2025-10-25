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
      whileHover={{ scale: 1.03, y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-xl transition-all border overflow-hidden ${
        alert ? "border-red-200 shadow-red-100/50" : "border-white/50 shadow-blue-100/50"
      }`}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        alert 
          ? "bg-gradient-to-br from-red-50/50 to-orange-50/50" 
          : "bg-gradient-to-br from-blue-50/50 via-cyan-50/50 to-teal-50/50"
      }`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className={`p-3 rounded-xl shadow-lg ${
              alert 
                ? "bg-gradient-to-br from-red-500 to-orange-500 text-white" 
                : "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 text-white"
            }`}
          >
            {icon}
          </motion.div>
          {trend !== undefined && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full shadow-md ${
                improved 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                  : "bg-gradient-to-r from-red-500 to-rose-500 text-white"
              }`}
            >
              {improved ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(trend)}%
            </motion.div>
          )}
        </div>
        <h3 className="text-sm font-semibold mb-2 text-slate-600 uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-3xl font-bold mb-1 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
