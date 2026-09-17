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
    <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase font-display tracking-wide">
              Acoustic Artifact Breakdown
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Sub-Band DSP Extraction & Neural Vocoder Fingerprinting
            </p>
          </div>
        </div>

        {/* Neural Vocoder Fingerprint Badge */}
        <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border flex items-center gap-1.5 ${
          detectedVocoder !== 'None (Organic Glottal)'
            ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
            : 'bg-emerald-50 border-emerald-300 text-emerald-700'
        }`}>
          <Cpu className="w-3.5 h-3.5" />
          <span>Vocoder: {detectedVocoder}</span>
        </div>
      </div>

      {/* 4 Technical Diagnostic Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Metric 1: Pitch Variation Stability Index (PVSI) */}
        <div className={`p-4 rounded-xl border transition-all ${
          isPitchSynthetic
            ? 'bg-rose-50/40 border-rose-200'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Waves className={`w-4 h-4 ${isPitchSynthetic ? 'text-rose-600' : 'text-blue-600'}`} />
              <span className="text-xs font-bold text-slate-800">Pitch Stability (PVSI)</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isPitchSynthetic ? 'text-rose-700' : 'text-emerald-700'}`}>
              {pitchStabilityIndex.toFixed(2)}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPitchSynthetic ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, pitchStabilityIndex * 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>Target: 0.35 - 0.65</span>
            <span className={isPitchSynthetic ? 'text-rose-700 font-bold' : 'text-emerald-700 font-semibold'}>
              {isPitchSynthetic ? '⚠️ Robotic Constancy' : '✓ Dynamic Human Prosody'}
            </span>
          </div>
        </div>

        {/* Metric 2: Spectral Energy Cutoff Frequency */}
        <div className={`p-4 rounded-xl border transition-all ${
          isCutoffSynthetic
            ? 'bg-rose-50/40 border-rose-200'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Disc className={`w-4 h-4 ${isCutoffSynthetic ? 'text-rose-600' : 'text-blue-600'}`} />
              <span className="text-xs font-bold text-slate-800">Spectral Energy Cutoff</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isCutoffSynthetic ? 'text-rose-700' : 'text-emerald-700'}`}>
              {spectralEnergyCutoffKhz.toFixed(1)} kHz
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCutoffSynthetic ? 'bg-rose-600' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, (spectralEnergyCutoffKhz / 16) * 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>Wideband: 15+ kHz</span>
            <span className={isCutoffSynthetic ? 'text-rose-700 font-bold' : 'text-emerald-700 font-semibold'}>
              {isCutoffSynthetic ? '⚠️ Vocoder Truncation' : '✓ Full Bandwidth (16 kHz)'}
            </span>
          </div>
        </div>

        {/* Metric 3: Micro-Pause Naturalness Score */}
        <div className={`p-4 rounded-xl border transition-all ${
          isPauseSynthetic
            ? 'bg-rose-50/40 border-rose-200'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wind className={`w-4 h-4 ${isPauseSynthetic ? 'text-rose-600' : 'text-emerald-600'}`} />
              <span className="text-xs font-bold text-slate-800">Micro-Pause Naturalness</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isPauseSynthetic ? 'text-rose-700' : 'text-emerald-700'}`}>
              {microPauseNaturalness}%
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPauseSynthetic ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
              style={{ width: `${microPauseNaturalness}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>Threshold: &gt; 70%</span>
            <span className={isPauseSynthetic ? 'text-rose-700 font-bold' : 'text-emerald-700 font-semibold'}>
              {isPauseSynthetic ? '⚠️ Lacks Respiration' : '✓ Natural Respiration Pauses'}
            </span>
          </div>
        </div>

        {/* Metric 4: Phase Coherence & Formant Anomaly */}
        <div className={`p-4 rounded-xl border transition-all ${
          isPhaseSynthetic
            ? 'bg-rose-50/40 border-rose-200'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertOctagon className={`w-4 h-4 ${isPhaseSynthetic ? 'text-rose-600' : 'text-teal-600'}`} />
              <span className="text-xs font-bold text-slate-800">Phase Distortion Index</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isPhaseSynthetic ? 'text-rose-700' : 'text-emerald-700'}`}>
              {phaseCoherenceAnomaly}%
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPhaseSynthetic ? 'bg-rose-600' : 'bg-teal-600'
              }`}
              style={{ width: `${phaseCoherenceAnomaly}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>Threshold: &lt; 30%</span>
            <span className={isPhaseSynthetic ? 'text-rose-700 font-bold' : 'text-emerald-700 font-semibold'}>
              {isPhaseSynthetic ? '⚠️ Phase Dispersion' : '✓ Glottal Pulse Coherence'}
            </span>
          </div>
        </div>

      </div>

      {/* Forensic Footnote */}
      <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Harmonic-to-Noise Ratio (HNR): <strong className="text-slate-900">{harmonicToNoiseRatioDb.toFixed(1)} dB</strong>
        </span>
        <span>
          Formant Distortion: <strong className={formantDistortionScore > 50 ? 'text-rose-700' : 'text-emerald-700'}>{formantDistortionScore}%</strong>
        </span>
      </div>

    </div>
  );
};
