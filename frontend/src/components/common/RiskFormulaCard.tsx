import React from 'react';
import { Activity, Radio, Shield } from 'lucide-react';
import type { ThreatMetrics } from '../../types';

interface RiskFormulaCardProps {
  metrics?: ThreatMetrics;
  showLiveBreakdown?: boolean;
  className?: string;
}

export const RiskFormulaCard: React.FC<RiskFormulaCardProps> = ({
  metrics,
  showLiveBreakdown = false,
  className = ''
}) => {
  const pSynth = metrics ? metrics.syntheticProbability : 0.85;
  const cContext = metrics ? metrics.contextualRisk : 0.40;
  const aAnomaly = metrics ? metrics.anomalyScore : 0.30;
  
  const synthContribution = (0.60 * pSynth * 100).toFixed(1);
  const contextContribution = (0.25 * cContext * 100).toFixed(1);
  const anomalyContribution = (0.15 * aAnomaly * 100).toFixed(1);
  const computedTotal = metrics 
    ? metrics.compositeRiskScore.toFixed(1) 
    : (0.60 * pSynth * 100 + 0.25 * cContext * 100 + 0.15 * aAnomaly * 100).toFixed(1);

  return (
    <div className={`w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden ${className}`}>
      {/* Top Banner: Risk Formula */}
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Main Formula Header Pill / Container */}
        <div className="w-full bg-blue-50/70 border-2 border-blue-400/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-xs">
          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight select-none">
            <span className="text-slate-900 font-serif italic">S</span>
            <span className="text-slate-900 text-sm sm:text-base font-bold font-sans">risk</span>
            <span className="text-slate-900 font-sans"> (t) = </span>
            
            <span className="text-blue-600 font-serif font-bold">
              w<sub className="font-sans font-normal text-xs sm:text-sm">1</sub> · P<sub className="font-sans font-normal text-xs sm:text-sm">synth</sub>(t)
            </span>
            
            <span className="text-slate-900 font-sans"> + </span>
            
            <span className="text-emerald-600 font-serif font-bold">
              w<sub className="font-sans font-normal text-xs sm:text-sm">2</sub> · C<sub className="font-sans font-normal text-xs sm:text-sm">context</sub>
            </span>
            
            <span className="text-slate-900 font-sans"> + </span>
            
            <span className="text-amber-600 font-serif font-bold">
              w<sub className="font-sans font-normal text-xs sm:text-sm">3</sub> · A<sub className="font-sans font-normal text-xs sm:text-sm">anomaly</sub>
            </span>
          </div>
        </div>

        {/* Weights Normalization Badge */}
        <div className="mt-3.5 inline-flex items-center px-5 py-1.5 rounded-xl bg-white border-2 border-blue-400 text-blue-700 font-serif font-bold text-xs sm:text-sm shadow-xs tracking-wide">
          w<sub className="font-sans text-[11px]">1</sub> + w<sub className="font-sans text-[11px]">2</sub> + w<sub className="font-sans text-[11px]">3</sub> = 1.0
        </div>

        {/* Branching Tree Connectors (SVG) */}
        <div className="w-full max-w-2xl h-8 relative hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 600 32" fill="none" preserveAspectRatio="none">
            {/* Center vertical stem */}
            <line x1="300" y1="0" x2="300" y2="16" stroke="#3b82f6" strokeWidth="2.5" />
            {/* Horizontal branch */}
            <line x1="100" y1="16" x2="500" y2="16" stroke="#3b82f6" strokeWidth="2.5" />
            {/* Left drop line */}
            <line x1="100" y1="16" x2="100" y2="32" stroke="#3b82f6" strokeWidth="2.5" />
            {/* Center drop line */}
            <line x1="300" y1="16" x2="300" y2="32" stroke="#3b82f6" strokeWidth="2.5" />
            {/* Right drop line */}
            <line x1="500" y1="16" x2="500" y2="32" stroke="#3b82f6" strokeWidth="2.5" />
          </svg>
        </div>

        {/* 3 Component Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 md:mt-0">
          
          {/* Card 1: P_synth(t) */}
          <div className="rounded-3xl border-2 border-blue-400 bg-white p-5 flex flex-col items-center text-center shadow-xs transition-all hover:shadow-md hover:border-blue-500">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 mb-3">
              <Radio className="w-7 h-7" />
            </div>

            {/* Variable Title */}
            <div className="text-xl font-serif font-bold text-blue-700 italic">
              P<sub className="font-sans text-xs font-semibold not-italic">synth</sub>(t)
            </div>

            {/* Weight Pill */}
            <div className="my-2.5 px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-xs sm:text-sm font-bold font-mono">
              w<sub className="font-sans text-[10px]">1</sub> = 0.60
            </div>

            {/* Divider line */}
            <div className="w-full h-px bg-blue-100 my-2" />

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
              Real-time synthetic speech probability score from your lightweight ONNX model (0.0 to 1.0).
            </p>

            {/* Live Telemetry (if enabled) */}
            {showLiveBreakdown && (
              <div className="w-full mt-4 pt-3 border-t border-blue-100/80 bg-blue-50/50 rounded-xl p-2.5 text-left">
                <div className="flex justify-between text-[11px] font-mono text-slate-700 font-semibold mb-1">
                  <span>Current Value:</span>
                  <span className="text-blue-700 font-bold">{(pSynth * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${pSynth * 100}%` }} />
                </div>
                <div className="mt-1.5 text-[10px] text-blue-700 font-mono font-medium text-right">
                  Contributes: <strong className="font-bold">+{synthContribution}%</strong>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: C_context */}
          <div className="rounded-3xl border-2 border-emerald-400 bg-white p-5 flex flex-col items-center text-center shadow-xs transition-all hover:shadow-md hover:border-emerald-500">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 mb-3">
              <Shield className="w-7 h-7" />
            </div>

            {/* Variable Title */}
            <div className="text-xl font-serif font-bold text-emerald-700 italic">
              C<sub className="font-sans text-xs font-semibold not-italic">context</sub>
            </div>

            {/* Weight Pill */}
            <div className="my-2.5 px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold font-mono">
              w<sub className="font-sans text-[10px]">2</sub> = 0.25
            </div>

            {/* Divider line */}
            <div className="w-full h-px bg-emerald-100 my-2" />

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
              External threat metadata (e.g., unverified international gateway, high-value financial transaction request, or spoofed caller ID score).
            </p>

            {/* Live Telemetry (if enabled) */}
            {showLiveBreakdown && (
              <div className="w-full mt-4 pt-3 border-t border-emerald-100/80 bg-emerald-50/50 rounded-xl p-2.5 text-left">
                <div className="flex justify-between text-[11px] font-mono text-slate-700 font-semibold mb-1">
                  <span>Current Value:</span>
                  <span className="text-emerald-700 font-bold">{(cContext * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${cContext * 100}%` }} />
                </div>
                <div className="mt-1.5 text-[10px] text-emerald-700 font-mono font-medium text-right">
                  Contributes: <strong className="font-bold">+{contextContribution}%</strong>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: A_anomaly */}
          <div className="rounded-3xl border-2 border-amber-400 bg-white p-5 flex flex-col items-center text-center shadow-xs transition-all hover:shadow-md hover:border-amber-500">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 mb-3">
              <Activity className="w-7 h-7" />
            </div>

            {/* Variable Title */}
            <div className="text-xl font-serif font-bold text-amber-700 italic">
              A<sub className="font-sans text-xs font-semibold not-italic">anomaly</sub>
            </div>

            {/* Weight Pill */}
            <div className="my-2.5 px-4 py-1 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-bold font-mono">
              w<sub className="font-sans text-[10px]">3</sub> = 0.15
            </div>

            {/* Divider line */}
            <div className="w-full h-px bg-amber-100 my-2" />

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
              Deviation score measuring pitch stability and energy anomalies against historical speaker profiles.
            </p>

            {/* Live Telemetry (if enabled) */}
            {showLiveBreakdown && (
              <div className="w-full mt-4 pt-3 border-t border-amber-100/80 bg-amber-50/50 rounded-xl p-2.5 text-left">
                <div className="flex justify-between text-[11px] font-mono text-slate-700 font-semibold mb-1">
                  <span>Current Value:</span>
                  <span className="text-amber-700 font-bold">{(aAnomaly * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${aAnomaly * 100}%` }} />
                </div>
                <div className="mt-1.5 text-[10px] text-amber-700 font-mono font-medium text-right">
                  Contributes: <strong className="font-bold">+{anomalyContribution}%</strong>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Live Total Composite Score Banner (if live breakdown enabled) */}
        {showLiveBreakdown && (
          <div className="w-full mt-6 p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Live Risk Synthesis:</span>
              <span className="text-xs font-mono text-slate-300">
                {synthContribution}% + {contextContribution}% + {anomalyContribution}%
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs text-slate-400 font-bold">Composite S_risk(t) =</span>
              <span className={`text-lg font-extrabold px-2.5 py-0.5 rounded-lg ${
                parseFloat(computedTotal) >= 75 ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50' :
                parseFloat(computedTotal) >= 40 ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' :
                'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
              }`}>
                {computedTotal}%
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
