import React from 'react';
import { Shield, Cpu, Lock, Volume2, Mic, Sparkles, ArrowLeft } from 'lucide-react';
import type { RiskLevel } from '../../types';

interface HeaderProps {
  riskLevel: RiskLevel;
  isStreaming: boolean;
  isLiveMic: boolean;
  currentTitle?: string;
  onOpenReport?: () => void;
  onBackToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  riskLevel,
  isStreaming,
  isLiveMic,
  currentTitle,
  onOpenReport,
  onBackToLanding
}) => {
  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-8 py-3 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Home Navigation */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm transition-all ${
                riskLevel === 'CRITICAL'
                  ? 'bg-rose-50 text-rose-600 border border-rose-300'
                  : riskLevel === 'SUSPICIOUS'
                  ? 'bg-amber-50 text-amber-600 border border-amber-300'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-300'
              }`}>
                <Shield className="w-5 h-5" />
              </div>
              {isStreaming && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    riskLevel === 'CRITICAL' ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    riskLevel === 'CRITICAL' ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight font-display text-slate-900">
                  VaniRakshak
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  वाणी रक्षक
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                  <Cpu className="w-3 h-3" /> Edge ONNX
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Live AI Voice Deepfake & Fraud Interception Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Live Audio Status & Telemetry Badges */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          
          {/* Active Audio State */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            isStreaming
              ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            {isLiveMic ? (
              <>
                <Mic className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span className="font-semibold text-blue-900">Live Microphone (16 kHz)</span>
              </>
            ) : isStreaming ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                <span className="truncate max-w-[140px] text-slate-800 font-medium">{currentTitle || 'Audio Stream'}</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Standby</span>
              </>
            )}
          </div>

          {/* DPDP Act 2023 Section 6 Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium" title="Section 6 DPDP Act 2023 Compliant. Ephemeral RAM buffering.">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">DPDP 2023</span>
            <span className="text-[10px] px-1 bg-emerald-100 rounded text-emerald-800 font-mono font-bold">Sec 6</span>
          </div>

          {/* Zero Cloud Compute Cost Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono">
            <span className="font-bold text-blue-900">₹0.00</span>
            <span className="text-slate-500 text-[10px]">/call</span>
          </div>

          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Forensic Audit</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
