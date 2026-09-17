import React from 'react';
import { ShieldAlert, ShieldCheck, AlertCircle, TrendingUp, Info } from 'lucide-react';
import type { ThreatMetrics } from '../../types';

interface RiskGaugeProps {
  metrics: ThreatMetrics;
  onTriggerMitigation?: () => void;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ metrics, onTriggerMitigation }) => {
  const { compositeRiskScore, syntheticProbability, contextualRisk, anomalyScore, riskLevel, latencyMs } = metrics;

  const radius = 90;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const progressOffset = circumference - (compositeRiskScore / 100) * circumference;

  const getTheme = () => {
    if (riskLevel === 'CRITICAL') {
      return {
        stroke: '#e11d48', // Rose 600
        bgPill: 'bg-rose-50 border-rose-200 text-rose-700',
        badge: 'CRITICAL SYNTHETIC FRAUD',
        textColor: 'text-rose-600',
        barColor: 'bg-rose-600',
        containerBorder: 'border-rose-300'
      };
    }
    if (riskLevel === 'SUSPICIOUS') {
      return {
        stroke: '#d97706', // Amber 600
        bgPill: 'bg-amber-50 border-amber-200 text-amber-700',
        badge: 'SUSPICIOUS SPECTRAL ANOMALY',
        textColor: 'text-amber-600',
        barColor: 'bg-amber-600',
        containerBorder: 'border-amber-300'
      };
    }
    return {
      stroke: '#059669', // Emerald 600
      bgPill: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      badge: 'VERIFIED ORGANIC HUMAN',
      textColor: 'text-emerald-600',
      barColor: 'bg-emerald-600',
      containerBorder: 'border-emerald-200'
    };
  };

  const theme = getTheme();

  return (
    <div className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
      riskLevel === 'CRITICAL' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-blue-50 text-blue-600 border-blue-200'
          }`}>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase font-display tracking-wide">
              Live Threat Risk Meter
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Dynamic Bayesian Risk Engine (0% - 100%)
            </p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border font-mono ${theme.bgPill}`}>
          {theme.badge}
        </div>
      </div>

      {/* Central Radial Gauge */}
      <div className="flex flex-col items-center justify-center my-3 relative">
        <div className="relative w-56 h-32 flex items-end justify-center">
          
          <svg className="w-56 h-32 overflow-visible" viewBox="0 0 220 120">
            {/* Background Light Track */}
            <path
              d="M 20 110 A 90 90 0 0 1 200 110"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Threshold tick marks */}
            <line x1="85" y1="35" x2="90" y2="45" stroke="#94a3b8" strokeWidth="2" />
            <line x1="145" y1="38" x2="140" y2="48" stroke="#f43f5e" strokeWidth="2" />

            {/* Animated Value Arc */}
            <path
              d="M 20 110 A 90 90 0 0 1 200 110"
              fill="none"
              stroke={theme.stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>

          {/* Value Display in Center of Arc */}
          <div className="absolute bottom-0 flex flex-col items-center text-center">
            <div className="flex items-baseline gap-0.5">
              <span className={`text-4xl sm:text-5xl font-extrabold font-display tracking-tight transition-colors ${theme.textColor}`}>
                {compositeRiskScore.toFixed(1)}
              </span>
              <span className="text-xl font-bold text-slate-400 font-display">%</span>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold -mt-1">
              $S_{'{risk}'}(t)$ Composite Threat
            </span>
          </div>
        </div>

        {/* Action Callout */}
        <div className="mt-3 w-full">
          {riskLevel === 'CRITICAL' ? (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce flex-shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-rose-800">ACTION: WIRE TRANSFER BLOCKED</div>
                  <div className="text-[11px] text-rose-700">Synthetic Voice Impersonation Triggered</div>
                </div>
              </div>
              {onTriggerMitigation && (
                <button
                  onClick={onTriggerMitigation}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow transition-colors"
                >
                  Intervention
                </button>
              )}
            </div>
          ) : riskLevel === 'SUSPICIOUS' ? (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold text-amber-800">ACTION: STEP-UP 2FA / OTP CHALLENGE</div>
                <div className="text-[11px] text-amber-700">Mild Prosodic Variance Detected (Risk &gt; 40%)</div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold text-emerald-800">ACTION: TRANSACTION PERMITTED</div>
                <div className="text-[11px] text-emerald-700">Organic Human Vocal Fold Resonance Confirmed</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Formula Breakdown Panel */}
      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono text-slate-700">
          <span className="flex items-center gap-1.5 font-bold">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Formula Decomposition:</span>
          </span>
          <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            0.60·P + 0.25·C + 0.15·A
          </span>
        </div>

        {/* 1. Synthetic Probability (P_synth) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-slate-600 font-medium">1. $P_{'{synth}'}(t)$ ONNX Model Probability (60%)</span>
            <span className="font-bold text-slate-900">{(syntheticProbability * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                syntheticProbability > 0.75 ? 'bg-rose-600' : (syntheticProbability > 0.4 ? 'bg-amber-500' : 'bg-blue-600')
              }`}
              style={{ width: `${Math.min(100, syntheticProbability * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 2. Contextual Risk Factor (C_context) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-slate-600 font-medium">2. $C_{'{context}'}$ Gateway / Metadata Risk (25%)</span>
            <span className="font-bold text-slate-900">{(contextualRisk * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, contextualRisk * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 3. Acoustic Anomaly Factor (A_anomaly) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-slate-600 font-medium">3. $A_{'{anomaly}'}$ Speaker Deviation (15%)</span>
            <span className="font-bold text-slate-900">{(anomalyScore * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, anomalyScore * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
          <span>Inference Latency: ~{latencyMs}ms (WASM SIMD)</span>
          <span>Sampling: 4s sliding / 50% overlap</span>
        </div>
      </div>

    </div>
  );
};
