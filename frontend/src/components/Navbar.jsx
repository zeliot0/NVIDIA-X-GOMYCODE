import React, { useEffect, useState } from 'react';
import {
  Shield,
  Activity,
  LayoutDashboard,
  Search,
  Wrench,
  Swords,
  Radio,
  Clock,
  BookOpen,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { checkHealth } from '../services/api';
import FalconLogo from './FalconLogo';

export default function Navbar({ activePage, setActivePage, darkMode, setDarkMode }) {
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'arena', label: 'Arena', icon: Swords },
    { id: 'radar', label: 'Radar', icon: Radio },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'coach', label: 'Coach', icon: BookOpen },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <FalconLogo className="w-11 h-11 transition-transform group-hover:scale-105" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                SAFE<span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[9px] font-mono uppercase font-black px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] opacity-60 font-mono tracking-tight hidden sm:block">Proactive Threat Intelligence</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'opacity-70 hover:opacity-100 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'opacity-70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Theme Toggle & Status & CTA */}
        <div className="flex items-center space-x-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 transition-all text-zinc-300 hover:text-white"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Backend Status Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs border border-zinc-800 bg-zinc-900/60">
            <span className={`w-2 h-2 rounded-full ${isBackendHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-[11px] opacity-75 font-mono">{isBackendHealthy ? 'AI Live' : 'Offline'}</span>
          </div>

          {/* Quick Scan CTA */}
          <button
            onClick={() => handleNavClick('analyze')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-mono shadow-md shadow-emerald-500/25 hover:opacity-90 transition-opacity"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan Threat</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-700/60 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
