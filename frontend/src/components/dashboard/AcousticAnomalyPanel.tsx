import React from 'react';
import { Sliders, Cpu, Waves, Wind, Disc, AlertOctagon } from 'lucide-react';
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
    detectedVocoder,
    harmonicToNoiseRatioDb,
    formantDistortionScore
  } = breakdown;

  const isPitchSynthetic = pitchStabilityIndex > 0.75;
  const isCutoffSynthetic = spectralEnergyCutoffKhz < 10.0;
  const isPauseSynthetic = microPauseNaturalness < 50;
  const isPhaseSynthetic = phaseCoherenceAnomaly > 60;

  return (
    <div className="glass-panel rounded-2xl p-4 lg:p-5 border border-slate-800 flex flex-col gap-4">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
              Acoustic Artifact Breakdown
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Sub-Band DSP Extraction & Neural Vocoder Fingerprinting
            </p>
          </div>
        </div>

        {/* Neural Vocoder Fingerprint Badge */}
        <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border flex items-center gap-1.5 ${
          detectedVocoder !== 'None (Organic Glottal)'
            ? 'bg-rose-950/70 border-rose-500/50 text-rose-300 animate-pulse'
            : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
        }`}>
          <Cpu className="w-3.5 h-3.5" />
          <span>Vocoder: {detectedVocoder}</span>
        </div>
      </div>

      {/* 4 Technical Diagnostic Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Metric 1: Pitch Variation Stability Index (PVSI) */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isPitchSynthetic
            ? 'bg-rose-950/30 border-rose-500/40'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Waves className={`w-4 h-4 ${isPitchSynthetic ? 'text-rose-400' : 'text-cyan-400'}`} />
              <span className="text-xs font-bold text-slate-200">Pitch Stability Index (PVSI)</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isPitchSynthetic ? 'text-rose-400' : 'text-emerald-400'}`}>
              {pitchStabilityIndex.toFixed(2)}
            </span>
          </div>

          <div className="w-full bg-slate-800/80 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPitchSynthetic ? 'bg-rose-500 glow-red' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, pitchStabilityIndex * 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>Natural Prosody: 0.35 - 0.65</span>
            <span className={isPitchSynthetic ? 'text-rose-300 font-semibold' : 'text-emerald-400'}>
              {isPitchSynthetic ? '⚠️ Robotic Pitch Regularity' : '✓ Dynamic Human Prosody'}
            </span>
          </div>
        </div>

        {/* Metric 2: Spectral Energy Cutoff Frequency */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isCutoffSynthetic
            ? 'bg-rose-950/30 border-rose-500/40'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Disc className={`w-4 h-4 ${isCutoffSynthetic ? 'text-rose-400' : 'text-cyan-400'}`} />
              <span className="text-xs font-bold text-slate-200">Spectral Energy Cutoff</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isCutoffSynthetic ? 'text-rose-400' : 'text-emerald-400'}`}>
              {spectralEnergyCutoffKhz.toFixed(1)} kHz
            </span>
          </div>

          <div className="w-full bg-slate-800/80 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCutoffSynthetic ? 'bg-rose-500 glow-red' : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(100, (spectralEnergyCutoffKhz / 16) * 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>Wideband Target: 15+ kHz</span>
            <span className={isCutoffSynthetic ? 'text-rose-300 font-semibold' : 'text-emerald-400'}>
              {isCutoffSynthetic ? '⚠️ Neural Vocoder Truncation' : '✓ Full Acoustic Bandwidth'}
            </span>
          </div>
        </div>

        {/* Metric 3: Micro-Pause Naturalness Score */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isPauseSynthetic
            ? 'bg-rose-950/30 border-rose-500/40'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wind className={`w-4 h-4 ${isPauseSynthetic ? 'text-rose-400' : 'text-emerald-400'}`} />
              <span className="text-xs font-bold text-slate-200">Micro-Pause Naturalness</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isPauseSynthetic ? 'text-rose-400' : 'text-emerald-400'}`}>
              {microPauseNaturalness}%
            </span>
          </div>

          <div className="w-full bg-slate-800/80 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPauseSynthetic ? 'bg-rose-500 glow-red' : 'bg-emerald-500'
              }`}
              style={{ width: `${microPauseNaturalness}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>Threshold: &gt; 70%</span>
            <span className={isPauseSynthetic ? 'text-rose-300 font-semibold' : 'text-emerald-400'}>
              {isPauseSynthetic ? '⚠️ Lacks Respiration Pauses' : '✓ Natural Lung Respiration'}
            </span>
          </div>
        </div>

        {/* Metric 4: Phase Coherence & Formant Anomaly */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          isPhaseSynthetic
            ? 'bg-rose-950/30 border-rose-500/40'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertOctagon className={`w-4 h-4 ${isPhaseSynthetic ? 'text-rose-400' : 'text-teal-400'}`} />
              <span className="text-xs font-bold text-slate-200">Phase Distortion Index</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isPhaseSynthetic ? 'text-rose-400' : 'text-emerald-400'}`}>
              {phaseCoherenceAnomaly}%
            </span>
          </div>

          <div className="w-full bg-slate-800/80 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPhaseSynthetic ? 'bg-rose-500 glow-red' : 'bg-teal-500'
              }`}
              style={{ width: `${phaseCoherenceAnomaly}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>Threshold: &lt; 30%</span>
            <span className={isPhaseSynthetic ? 'text-rose-300 font-semibold' : 'text-emerald-400'}>
              {isPhaseSynthetic ? '⚠️ Vocoder Phase Dispersion' : '✓ Glottal Pulse Coherence'}
            </span>
          </div>
        </div>

      </div>

      {/* Forensic Footnote */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
        <span className="font-mono text-slate-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Harmonic-to-Noise Ratio (HNR): <strong className="text-white">{harmonicToNoiseRatioDb.toFixed(1)} dB</strong>
        </span>
        <span className="font-mono text-slate-300">
          Formant Distortion: <strong className={formantDistortionScore > 50 ? 'text-rose-400' : 'text-emerald-400'}>{formantDistortionScore}%</strong>
        </span>
      </div>

    </div>
  );
};
