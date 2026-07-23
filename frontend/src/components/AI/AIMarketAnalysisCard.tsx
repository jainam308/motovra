import React from 'react';
import { motion } from 'framer-motion';
import { Brain, RefreshCw, TrendingUp, TrendingDown, Info, Loader2 } from 'lucide-react';
import { PriceBadge } from './PriceBadge';
import { AIInsights } from './AIInsights';
import { ComparableVehiclesTable } from './ComparableVehiclesTable';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { regenerateAiMarketAnalysis } from '../../services/aiMarketAnalysisApi';
import toast from 'react-hot-toast';

interface AIMarketAnalysisCardProps {
  vehicle: {
    id: string;
    make: string;
    model: string;
    price: number | string;
    estimatedMarketPrice?: number | string | null;
    lowestMarketPrice?: number | string | null;
    highestMarketPrice?: number | string | null;
    confidenceScore?: number | null;
    recommendation?: string | null;
    summary?: string | null;
    strengths?: any;
    concerns?: any;
    buyerAdvice?: string | null;
    comparableVehicles?: any;
    aiGeneratedAt?: string | null;
  };
}

export const AIMarketAnalysisCard: React.FC<AIMarketAnalysisCardProps> = ({ vehicle }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const regenerateMutation = useMutation({
    mutationFn: () => regenerateAiMarketAnalysis(vehicle.id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', vehicle.id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success(res.message || 'AI Market Intelligence updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to regenerate AI analysis.');
    },
  });

  const currentPrice = Number(vehicle.price || 0);
  const estimatedPrice = vehicle.estimatedMarketPrice ? Number(vehicle.estimatedMarketPrice) : null;
  const priceDiff = estimatedPrice !== null ? currentPrice - estimatedPrice : 0;
  const priceDiffPercent = estimatedPrice ? ((priceDiff / estimatedPrice) * 100).toFixed(1) : '0';

  const hasAnalysis = vehicle.recommendation || vehicle.summary || estimatedPrice !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-8 rounded-3xl bg-zinc-950/90 border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.08)] relative overflow-hidden space-y-6"
    >
      {/* Glow ambient highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              MOTOVRA AI MARKET INTELLIGENCE
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-heading font-extrabold text-white">
            Pricing Analytics & Valuation Insights
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {hasAnalysis && <PriceBadge recommendation={vehicle.recommendation} />}

          {user?.role === 'ADMIN' && (
            <button
              type="button"
              onClick={() => regenerateMutation.mutate()}
              disabled={regenerateMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-all disabled:opacity-50"
            >
              {regenerateMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate AI
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {hasAnalysis ? (
        <div className="space-y-6 relative z-10">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Current Price */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Current Price</span>
              <span className="text-xl md:text-2xl font-mono font-black text-white">${currentPrice.toLocaleString()}</span>
            </div>

            {/* Estimated Market Price */}
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Est. Market Average</span>
              <span className="text-xl md:text-2xl font-mono font-black text-amber-300">
                {estimatedPrice ? `$${estimatedPrice.toLocaleString()}` : 'N/A'}
              </span>
            </div>

            {/* Price Variance */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Price Variance</span>
              <span className={`text-lg md:text-xl font-mono font-bold ${priceDiff <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {priceDiff <= 0 ? (
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4" /> -${Math.abs(priceDiff).toLocaleString()} ({priceDiffPercent}%)
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> +${Math.abs(priceDiff).toLocaleString()} (+{priceDiffPercent}%)
                  </span>
                )}
              </span>
            </div>

            {/* Confidence Score */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Confidence Score</span>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-mono font-extrabold text-amber-400">
                  {vehicle.confidenceScore ?? 85}%
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  High Precision
                </span>
              </div>
            </div>
          </div>

          {/* AI Narrative Insights */}
          <AIInsights
            summary={vehicle.summary}
            strengths={vehicle.strengths}
            concerns={vehicle.concerns}
            buyerAdvice={vehicle.buyerAdvice}
          />

          {/* Comparable Listings Table */}
          <ComparableVehiclesTable
            vehicles={vehicle.comparableVehicles}
          />
        </div>
      ) : (
        /* Empty / Pending Baseline Analysis State */
        <div className="py-10 text-center space-y-3 bg-white/5 rounded-2xl border border-white/10 p-6 relative z-10">
          <Info className="w-8 h-8 text-amber-400 mx-auto" />
          <h4 className="text-lg font-bold text-white">Market Intelligence Baseline Pending</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            This vehicle is undergoing baseline valuation matching. Admin can trigger instantaneous market evaluation using regional listings.
          </p>
          {user?.role === 'ADMIN' && (
            <button
              type="button"
              onClick={() => regenerateMutation.mutate()}
              disabled={regenerateMutation.isPending}
              className="mt-3 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-all inline-flex items-center gap-2"
            >
              {regenerateMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating...</>
              ) : (
                <><Brain className="w-4 h-4" /> Generate AI Market Intelligence Now</>
              )}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
