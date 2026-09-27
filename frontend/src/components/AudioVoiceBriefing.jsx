import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Sparkles, Activity } from 'lucide-react';

export default function AudioVoiceBriefing({ analysis, inputType = 'threat' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [supported, setSupported] = useState(true);
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  if (!supported || !analysis) return null;

  const buildBriefingText = () => {
    const {
      risk = 'UNKNOWN',
      threat_type = 'Unclassified',
      explanation = '',
      recommendations = [],
      attacker_goal = '',
    } = analysis;

    const topRec = recommendations.length > 0 ? recommendations[0] : 'Do not click links or share credentials.';
    
    return `SAFEAI Security Briefing. Threat level: ${risk}. Threat classification: ${threat_type}. ${explanation}. Attacker objective: ${attacker_goal}. Immediate defensive action: ${topRec}. SAFEAI defense standing by.`;
  };

  const handlePlay = () => {
    if (!synthRef.current) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    synthRef.current.cancel();

    const text = buildBriefingText();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Pick best English voice if available
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft')) && v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!synthRef.current) return;
    synthRef.current.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const toggleRate = () => {
    const nextRate = playbackRate === 1.0 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1.0;
    setPlaybackRate(nextRate);
    if (isPlaying) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-slate-900/90 via-cyan-950/20 to-slate-900/90 border border-cyan-800/40 shadow-sm">
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
          isPlaying
            ? 'bg-cyan-500 text-slate-950 animate-pulse shadow-md shadow-cyan-500/50'
            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
        }`}>
          <Volume2 className="w-5 h-5" />
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold tracking-wide text-cyan-300 uppercase">
              AI Cyber Voice Briefing
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              Live TTS
            </span>
          </div>
          <p className="text-[11px] opacity-70">
            {isPlaying ? 'Audibly reciting tactical security assessment...' : 'Listen to instant audio breakdown of this threat'}
          </p>
        </div>
      </div>

      {/* Playback Controls & Waveform */}
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        {/* Animated Audio Equalizer Bars */}
        {isPlaying && (
          <div className="flex items-end space-x-0.5 h-5 px-2">
            <span className="w-1 bg-cyan-400 animate-bounce rounded-full h-3"></span>
            <span className="w-1 bg-cyan-300 animate-bounce rounded-full h-5" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 bg-cyan-400 animate-bounce rounded-full h-2" style={{ animationDelay: '300ms' }}></span>
            <span className="w-1 bg-blue-400 animate-bounce rounded-full h-4" style={{ animationDelay: '450ms' }}></span>
            <span className="w-1 bg-cyan-500 animate-bounce rounded-full h-3" style={{ animationDelay: '200ms' }}></span>
          </div>
        )}

        <button
          onClick={toggleRate}
          title="Toggle playback speed"
          className="text-[11px] font-mono font-bold px-2 py-1 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 border border-slate-700"
        >
          {playbackRate}x
        </button>

        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPaused ? 'Resume' : 'Play Brief'}</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause</span>
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            onClick={handleStop}
            title="Stop audio"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition-all"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
}
