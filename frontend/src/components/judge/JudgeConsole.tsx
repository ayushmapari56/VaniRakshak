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
    <div className="bg-white rounded-2xl p-4 lg:p-6 border border-slate-200 shadow-sm flex flex-col gap-5">
      
      {/* Top Bar with Hackathon Judging Criteria Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Judge & Evaluator Demonstration Console
              </h3>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                Hackathon Deck
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Interactive test suite for live microphone, synthetic voice benchmarks, regional accents, and DPDP compliance
            </p>
          </div>
        </div>

        {/* Global Action: Live Mic / Stop */}
        <div className="flex items-center gap-2.5">
          {isStreaming ? (
            <button
              onClick={onStopAudio}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Current Stream</span>
            </button>
          ) : (
            <button
              onClick={onStartLiveMic}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>Start Live Mic Test</span>
            </button>
          )}

          {/* Upload Button */}
          <label className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-blue-600" />
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
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'presets'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Preset Voice Scenarios ({AUDIO_SAMPLE_PRESETS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('accents')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'accents'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Indian Regional Accent Matrix (6)</span>
        </button>

        <button
          onClick={() => setActiveTab('context')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'context'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Context Risk Modifiers ($C_{'{context}'}$)</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all light-card-hover ${
                  isPlaying
                    ? 'bg-blue-50/60 border-blue-300 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isSynthetic 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isSynthetic ? 'SYNTHETIC CLONE' : 'ORGANIC HUMAN'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                      {preset.codec}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1 font-display">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {preset.scenarioDescription}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-500">
                    Expected: <span className={isSynthetic ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {preset.expectedRisk}% Risk
                    </span>
                  </div>

                  <button
                    onClick={() => onPlayPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isPlaying
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current text-blue-600" />}
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
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Acoustic Accent Invariance Proof</strong>: VaniRakshak’s RawTFNet model is fine-tuned on the AI4Bharat Kathbath dataset. It separates linguistic accent phonemes from unnatural neural vocoder glottal phase anomalies, maintaining <strong className="text-emerald-700">&gt;98.5% invariance accuracy</strong> across major Indian language families.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {REGIONAL_ACCENTS.map((accent) => {
              const isSelected = selectedAccent.id === accent.id;
              return (
                <div
                  key={accent.id}
                  onClick={() => setSelectedAccent(accent)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all light-card-hover ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 font-display">{accent.name}</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                      {accent.invarianceScore}% Invariance
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2">{accent.region}</div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 italic font-sans">
                    "{accent.samplePhrase}"
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-slate-500 flex justify-between">
                    <span>Fundamental Pitch:</span>
                    <span className="text-slate-800 font-semibold">{accent.typicalPitchRangeHz}</span>
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
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            Configure live contextual parameters ($C_{'{context}'}$) incorporated into the dynamic risk scoring formula:
            <code className="text-blue-700 font-bold block mt-1 font-mono text-[11px]">
              S_risk(t) = 0.60·P_synth(t) + 0.25·C_context + 0.15·A_anomaly
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div
              onClick={handleToggleGateway}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 light-card-hover ${
                unverifiedGateway
                  ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-500/20'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className={`p-2 rounded-xl ${unverifiedGateway ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Unverified VoIP Trunk Gateway</h4>
                  <span className="text-[10px] font-mono text-rose-600 font-bold">+45% C_factor</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Caller ID spoofing or unverified international SIP gateway origin.
                </p>
                <div className="mt-2 text-[10px] font-mono font-bold text-slate-700">
                  Status: {unverifiedGateway ? '🔴 ACTIVE THREAT' : '⚪ Verified Operator'}
                </div>
              </div>
            </div>

            <div
              onClick={handleToggleAmount}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 light-card-hover ${
                highAmount
                  ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-500/20'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className={`p-2 rounded-xl ${highAmount ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">High Value Wire Transfer (₹1L+)</h4>
                  <span className="text-[10px] font-mono text-amber-600 font-bold">+30% C_factor</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Instant RTGS/NEFT payment request exceeding standard limits.
                </p>
                <div className="mt-2 text-[10px] font-mono font-bold text-slate-700">
                  Status: {highAmount ? '🟡 HIGH TRANSACTION' : '⚪ Standard Amount'}
                </div>
              </div>
            </div>

            <div
              onClick={handleToggleCaller}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 light-card-hover ${
                callerAnomalous
                  ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className={`p-2 rounded-xl ${callerAnomalous ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Speaker Baseline Variance</h4>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold">+20% A_factor</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Historical vocal fold resonance mismatch against registered customer profile.
                </p>
                <div className="mt-2 text-[10px] font-mono font-bold text-slate-700">
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
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-bold uppercase font-mono text-xs">
              <Cpu className="w-4 h-4" />
              <span>Edge-First ONNX WASM Execution</span>
            </div>

            <div className="space-y-2 text-slate-700 leading-relaxed">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Model Footprint:</span>
                <span className="font-mono font-bold text-slate-900">RawTFNet INT8 Quantized (14.2 MB)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Inference Runtime:</span>
                <span className="font-mono font-bold text-emerald-700">ONNX-Web / SIMD WebAssembly</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Cloud Compute Cost:</span>
                <span className="font-mono font-bold text-emerald-700">₹0.00 / call (Zero Cloud GPU)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">End-to-End Latency:</span>
                <span className="font-mono font-bold text-blue-700">&lt; 25 ms per 4-sec frame</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold uppercase font-mono text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>India DPDP Act 2023 Section 6 Compliance</span>
            </div>

            <div className="space-y-2 text-slate-700 leading-relaxed">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Audio Persistence:</span>
                <span className="font-mono font-bold text-emerald-700">0 Bytes Disk Writes (Ephemeral RAM)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Buffer Overwrite Window:</span>
                <span className="font-mono font-bold text-slate-900">2,000 ms Overlap Flush</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Voice Data Privacy:</span>
                <span className="font-mono font-bold text-emerald-700">100% On-Device (Never leaves browser)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Regulatory Audit:</span>
                <span className="font-mono font-bold text-blue-700">SHA-256 Ephemeral Token Verification</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
