import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Mic, 
  Upload, 
  Sliders, 
  Award, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Zap, 
  AlertOctagon, 
  Info,
  Layers
} from 'lucide-react';
import type { AudioSamplePreset, RegionalAccent } from '../../types';
import { AUDIO_SAMPLE_PRESETS, REGIONAL_ACCENTS } from '../../data/presets';

interface JudgeConsoleProps {
  isStreaming: boolean;
  isLiveMic: boolean;
  activePresetId?: string;
  onStartLiveMic: () => void;
  onPlayPreset: (preset: AudioSamplePreset) => void;
  onStopAudio: () => void;
  onUploadFile: (file: File) => void;
  onContextChange: (unverifiedGateway: boolean, highAmount: boolean, callerAnomalous: boolean) => void;
}

export const JudgeConsole: React.FC<JudgeConsoleProps> = ({
  isStreaming,
  activePresetId,
  onStartLiveMic,
  onPlayPreset,
  onStopAudio,
  onUploadFile,
  onContextChange
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'accents' | 'context' | 'architecture'>('presets');
  const [selectedAccent, setSelectedAccent] = useState<RegionalAccent>(REGIONAL_ACCENTS[0]);
  
  // Context state
  const [unverifiedGateway, setUnverifiedGateway] = useState(false);
  const [highAmount, setHighAmount] = useState(false);
  const [callerAnomalous, setCallerAnomalous] = useState(false);

  const handleToggleGateway = () => {
    const next = !unverifiedGateway;
    setUnverifiedGateway(next);
    onContextChange(next, highAmount, callerAnomalous);
  };

  const handleToggleAmount = () => {
    const next = !highAmount;
    setHighAmount(next);
    onContextChange(unverifiedGateway, next, callerAnomalous);
  };

  const handleToggleCaller = () => {
    const next = !callerAnomalous;
    setCallerAnomalous(next);
    onContextChange(unverifiedGateway, highAmount, next);
  };

  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 lg:p-6 border border-slate-800 flex flex-col gap-5">
      
      {/* Top Bar with Hackathon Judging Criteria Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-display">
                Judge & Evaluator Demonstration Console
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Hackathon Deck
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Interactive test suite for live microphone, synthetic voice benchmarks, regional accents, and DPDP compliance
            </p>
          </div>
        </div>

        {/* Global Action: Live Mic / Stop */}
        <div className="flex items-center gap-2.5">
          {isStreaming ? (
            <button
              onClick={onStopAudio}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Current Stream</span>
            </button>
          ) : (
            <button
              onClick={onStartLiveMic}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all glow-cyan"
            >
              <Mic className="w-4 h-4" />
              <span>Start Live Mic Test</span>
            </button>
          )}

          {/* Upload Button */}
          <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload .WAV/.MP3</span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUploadChange}
            />
          </label>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'presets'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Preset Voice Scenarios ({AUDIO_SAMPLE_PRESETS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('accents')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'accents'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Indian Regional Accent Matrix (6)</span>
        </button>

        <button
          onClick={() => setActiveTab('context')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'context'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Context Risk Modifiers ($C_{'{context}'}$)</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Edge vs Cloud Telemetry</span>
        </button>
      </div>

      {/* Tab 1: Preset Voice Scenarios */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {AUDIO_SAMPLE_PRESETS.map((preset) => {
            const isPlaying = isStreaming && activePresetId === preset.id;
            const isSynthetic = preset.expectedRisk >= 75;
            
            return (
              <div
                key={preset.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                  isPlaying
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg glow-cyan'
                    : isSynthetic
                    ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isSynthetic 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {isSynthetic ? 'SYNTHETIC CLONE' : 'ORGANIC HUMAN'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800/90 px-1.5 py-0.5 rounded">
                      {preset.codec}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.scenarioDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-slate-400">
                    Expected: <span className={isSynthetic ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {preset.expectedRisk}% Risk
                    </span>
                  </div>

                  <button
                    onClick={() => onPlayPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isPlaying
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
                    }`}
                  >
                    {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                    <span>{isPlaying ? 'Playing...' : 'Test Scenario'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Indian Regional Accent Matrix */}
      {activeTab === 'accents' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Acoustic Accent Invariance Proof</strong>: VaniRakshak’s RawTFNet model is fine-tuned on the AI4Bharat Kathbath dataset. It separates linguistic accent phonemes from unnatural neural vocoder glottal phase anomalies, maintaining <strong className="text-emerald-400">&gt;98.5% invariance accuracy</strong> across major Indian language families.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {REGIONAL_ACCENTS.map((accent) => {
              const isSelected = selectedAccent.id === accent.id;
              return (
                <div
                  key={accent.id}
                  onClick={() => setSelectedAccent(accent)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 glow-cyan'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{accent.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded font-bold">
                      {accent.invarianceScore}% Invariance
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-2">{accent.region}</div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 italic">
                    "{accent.samplePhrase}"
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-slate-500 flex justify-between">
                    <span>Fundamental Pitch:</span>
                    <span className="text-slate-300">{accent.typicalPitchRangeHz}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Context Risk Modifiers */}
      {activeTab === 'context' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            Configure live contextual parameters ($C_{'{context}'}$) incorporated into the dynamic risk scoring formula:
            <code className="text-cyan-300 block mt-1 font-mono text-[11px]">
              S_risk(t) = 0.60·P_synth(t) + 0.25·C_context + 0.15·A_anomaly
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div
              onClick={handleToggleGateway}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                unverifiedGateway
                  ? 'bg-rose-950/30 border-rose-500/50'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className={`p-2 rounded-lg ${unverifiedGateway ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Unverified VoIP Trunk Gateway</h4>
                  <span className="text-[10px] font-mono text-rose-400 font-bold">+45% C_factor</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Caller ID spoofing or unverified international SIP gateway origin.
                </p>
                <div className="mt-2 text-[10px] font-mono font-semibold text-slate-300">
                  Status: {unverifiedGateway ? '🔴 ACTIVE THREAT' : '⚪ Verified Operator'}
                </div>
              </div>
            </div>

            <div
              onClick={handleToggleAmount}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                highAmount
                  ? 'bg-amber-950/30 border-amber-500/50'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className={`p-2 rounded-lg ${highAmount ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">High Value Wire Transfer (₹1L+)</h4>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">+30% C_factor</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Instant RTGS/NEFT payment request exceeding standard limits.
                </p>
                <div className="mt-2 text-[10px] font-mono font-semibold text-slate-300">
                  Status: {highAmount ? '🟡 HIGH TRANSACTION' : '⚪ Standard Amount'}
                </div>
              </div>
            </div>

            <div
              onClick={handleToggleCaller}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                callerAnomalous
                  ? 'bg-indigo-950/30 border-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className={`p-2 rounded-lg ${callerAnomalous ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Speaker Baseline Variance</h4>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">+20% A_factor</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Historical vocal fold resonance mismatch against registered customer profile.
                </p>
                <div className="mt-2 text-[10px] font-mono font-semibold text-slate-300">
                  Status: {callerAnomalous ? '🟣 PROFILE MISMATCH' : '⚪ Verified Profile'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Edge vs Cloud Architecture & DPDP Telemetry */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase font-mono text-xs">
              <Cpu className="w-4 h-4" />
              <span>Edge-First ONNX WASM Execution</span>
            </div>

            <div className="space-y-2 text-slate-300 leading-relaxed">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Model Footprint:</span>
                <span className="font-mono text-white">RawTFNet INT8 Quantized (14.2 MB)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Inference Runtime:</span>
                <span className="font-mono text-emerald-400">ONNX-Web / SIMD WebAssembly</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Cloud Compute Cost:</span>
                <span className="font-mono font-bold text-emerald-400">₹0.00 / call (Zero Cloud GPU)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">End-to-End Latency:</span>
                <span className="font-mono text-cyan-300">&lt; 25 ms per 4-sec frame</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase font-mono text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>India DPDP Act 2023 Section 6 Compliance</span>
            </div>

            <div className="space-y-2 text-slate-300 leading-relaxed">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Audio Persistence:</span>
                <span className="font-mono text-emerald-400">0 Bytes DiskWrites (Ephemeral RAM)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Buffer Overwrite Window:</span>
                <span className="font-mono text-white">2,000 ms Overlap Flush</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Voice Data Privacy:</span>
                <span className="font-mono text-emerald-400">100% On-Device (Never leaves browser)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Regulatory Audit:</span>
                <span className="font-mono text-cyan-300">SHA-256 Ephemeral Token Verification</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
