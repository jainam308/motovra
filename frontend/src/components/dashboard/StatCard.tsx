import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  borderColor: string;
  textColor: string;
  index: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  borderColor,
  textColor,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-5 rounded-2xl bg-gradient-to-b ${color} border ${borderColor} backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${textColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{value}</span>
      </div>
    </motion.div>
  );
};
