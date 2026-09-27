import React from 'react';
import { BookOpen, ShieldCheck, Key, PhoneCall, AlertTriangle, ExternalLink } from 'lucide-react';
import ChatBox from '../components/ChatBox';

export default function Coach() {
  const topics = [
    {
      title: 'Phishing & Urgency',
      desc: 'Attackers create fake deadlines so you panic and act without thinking. Never rush.',
      icon: AlertTriangle,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800',
    },
    {
      title: 'OTP Confidentiality',
      desc: 'No real bank or service will ever ask for your SMS verification code over phone or message.',
      icon: Key,
      color: 'text-rose-400 bg-rose-950/60 border-rose-800',
    },
    {
      title: 'Password Managers',
      desc: 'Use unique 20-character passwords per account. A manager autofills only on legitimate domains.',
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
    },
    {
      title: 'Vishing (Phone Scams)',
      desc: 'If a caller claims your card is blocked, hang up and call the number on the back of your card.',
      icon: PhoneCall,
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center space-x-3">
          <BookOpen className="w-7 h-7 text-cyan-400" />
          <span>Cybersecurity Coach</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Learn how to recognize online traps, understand hacker psychology, and protect your digital identity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-2">
          <ChatBox />
        </div>

        {/* Knowledge Guide Cards Sidebar */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl cyber-card border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs">
              Everyday Defensive Rules
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Memorize these foundational security habits to defend yourself against 99% of cyberattacks.
            </p>
          </div>

          <div className="space-y-3">
            {topics.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl cyber-card border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-1.5 rounded-lg border ${t.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200">{t.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Tip Box */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-900/50 text-xs text-cyan-300 space-y-1">
            <span className="font-bold text-white block">💡 Golden Rule:</span>
            <span>
              If you receive an unexpected message demanding immediate action, navigate to the official website yourself. Never follow the link sent to you.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
