import React from 'react';
import { Shield, Cpu, Lock, Volume2, Mic, Sparkles } from 'lucide-react';
import type { RiskLevel } from '../../types';

interface HeaderProps {
  riskLevel: RiskLevel;
  isStreaming: boolean;
  isLiveMic: boolean;
  currentTitle?: string;
  onOpenReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  riskLevel,
  isStreaming,
  isLiveMic,
  currentTitle,
  onOpenReport
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg transition-all ${
              riskLevel === 'CRITICAL'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 glow-red animate-pulse'
                : riskLevel === 'SUSPICIOUS'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 glow-amber'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 glow-emerald'
            }`}>
              <Shield className="w-6 h-6" />
            </div>
            {isStreaming && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  riskLevel === 'CRITICAL' ? 'bg-rose-400' : 'bg-emerald-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-slate-950 ${
                  riskLevel === 'CRITICAL' ? 'bg-rose-500' : 'bg-emerald-500'
                }`}></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight font-display bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                VaniRakshak
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
                वाणी रक्षक v2.4
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                <Cpu className="w-3 h-3" /> Edge ONNX / WASM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Real-Time AI Voice Deepfake Detection & Dynamic Fraud Interception Engine
            </p>
          </div>
        </div>

        {/* Live Audio & Compliance Badges */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Active Audio State */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            isStreaming
              ? 'bg-slate-900/90 border-cyan-500/40 text-cyan-300 shadow-sm'
              : 'bg-slate-900/40 border-slate-800 text-slate-400'
          }`}>
            {isLiveMic ? (
              <>
                <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="font-semibold text-white">Live Microphone (16 kHz)</span>
              </>
            ) : isStreaming ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span className="truncate max-w-[150px] text-slate-200">{currentTitle || 'Audio Stream'}</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                <span>DSP Engine Standby</span>
              </>
            )}
          </div>

          {/* DPDP Act 2023 Section 6 Compliance Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium" title="Compliance with Section 6 of India's Digital Personal Data Protection Act 2023. Audio processed ephemerally in RAM; 0 bytes persisted.">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">DPDP Act 2023</span>
            <span className="text-[10px] px-1 bg-emerald-900/80 rounded text-emerald-200">Sec 6 Ephemeral</span>
          </div>

          {/* Zero Cloud Compute Cost Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono" title="Client-Side Edge Inference via ONNX WebAssembly. Zero GPU server cost per call.">
            <span className="font-bold text-white">₹0.00</span>
            <span className="text-slate-400 text-[11px]">/call compute</span>
          </div>

          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 hover:border-slate-600 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Forensic Audit</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
