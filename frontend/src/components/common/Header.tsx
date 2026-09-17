import React from 'react';
import { Cpu, Lock, Volume2, Mic, Sparkles, ArrowLeft } from 'lucide-react';
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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 px-4 lg:px-8 py-3 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Home Navigation */}
        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-xs border p-0.5 bg-white ${
              riskLevel === 'CRITICAL'
                ? 'border-rose-400 ring-2 ring-rose-500/20'
                : riskLevel === 'SUSPICIOUS'
                ? 'border-amber-400 ring-2 ring-amber-500/20'
                : 'border-slate-200'
            }`}>
              <img src="/logo.png" alt="VaniRakshak Logo" className="w-full h-full object-contain" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold font-heading text-slate-900 tracking-tight">
                  VaniRakshak
                </span>
                <span className="text-[11px] px-2 py-0.2 rounded-full font-bold bg-orange-50 text-orange-700 border border-orange-200">
                  वाणी रक्षक
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                  <Cpu className="w-3 h-3" /> Edge ONNX
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium font-body">
                AI Voice Deepfake Defense & Financial Wire Interception
              </p>
            </div>
          </div>
        </div>

        {/* Live Audio Status & Telemetry Badges */}
        <div className="flex items-center gap-2.5">
          
          {/* Active Audio State Pill */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
            isStreaming
              ? riskLevel === 'CRITICAL'
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            {isLiveMic ? (
              <>
                <Mic className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span className="font-semibold text-blue-900">Live Microphone (16 kHz)</span>
              </>
            ) : isStreaming ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="truncate max-w-[130px] font-medium">{currentTitle || 'Audio Stream'}</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Standby</span>
              </>
            )}
          </div>

          {/* DPDP Act 2023 Section 6 Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>DPDP 2023 Sec 6</span>
          </div>

          {/* Zero Cloud Compute Cost Badge */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono">
            <span className="font-bold text-slate-900">₹0.00</span>
            <span className="text-slate-500 text-[10px]">/call</span>
          </div>

          {/* Forensic Audit Report Modal Trigger */}
          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
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
