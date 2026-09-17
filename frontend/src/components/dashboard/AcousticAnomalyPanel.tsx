import React from 'react';
import { Sliders, Cpu, Waves, Wind, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { AcousticBreakdown } from '../../types';

interface AcousticAnomalyPanelProps {
  breakdown: AcousticBreakdown;
  isStreaming: boolean;
}

export const AcousticAnomalyPanel: React.FC<AcousticAnomalyPanelProps> = ({
  breakdown
}) => {
  const {
    pitchStabilityIndex,
    spectralEnergyCutoffKhz,
    microPauseNaturalness,
    phaseCoherenceAnomaly,
    detectedVocoder
  } = breakdown;

  const isPitchSynthetic = pitchStabilityIndex > 0.75;
  const isCutoffSynthetic = spectralEnergyCutoffKhz < 10.0;
  const isPauseSynthetic = microPauseNaturalness < 50;
  const isPhaseSynthetic = phaseCoherenceAnomaly > 60;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-4">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Acoustic Artifact Breakdown
            </h3>
            <p className="text-[11px] text-slate-500 font-body">
              Sub-Band DSP Extraction & Neural Vocoder Detection
            </p>
          </div>
        </div>

        {/* Neural Vocoder Fingerprint Badge */}
        <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 ${
          detectedVocoder !== 'None (Organic Glottal)'
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          <Cpu className="w-3.5 h-3.5" />
          <span>Vocoder: {detectedVocoder}</span>
        </div>
      </div>

      {/* 4 Technical Diagnostic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Metric 1: Pitch Variation Stability Index (PVSI) */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isPitchSynthetic ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Waves className={`w-4 h-4 ${isPitchSynthetic ? 'text-rose-600' : 'text-blue-600'}`} />
              <span className="text-xs font-bold text-slate-800">Pitch Stability (PVSI)</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isPitchSynthetic ? 'text-rose-700' : 'text-emerald-700'}`}>
              {pitchStabilityIndex.toFixed(2)}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPitchSynthetic ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, pitchStabilityIndex * 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Target: 0.35 - 0.65</span>
            <span className={isPitchSynthetic ? 'text-rose-700 font-bold' : 'text-emerald-700 font-semibold'}>
              {isPitchSynthetic ? '⚠️ Robotic Constancy' : '✓ Dynamic Human Prosody'}
            </span>
          </div>
        </div>

        {/* Metric 2: Spectral Energy Cutoff Frequency */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isCutoffSynthetic ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className={`w-4 h-4 ${isCutoffSynthetic ? 'text-rose-600' : 'text-blue-600'}`} />
              <span className="text-xs font-bold text-slate-800">Vocoder Cutoff (kHz)</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isCutoffSynthetic ? 'text-rose-700' : 'text-emerald-700'}`}>
              {spectralEnergyCutoffKhz.toFixed(1)} kHz
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCutoffSynthetic ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, (spectralEnergyCutoffKhz / 16) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>HiFi-GAN Threshold: 8.0 kHz</span>
            <span className={isCutoffSynthetic ? 'text-rose-700 font-bold' : 'text-emerald-700 font-semibold'}>
              {isCutoffSynthetic ? '⚠️ Vocoder Cutoff' : '✓ Full Human Bandwidth'}
            </span>
          </div>
        </div>

        {/* Metric 3: Micro-Pause Respiration Naturalness */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isPauseSynthetic ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Wind className={`w-4 h-4 ${isPauseSynthetic ? 'text-rose-600' : 'text-blue-600'}`} />
              <span className="text-xs font-bold text-slate-800">Breath & Micro-Pauses</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isPauseSynthetic ? 'text-rose-700' : 'text-emerald-700'}`}>
              {microPauseNaturalness}%
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPauseSynthetic ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
              style={{ width: `${microPauseNaturalness}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Natural Respiration</span>
            <span className={isPauseSynthetic ? 'text-rose-700 font-bold' : 'text-emerald-700 font-semibold'}>
              {isPauseSynthetic ? '⚠️ Missing Glottal Inhale' : '✓ Organic Respiration'}
            </span>
          </div>
        </div>

        {/* Metric 4: Phase Coherence Anomaly */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isPhaseSynthetic ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className={`w-4 h-4 ${isPhaseSynthetic ? 'text-rose-600' : 'text-blue-600'}`} />
              <span className="text-xs font-bold text-slate-800">Phase Discontinuity</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isPhaseSynthetic ? 'text-rose-700' : 'text-emerald-700'}`}>
              {phaseCoherenceAnomaly}%
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPhaseSynthetic ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
              style={{ width: `${phaseCoherenceAnomaly}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Target: &lt; 25%</span>
            <span className={isPhaseSynthetic ? 'text-rose-700 font-bold' : 'text-emerald-700 font-semibold'}>
              {isPhaseSynthetic ? '⚠️ Glottal Phase Jitter' : '✓ Natural Waveform'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
