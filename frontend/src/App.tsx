import { useState, useEffect } from 'react';
import { 
  Shield, 
  PhoneCall, 
  PhoneOff, 
  Sparkles, 
  FileText, 
  Lock, 
  DollarSign, 
  HeartHandshake, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';
import { Header } from './components/common/Header';
import { AudioCanvas } from './components/visualizer/AudioCanvas';
import { RiskGauge } from './components/dashboard/RiskGauge';
import { AcousticAnomalyPanel } from './components/dashboard/AcousticAnomalyPanel';
import { BankingInterventionModal } from './components/mitigation/BankingInterventionModal';
import { JudgeConsole } from './components/judge/JudgeConsole';
import { ForensicReportModal } from './components/forensics/ForensicReportModal';
import { audioEngine } from './services/audioEngine';
import type { AcousticBreakdown, AudioSamplePreset, ThreatMetrics } from './types';

const initialMetrics: ThreatMetrics = {
  timestamp: Date.now(),
  syntheticProbability: 0.12,
  contextualRisk: 0.10,
  anomalyScore: 0.15,
  compositeRiskScore: 12.0,
  riskLevel: 'SAFE',
  actionRequired: 'ALLOW',
  confidence: 0.94,
  latencyMs: 22
};

const initialBreakdown: AcousticBreakdown = {
  pitchStabilityIndex: 0.44,
  spectralEnergyCutoffKhz: 15.6,
  microPauseNaturalness: 92,
  phaseCoherenceAnomaly: 14,
  harmonicToNoiseRatioDb: 16.2,
  detectedVocoder: 'None (Organic Glottal)',
  spectralRollOffPercentile: 91,
  formantDistortionScore: 12
};

export function App() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLiveMic, setIsLiveMic] = useState(false);
  const [activePreset, setActivePreset] = useState<AudioSamplePreset | null>(null);
  
  const [timeData, setTimeData] = useState<Uint8Array>(new Uint8Array(1024).fill(128));
  const [freqData, setFreqData] = useState<Uint8Array>(new Uint8Array(512));
  const [metrics, setMetrics] = useState<ThreatMetrics>(initialMetrics);
  const [breakdown, setBreakdown] = useState<AcousticBreakdown>(initialBreakdown);
  const [vadActive, setVadActive] = useState(false);
  const [volumeDb, setVolumeDb] = useState(-80);

  // Modals
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [hasTriggeredCriticalModal, setHasTriggeredCriticalModal] = useState(false);

  // Subscribe to Audio Engine Events
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe(
      (newTimeData, newFreqData, newMetrics, newBreakdown, isVad, volDb) => {
        setTimeData(new Uint8Array(newTimeData));
        setFreqData(new Uint8Array(newFreqData));
        setMetrics(newMetrics);
        setBreakdown(newBreakdown);
        setVadActive(isVad);
        setVolumeDb(volDb);

        // Auto-trigger mitigation modal on critical threat once per session/sample
        if (newMetrics.riskLevel === 'CRITICAL' && !hasTriggeredCriticalModal) {
          setIsInterventionModalOpen(true);
          setHasTriggeredCriticalModal(true);
        }
      }
    );

    return () => {
      unsubscribe();
      audioEngine.stopCurrentAudio();
    };
  }, [hasTriggeredCriticalModal]);

  // Audio Handlers
  const handleStartLiveMic = async () => {
    try {
      setHasTriggeredCriticalModal(false);
      await audioEngine.startLiveMicrophone();
      setIsStreaming(true);
      setIsLiveMic(true);
      setActivePreset(null);
    } catch (err) {
      alert('Could not access microphone. Please ensure microphone permissions are allowed.');
    }
  };

  const handlePlayPreset = async (preset: AudioSamplePreset) => {
    try {
      setHasTriggeredCriticalModal(false);
      await audioEngine.playPresetSample(preset);
      setIsStreaming(true);
      setIsLiveMic(false);
      setActivePreset(preset);
    } catch (err) {
      console.error('Error playing sample preset:', err);
    }
  };

  const handleStopAudio = () => {
    audioEngine.stopCurrentAudio();
    setIsStreaming(false);
    setIsLiveMic(false);
    setActivePreset(null);
    setVadActive(false);
    setVolumeDb(-80);
  };

  const handleUploadFile = async (file: File) => {
    try {
      setHasTriggeredCriticalModal(false);
      await audioEngine.playCustomAudioFile(file);
      setIsStreaming(true);
      setIsLiveMic(false);
      setActivePreset(audioEngine.getCurrentPreset());
    } catch (err) {
      alert('Error decoding audio file. Please try a valid .wav or .mp3 file.');
    }
  };

  const handleContextChange = (unverifiedGateway: boolean, highAmount: boolean, callerAnomalous: boolean) => {
    audioEngine.setContextModifiers(unverifiedGateway, highAmount, callerAnomalous);
  };

  const handleKillswitchAudio = () => {
    handleStopAudio();
    setIsInterventionModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Header */}
      <Header
        riskLevel={metrics.riskLevel}
        isStreaming={isStreaming}
        isLiveMic={isLiveMic}
        currentTitle={activePreset?.title}
        onOpenReport={() => setIsReportModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-5 space-y-5">
        
        {/* Active Call / Live Authorization Simulation Banner */}
        <div className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          metrics.riskLevel === 'CRITICAL'
            ? 'bg-rose-950/40 border-rose-500/50 glow-red'
            : metrics.riskLevel === 'SUSPICIOUS'
            ? 'bg-amber-950/40 border-amber-500/50 glow-amber'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              metrics.riskLevel === 'CRITICAL'
                ? 'bg-rose-500 text-white animate-bounce'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}>
              {isStreaming ? <PhoneCall className="w-5 h-5 animate-pulse" /> : <PhoneOff className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  {isStreaming ? 'LIVE CALL STREAM INGESTION' : 'VOICE STREAM STANDBY'}
                </span>
                {isStreaming && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Active Channel
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {isLiveMic
                  ? 'Active User Microphone (Live Acoustic Capture)'
                  : activePreset
                  ? activePreset.title
                  : 'Ready for Audio Ingestion — Select a Preset or Start Microphone'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {metrics.riskLevel === 'CRITICAL' && (
              <button
                onClick={() => setIsInterventionModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg animate-pulse flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Fraud Intercept Active ({metrics.compositeRiskScore}%)</span>
              </button>
            )}

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Forensic Audit</span>
            </button>
          </div>
        </div>

        {/* Core Analysis Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: 60 FPS Real-Time Signal Canvas */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <AudioCanvas
              timeData={timeData}
              freqData={freqData}
              isStreaming={isStreaming}
              vadActive={vadActive}
              volumeDb={volumeDb}
              riskLevel={metrics.riskLevel}
              vocoderCutoffKhz={breakdown.spectralEnergyCutoffKhz}
            />

            <AcousticAnomalyPanel
              breakdown={breakdown}
              isStreaming={isStreaming}
            />
          </div>

          {/* Right Column: Dynamic Threat Risk Gauge & FinTech Interceptor */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <RiskGauge
              metrics={metrics}
              onTriggerMitigation={() => setIsInterventionModalOpen(true)}
            />

            <div className="glass-panel rounded-2xl p-4 lg:p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  FinTech Wire Transfer Interceptor
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
                  Sub-500ms Killswitch
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Transfer Amount:</span>
                  <span className="font-mono font-bold text-white">
                    ₹{(activePreset?.transactionAmount || 250000).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Claimed Authorized Caller:</span>
                  <span className="text-slate-200 truncate max-w-[180px]">
                    {activePreset?.callerName || 'Account Holder'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deepfake Threshold:</span>
                  <span className="font-mono text-rose-400 font-bold">&gt; 75% Risk (Auto-Freeze)</span>
                </div>
              </div>

              <button
                onClick={() => setIsInterventionModalOpen(true)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulate Wire Transfer Intervention Modal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Judge & Evaluation Control Console */}
        <JudgeConsole
          isStreaming={isStreaming}
          isLiveMic={isLiveMic}
          activePresetId={activePreset?.id}
          onStartLiveMic={handleStartLiveMic}
          onPlayPreset={handlePlayPreset}
          onStopAudio={handleStopAudio}
          onUploadFile={handleUploadFile}
          onContextChange={handleContextChange}
        />

        {/* 4 Pillars of Hackathon Scoring Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase font-mono">
              <HeartHandshake className="w-4 h-4" />
              <span>1. Social Benefit</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Defends citizens, senior citizens, and enterprise workers against voice cloning extortion calls, CEO fraud, and fake emergency money transfers.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase font-mono">
              <Zap className="w-4 h-4" />
              <span>2. Technical Feasibility</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Solves high latency via a 4-second sliding window ring buffer with sub-50ms response time, streaming updates seamlessly to UI at 60 FPS.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase font-mono">
              <DollarSign className="w-4 h-4" />
              <span>3. Economic Affordability</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Eliminates expensive cloud GPU infrastructure (<strong className="text-white">₹0.00 cloud compute</strong>) by executing quantized ONNX INT8 models locally on client CPUs.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase font-mono">
              <Lock className="w-4 h-4" />
              <span>4. DPDP Act 2023</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ephemeral in-memory circular ring buffering with zero persistent audio disk logging guarantees 100% compliance with Section 6 of DPDP Act 2023.
            </p>
          </div>

        </div>

      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-4 px-4 text-center text-xs text-slate-500 font-mono mt-8">
        VaniRakshak (वाणी रक्षक) • AI Voice Deepfake Defense & Dynamic Fraud Interception System • Built for Real-Time Edge Protection
      </footer>

      {/* Banking Mitigation Interception Overlay Modal */}
      <BankingInterventionModal
        isOpen={isInterventionModalOpen}
        onClose={() => setIsInterventionModalOpen(false)}
        metrics={metrics}
        transferData={{
          amount: activePreset?.transactionAmount || 250000,
          requestedByCaller: activePreset?.callerName || 'Aarav Sharma (Grandson Impersonation)',
          recipientName: 'Overseas Mule Account #4091'
        }}
        onKillswitchAudio={handleKillswitchAudio}
      />

      {/* Forensic Report Modal */}
      <ForensicReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        metrics={metrics}
        breakdown={breakdown}
        activeSource={isLiveMic ? 'Live Microphone Stream' : (activePreset?.title || 'System Standby')}
      />

    </div>
  );
}

export default App;
