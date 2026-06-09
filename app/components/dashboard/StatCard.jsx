'use client';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, color = 'green', trend, delay = 0 }) {
  const colors = {
    green:  { bg: 'bg-[#004835]/8',  icon: 'text-[#004835]',  border: 'border-[#004835]/15' },
    gold:   { bg: 'bg-[#C89A6C]/10', icon: 'text-[#C89A6C]',  border: 'border-[#C89A6C]/20' },
    blue:   { bg: 'bg-blue-50',       icon: 'text-blue-600',    border: 'border-blue-100' },
    red:    { bg: 'bg-red-50',        icon: 'text-red-500',     border: 'border-red-100' },
    purple: { bg: 'bg-purple-50',     icon: 'text-purple-600',  border: 'border-purple-100' },
  };
  const c = colors[color] || colors.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:shadow-gray-100 transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900 tabular-nums">{value ?? '—'}</p>
          {trend && (
            <p className={`text-xs mt-1.5 font-medium ${trend.up ? 'text-emerald-500' : 'text-red-400'}`}>
              {trend.up ? '↑' : '↓'} {trend.label}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={c.icon} />
        </div>
      </div>
    </motion.div>
  );
}