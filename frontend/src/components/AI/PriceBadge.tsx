import React from 'react';
import { Sparkles, TrendingDown, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PriceBadgeProps {
  recommendation?: string | null;
  className?: string;
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({ recommendation, className = '' }) => {
  if (!recommendation) return null;

  const configMap: Record<string, { label: string; icon: any; styleClass: string }> = {
    EXCELLENT_DEAL: {
      label: 'Excellent Deal',
      icon: TrendingDown,
      styleClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    },
    FAIR_DEAL: {
      label: 'Fair Market Value',
      icon: CheckCircle2,
      styleClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    },
    SLIGHTLY_OVERPRICED: {
      label: 'Slightly Above Baseline',
      icon: AlertTriangle,
      styleClass: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    },
    PREMIUM_PRICING: {
      label: 'Premium Collector Pricing',
      icon: ShieldCheck,
      styleClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    },
  };

  const config = configMap[recommendation] || {
    label: recommendation.replace(/_/g, ' '),
    icon: Sparkles,
    styleClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md transition-all ${config.styleClass} ${className}`}
    >
      <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
      {config.label}
    </span>
  );
};
