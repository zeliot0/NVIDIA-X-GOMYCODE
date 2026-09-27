import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, Activity, Cpu, BookOpen, Clock, LayoutDashboard, Search } from 'lucide-react';
import { checkHealth } from '../services/api';

export default function Navbar({ activePage, setActivePage }) {
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);

  useEffect(() => {
    const ping = async () => {
      try {
        const res = await checkHealth();
        if (res.status === 'healthy') setIsBackendHealthy(true);
      } catch (err) {
        setIsBackendHealthy(false);
      }
    };
    ping();
    const interval = setInterval(ping, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze', icon: Search },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'coach', label: 'Cyber Coach', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-white">SAFE<span className="text-cyan-400">AI</span></span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">v1.0</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Personal Cybersecurity Assistant</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Backend Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${isBackendHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-slate-400 text-[11px]">{isBackendHealthy ? 'AI Engine Ready' : 'Connecting...'}</span>
          </div>

          <button
            onClick={() => setActivePage('analyze')}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:opacity-95 transition-opacity"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Scan Threat</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-900 bg-slate-950/95 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded text-[11px] font-medium ${
                isActive ? 'text-cyan-400' : 'text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
