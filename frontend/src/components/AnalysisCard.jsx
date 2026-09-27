import React, { useState } from 'react';
import { Target, HelpCircle, Lightbulb, Shield, Copy, Check, Info } from 'lucide-react';
import RiskBadge from './RiskBadge';
import RiskScore from './RiskScore';
import IndicatorList from './IndicatorList';
import ProtectionPlan from './ProtectionPlan';
import AudioVoiceBriefing from './AudioVoiceBriefing';
import PsychProfileCard from './PsychProfileCard';

export default function AnalysisCard({ analysis, inputType = 'message', recordId, sourceText = '' }) {
  const [copied, setCopied] = useState(false);

  if (!analysis) return null;

  const {
    risk = 'LOW',
    score = 0,
    threat_type = 'None',
    indicators = [],
    indicator_details = [],
    explanation = '',
    attacker_goal = '',
    recommendations = [],
    educational_tip = '',
    uncertainty = '',
    transcript = '',
  } = analysis;

  const handleCopyReport = () => {
    const text = `SAFEAI SECURITY REPORT
-------------------------
Input Type: ${inputType.toUpperCase()}
Risk Level: ${risk}
Threat Score: ${score}/100
Threat Classification: ${threat_type}

SUSPICIOUS INDICATORS:
${indicators.map((i) => `• ${i}`).join('\n')}

EXPLANATION:
${explanation}

ATTACKER GOAL:
${attacker_goal}

RECOMMENDED ACTION PLAN:
${recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

EDUCATIONAL TIP:
${educational_tip}
-------------------------
Analyzed safely by SAFEAI (Personal Cybersecurity Assistant)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const glowClass =
    risk === 'CRITICAL'
      ? 'cyber-glow-critical border-rose-900/60'
      : risk === 'HIGH'
      ? 'cyber-glow-high border-amber-900/60'
      : risk === 'MEDIUM'
      ? 'cyber-glow-medium border-yellow-900/60'
      : 'cyber-glow-low border-emerald-900/60';

  return (
    <div className={`cyber-card rounded-2xl p-6 sm:p-8 space-y-6 border transition-all ${glowClass}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <RiskBadge risk={risk} size="lg" />
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              {inputType}
            </span>
            {recordId && (
              <span className="text-xs font-mono text-slate-500">
                Ref #{recordId}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
            {threat_type}
          </h3>
        </div>

        <button
          onClick={handleCopyReport}
          className="self-start sm:self-center flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Report' : 'Copy Report'}</span>
        </button>
      </div>

      {/* AI Voice Briefing */}
      <AudioVoiceBriefing analysis={analysis} inputType={inputType} />

      {/* Risk Score Meter */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
        <RiskScore score={score} risk={risk} />
      </div>

      {/* Audio Transcript if applicable */}
      {transcript && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/40">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-cyan-400 mb-1.5 flex items-center space-x-1.5">
            <Info className="w-4 h-4" />
            <span>Transcribed Speech</span>
          </h4>
          <p className="text-sm text-slate-200 italic font-sans leading-relaxed">
            "{transcript}"
          </p>
        </div>
      )}

      {/* Grid: Explanation & Attacker Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Plain Language Explanation */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Why is this suspicious?</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {explanation}
          </p>
        </div>

        {/* Attacker Goal */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Possible Attacker Objective</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {attacker_goal || 'Trick the recipient into providing sensitive information or executing unauthorized actions.'}
          </p>
        </div>
      </div>

      {/* Psychological Profiling Breakdown */}
      <PsychProfileCard
        text={sourceText || transcript || explanation}
        initialProfile={analysis.psych_profile}
      />

      {/* Indicators */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Detected Threat Triggers & Evidence
        </h4>
        <IndicatorList indicators={indicators} indicatorDetails={indicator_details} />
      </div>

      {/* Protection Action Plan */}
      <div className="pt-2">
        <ProtectionPlan recommendations={recommendations} risk={risk} />
      </div>

      {/* Educational Tip */}
      {educational_tip && (
        <div className="flex items-start space-x-3 p-4 rounded-xl bg-blue-950/30 border border-blue-900/50 text-blue-200">
          <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="block text-blue-300 font-semibold mb-0.5">Security Coach Tip</strong>
            {educational_tip}
          </div>
        </div>
      )}

      {/* Uncertainty Disclaimer */}
      {uncertainty && (
        <p className="text-[11px] text-slate-500 text-center font-mono">
          Disclaimer: {uncertainty}
        </p>
      )}
    </div>
  );
}
