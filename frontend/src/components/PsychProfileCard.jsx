import React, { useState } from 'react';
import { Brain, Flame, AlertCircle, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Zap, Target } from 'lucide-react';
import { auditPsychProfile } from '../services/api';

export default function PsychProfileCard({ text, initialProfile = null }) {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await auditPsychProfile(text);
      setProfile(data);
      setExpanded(true);
    } catch (err) {
      console.error(err);
      setError('Failed to extract psychological profile.');
    } finally {
      setLoading(false);
    }
  };

  const getMeterColor = (score) => {
    if (score >= 70) return 'from-rose-500 to-red-600';
    if (score >= 40) return 'from-amber-500 to-yellow-500';
    return 'from-emerald-500 to-teal-500';
  };

  const vectors = profile?.cialdini_principles || profile?.influence_vectors || {};
  const manipulationScore = profile?.manipulation_score ?? profile?.overall_manipulation_score ?? 60;
  const cognitiveBiases = profile?.exploited_cognitive_bias
    ? (Array.isArray(profile.exploited_cognitive_bias) ? profile.exploited_cognitive_bias : [profile.exploited_cognitive_bias])
    : (profile?.cognitive_biases || []);

  return (
    <div className="rounded-2xl border border-purple-900/50 bg-gradient-to-br from-slate-900/90 via-purple-950/20 to-slate-900/90 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-purple-300">
                Psychological Manipulation Radar
              </h4>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800/60">
                Cialdini Vectors
              </span>
            </div>
            <p className="text-xs opacity-70">
              Detects human vulnerability exploits: artificial urgency, fear tactics, faux authority & greed.
            </p>
          </div>
        </div>

        {!profile ? (
          <button
            onClick={fetchProfile}
            disabled={loading || !text}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? 'Deconstructing Tactics...' : 'Deconstruct Attack Psychology'}</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="text-xs font-mono px-2 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-300">
              Manipulation: {manipulationScore}/100
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-900/40 text-xs font-semibold flex items-center space-x-1"
            >
              <span>{expanded ? 'Collapse' : 'Expand Radar'}</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900 text-xs text-rose-300">
          {error}
        </div>
      )}

      {profile && expanded && (
        <div className="pt-4 border-t border-purple-900/40 space-y-5 animate-in fade-in duration-200">
          {/* Plain Language Psychological Breakdown */}
          {profile.psychological_breakdown && (
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-900/30 text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="block text-purple-300 font-semibold mb-1">Tactical Analysis:</strong>
              {profile.psychological_breakdown}
            </div>
          )}

          {/* Influence Spectrum Grid */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Persuasion & Exploitation Vectors
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(vectors).map(([key, item]) => {
                const score = typeof item === 'object' && item !== null ? item.score : Number(item) || 0;
                const note = typeof item === 'object' && item !== null ? item.notes : '';
                return (
                  <div key={key} className="p-3 rounded-xl bg-slate-950/60 border border-purple-900/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider capitalize text-slate-300">
                        {key.replace('_', ' ')}
                      </span>
                      <span className="font-mono font-bold text-purple-400">{score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getMeterColor(score)} transition-all duration-700`}
                        style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
                      />
                    </div>
                    {note && <p className="text-[11px] opacity-70 italic">{note}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cognitive Biases Exploited */}
          {cognitiveBiases.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-200">
                Cognitive Biases Targeted
              </h5>
              <div className="flex flex-wrap gap-2">
                {cognitiveBiases.map((bias, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-950/80 border border-purple-800 text-purple-300 flex items-center space-x-1"
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>{bias}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mental Defense Countermeasure */}
          {profile.countermeasure && (
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold uppercase text-purple-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cognitive Firewall Action</span>
              </div>
              <p className="text-xs text-purple-100 leading-relaxed font-sans">
                {profile.countermeasure}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
