import React from 'react';
import { CheckCircle2, AlertCircle, Lightbulb, Sparkles } from 'lucide-react';

interface AIInsightsProps {
  summary?: string | null;
  strengths?: string[] | null;
  concerns?: string[] | null;
  buyerAdvice?: string | null;
}

export const AIInsights: React.FC<AIInsightsProps> = ({
  summary,
  strengths = [],
  concerns = [],
  buyerAdvice,
}) => {
  const validStrengths = Array.isArray(strengths) ? strengths : [];
  const validConcerns = Array.isArray(concerns) ? concerns : [];

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      {summary && (
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            Executive AI Assessment
          </div>
          <p className="text-sm text-gray-200 leading-relaxed font-light">{summary}</p>
        </div>
      )}

      {/* Strengths & Concerns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Strengths */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Key Vehicle Strengths
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            {validStrengths.length > 0 ? (
              validStrengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No specific strengths flagged.</li>
            )}
          </ul>
        </div>

        {/* Potential Concerns */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Buyer Considerations
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            {validConcerns.length > 0 ? (
              validConcerns.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No major buyer concerns flagged.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Actionable Buyer Advice */}
      {buyerAdvice && (
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-500/30 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Actionable Buyer Advice</h4>
            <p className="text-xs text-gray-200 mt-1 leading-relaxed">{buyerAdvice}</p>
          </div>
        </div>
      )}
    </div>
  );
};
