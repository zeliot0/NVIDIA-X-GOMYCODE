import React from 'react';
import { Shield, MessageSquare, Globe, Image as ImageIcon, FileText, Mic, ArrowRight, Zap, CheckCircle2, Lock, Eye, AlertTriangle } from 'lucide-react';

export default function Home({ setActivePage, setAnalyzeTab }) {
  const handleStartAnalysis = (tab) => {
    if (setAnalyzeTab) setAnalyzeTab(tab);
    setActivePage('analyze');
  };

  const inputTypes = [
    { id: 'text', label: 'Message / Text', icon: MessageSquare, desc: 'Phishing SMS, emails, fake job offers, urgency traps' },
    { id: 'url', label: 'Safe URL Check', icon: Globe, desc: 'Inspect links, punycode, brand spoofing & domain safety' },
    { id: 'image', label: 'Screenshot / Image', icon: ImageIcon, desc: 'Analyze fake login screens, scam popups & brand copycats' },
    { id: 'document', label: 'Document File', icon: FileText, desc: 'Safely inspect invoices, PDF/DOCX attachments without running them' },
    { id: 'voice', label: 'Voice Message', icon: Mic, desc: 'Detect phone scams, vishing, fake bank calls & OTP requests' },
  ];

  const steps = [
    { title: 'SEE', desc: 'Accepts messages, links, screenshots, audio, and documents' },
    { title: 'UNDERSTAND', desc: 'Parses semantics, urgency signals, and social engineering context' },
    { title: 'DETECT', desc: 'Applies cybersecurity heuristics + deep AI threat reasoning' },
    { title: 'EXPLAIN', desc: 'Explains why in simple, non-technical everyday language' },
    { title: 'PROTECT', desc: 'Provides immediate defensive action steps and checklists' },
    { title: 'LEARN', desc: 'Educates users to develop lifelong security reflexes' },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold shadow-inner">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation AI Cybersecurity for Everyday Users</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Don't just detect the threat. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Understand it.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          SAFEAI helps you instantly verify whether suspicious messages, links, screenshots, voice calls, or documents are dangerous.
        </p>

        {/* Hero CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handleStartAnalysis('text')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
          >
            <span>Analyze Something Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActivePage('coach')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
          >
            Talk to Cyber Coach
          </button>
        </div>
      </section>

      {/* Input Channels Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white">What would you like to analyze?</h2>
          <p className="text-xs sm:text-sm text-slate-400">Choose an input channel to begin instant security inspection</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {inputTypes.map((channel) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.id}
                onClick={() => handleStartAnalysis(channel.id)}
                className="group cyber-card rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                      {channel.label}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {channel.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center text-xs font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                  <span>Inspect Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Flow Pipeline */}
      <section className="max-w-6xl mx-auto px-4 py-8 rounded-3xl bg-slate-900/50 border border-slate-800">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest font-mono text-cyan-400">The SAFEAI Lifecycle</span>
          <h2 className="text-2xl font-bold text-white mt-1">From Suspicion to Understanding</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((st, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                0{i + 1}
              </span>
              <h4 className="text-sm font-bold text-white pt-1">{st.title}</h4>
              <p className="text-[11px] text-slate-400 leading-snug">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Multilingual Support Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-6 rounded-2xl cyber-card border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <h3 className="text-base font-bold text-white">Full Multilingual Security Intelligence</h3>
            <p className="text-xs text-slate-400">
              Analyzes messages in <strong>English</strong>, <strong>Français</strong>, and <strong>العربية / Tunisian Arabic</strong> natively.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800">English</span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800">Français</span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800">العربية</span>
          </div>
        </div>
      </section>
    </div>
  );
}
