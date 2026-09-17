import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import type { ThreatMetrics } from '../../types';

interface RiskGaugeProps {
  metrics: ThreatMetrics;
  onTriggerMitigation?: () => void;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ metrics, onTriggerMitigation }) => {
  const { compositeRiskScore, syntheticProbability, contextualRisk, anomalyScore, riskLevel, latencyMs } = metrics;

  const radius = 80;
  const strokeWidth = 12;
  const circumference = Math.PI * radius;
  const progressOffset = circumference - (compositeRiskScore / 100) * circumference;

  const getTheme = () => {
    if (riskLevel === 'CRITICAL') {
      return {
        stroke: '#f43f5e',
        bgPill: 'bg-rose-50 border-rose-200 text-rose-700',
        badge: 'CRITICAL THREAT',
        textColor: 'text-rose-600',
        barColor: 'bg-rose-600',
        containerBorder: 'border-rose-300 ring-2 ring-rose-500/10'
      };
    }
    if (riskLevel === 'SUSPICIOUS') {
      return {
        stroke: '#f59e0b',
        bgPill: 'bg-amber-50 border-amber-200 text-amber-700',
        badge: 'SUSPICIOUS ANOMALY',
        textColor: 'text-amber-600',
        barColor: 'bg-amber-600',
        containerBorder: 'border-amber-300 ring-2 ring-amber-500/10'
      };
    }
    return {
      stroke: '#10b981',
      bgPill: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      badge: 'VERIFIED ORGANIC',
      textColor: 'text-emerald-600',
      barColor: 'bg-emerald-600',
      containerBorder: 'border-slate-200'
    };
  };

  const theme = getTheme();

  return (
    <div className={`bg-white rounded-2xl p-5 border shadow-xs flex flex-col justify-between transition-all duration-300 ${theme.containerBorder}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
            riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
          }`}>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Dynamic Threat Risk Meter
            </h3>
            <p className="text-[11px] text-slate-500 font-body">
              Bayesian Fusion Engine (0% – 100%)
            </p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${theme.bgPill}`}>
          {theme.badge}
        </div>
      </div>

      {/* Central Radial Semi-Circle Gauge */}
      <div className="flex flex-col items-center justify-center my-3 relative">
        <div className="relative w-48 h-26 flex items-end justify-center">
          
          <svg className="w-48 h-26 overflow-visible" viewBox="0 0 200 110">
            {/* Background Track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Threshold Ticks */}
            <line x1="75" y1="32" x2="80" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <line x1="125" y1="32" x2="120" y2="40" stroke="#f43f5e" strokeWidth="2" />

            {/* Animated Progress Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={theme.stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          {/* Center Score Display */}
          <div className="absolute bottom-0 flex flex-col items-center text-center">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${theme.textColor}`}>
              {compositeRiskScore.toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-semibold -mt-0.5">
              LATENCY: {latencyMs} ms
            </span>
          </div>
        </div>

        <div className="w-full flex justify-between text-[10px] font-mono text-slate-400 px-6 mt-1">
          <span>0% (Safe)</span>
          <span className="text-amber-600">40% Suspicious</span>
          <span className="text-rose-600 font-bold">75% Killswitch</span>
        </div>
      </div>

      {/* 3 Bayesian Sub-Factor Metric Bars */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100">
        
        {/* Factor 1: Synthetic Probability */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-600 font-body">1. Synthetic Probability (P_synth · 0.60):</span>
            <span className="font-bold text-slate-900">{Math.round(syntheticProbability * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                syntheticProbability > 0.6 ? 'bg-rose-500' : 'bg-blue-500'
              }`}
              style={{ width: `${syntheticProbability * 100}%` }}
            />
          </div>
        </div>

        {/* Factor 2: Context Risk Factor */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-600 font-body">2. Context Risk (C_context · 0.25):</span>
            <span className="font-bold text-slate-900">{Math.round(contextualRisk * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                contextualRisk > 0.5 ? 'bg-amber-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${contextualRisk * 100}%` }}
            />
          </div>
        </div>

        {/* Factor 3: Speaker Baseline Anomaly */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-600 font-body">3. Baseline Anomaly (A_anomaly · 0.15):</span>
            <span className="font-bold text-slate-900">{Math.round(anomalyScore * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                anomalyScore > 0.5 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${anomalyScore * 100}%` }}
            />
          </div>
        </div>

      </div>

      {/* Action Recommendation */}
      {riskLevel === 'CRITICAL' && onTriggerMitigation && (
        <div className="mt-3 pt-3 border-t border-rose-200">
          <button
            onClick={onTriggerMitigation}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Fraud Interception Killswitch Active</span>
          </button>
        </div>
      )}

    </div>
  );
};
