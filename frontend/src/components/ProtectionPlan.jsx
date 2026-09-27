import React, { useState } from 'react';
import { ShieldCheck, Check, AlertOctagon, ArrowRight } from 'lucide-react';

export default function ProtectionPlan({ recommendations = [], risk = 'LOW' }) {
  const [completed, setCompleted] = useState({});

  const toggleStep = (idx) => {
    setCompleted((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const isHighRisk = risk === 'HIGH' || risk === 'CRITICAL';

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-400">
        No immediate defensive actions required. Always remain cautious with unsolicited links and messages.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <AlertOctagon className={`w-3.5 h-3.5 ${isHighRisk ? 'text-rose-400' : 'text-cyan-400'}`} />
          <span>Recommended Defensive Action Plan</span>
        </span>
        <span className="text-xs text-slate-500 font-mono">
          {Object.values(completed).filter(Boolean).length} / {recommendations.length} completed
        </span>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec, idx) => {
          const isDone = !!completed[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                isDone
                  ? 'bg-slate-900/40 border-emerald-900/60 opacity-60'
                  : isHighRisk
                  ? 'bg-slate-900/90 border-slate-800 hover:border-rose-900/60 hover:bg-slate-850'
                  : 'bg-slate-900/90 border-slate-800 hover:border-cyan-900/60 hover:bg-slate-850'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 transition-colors ${
                  isDone
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : 'border-slate-600 bg-slate-800 hover:border-cyan-400'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold text-slate-400">{idx + 1}</span>}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {rec}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
