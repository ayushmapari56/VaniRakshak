import { useState, useEffect } from 'react';
import { 
  Shield, 
  PhoneCall, 
  PhoneOff, 
  Sparkles, 
  AlertTriangle,
  Square,
  Mic
} from 'lucide-react';
import { LandingPage } from './components/landing/LandingPage';
import { Header } from './components/common/Header';
import { AudioCanvas } from './components/visualizer/AudioCanvas';
import { RiskGauge } from './components/dashboard/RiskGauge';
import { AcousticAnomalyPanel } from './components/dashboard/AcousticAnomalyPanel';
import { BankingInterventionModal } from './components/mitigation/BankingInterventionModal';
import { JudgeConsole } from './components/judge/JudgeConsole';
import { ForensicReportModal } from './components/forensics/ForensicReportModal';
import { audioEngine } from './services/audioEngine';
import { smoothScroll } from './services/smoothScroll';
import { AUDIO_SAMPLE_PRESETS } from './data/presets';
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
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

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

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    smoothScroll.init();
    return () => {
      smoothScroll.destroy();
    };
  }, []);

  // Reset scroll on view switch
  useEffect(() => {
    smoothScroll.scrollTo(0, { immediate: true });
  }, [currentView]);

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

        // Auto-trigger mitigation modal on critical threat
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
      console.error('Failed to start live mic:', err);
    }
  };

  const handlePlayPreset = async (preset: AudioSamplePreset) => {
    try {
      setHasTriggeredCriticalModal(false);
      setActivePreset(preset);
      setIsLiveMic(false);
      setIsStreaming(true);
      await audioEngine.playPresetSample(preset);
    } catch (err) {
      console.error('Failed to play preset:', err);
    }
  };

  const handleStopAudio = () => {
    audioEngine.stopCurrentAudio();
    setIsStreaming(false);
    setIsLiveMic(false);
    setActivePreset(null);
    setVadActive(false);
  };

  const handleUploadFile = async (file: File) => {
    try {
      setHasTriggeredCriticalModal(false);
      setIsLiveMic(false);
      setActivePreset({
        id: 'uploaded-file',
        title: `Upload: ${file.name}`,
        subtitle: 'Custom Uploaded File',
        category: 'deepfake_scam',
        language: 'Custom',
        accent: 'Detected Audio',
        provider: 'Uploaded File Ingestion',
        expectedRisk: 88,
        scenarioDescription: 'Uploaded audio file analysis for forensic deepfake verification.',
        callerName: 'Uploaded Audio Stream',
        transactionAmount: 150000,
        codec: '16kHz PCM',
        audioDurationSec: 10
      });
      setIsStreaming(true);
      await audioEngine.playCustomAudioFile(file);
    } catch (err) {
      console.error('Failed to process uploaded file:', err);
    }
  };

  const handleContextChange = (unverifiedGateway: boolean, highAmount: boolean, callerAnomalous: boolean) => {
    audioEngine.setContextModifiers(unverifiedGateway, highAmount, callerAnomalous);
  };

  const handleKillswitchAudio = () => {
    handleStopAudio();
    setIsInterventionModalOpen(false);
  };

  // If in landing page view, render LandingPage
  if (currentView === 'landing') {
    return (
      <LandingPage
        onStart={() => {
          setCurrentView('dashboard');
          smoothScroll.scrollTo(0, { immediate: true });
        }}
      />
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-body selection:bg-blue-500/20 selection:text-blue-900">
      
      {/* 1. Top Header Navigation */}
      <Header
        riskLevel={metrics.riskLevel}
        isStreaming={isStreaming}
        isLiveMic={isLiveMic}
        currentTitle={activePreset?.title}
        onOpenReport={() => setIsReportModalOpen(true)}
        onBackToLanding={() => {
          handleStopAudio();
          setCurrentView('landing');
          smoothScroll.scrollTo(0, { immediate: true });
        }}
      />

      {/* 2. Main Dashboard Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Quick Command & Active Voice Channel Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Active Audio Channel State */}
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shadow-xs ${
              metrics.riskLevel === 'CRITICAL'
                ? 'bg-rose-600 text-white animate-bounce'
                : isStreaming
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {isStreaming ? <PhoneCall className="w-5 h-5 animate-pulse" /> : <PhoneOff className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500">
                  {isStreaming ? 'ACTIVE CALL STREAM INGESTION' : 'VOICE STREAM STANDBY'}
                </span>
                {isStreaming && (
                  <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-ping" />
                    Live Channel
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading mt-0.5">
                {isLiveMic
                  ? 'User Microphone (Live Acoustic Capture)'
                  : activePreset
                  ? activePreset.title
                  : 'Ready for Audio Ingestion — Click a scenario preset or start microphone'}
              </h2>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isStreaming ? (
              <button
                onClick={handleStopAudio}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Stream</span>
              </button>
            ) : (
              <button
                onClick={handleStartLiveMic}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Start Live Mic</span>
              </button>
            )}

            {/* Quick One-Click Presets */}
            {!isStreaming && (
              <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <button
                  onClick={() => handlePlayPreset(AUDIO_SAMPLE_PRESETS[0])}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold font-mono transition-colors cursor-pointer"
                >
                  ⚡ Senior Extortion (Cloned)
                </button>
                <button
                  onClick={() => handlePlayPreset(AUDIO_SAMPLE_PRESETS[1])}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono transition-colors cursor-pointer"
                >
                  ✓ Organic Hindi
                </button>
              </div>
            )}

            {metrics.riskLevel === 'CRITICAL' && (
              <button
                onClick={() => setIsInterventionModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md animate-pulse flex items-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Fraud Killswitch ({metrics.compositeRiskScore}%)</span>
              </button>
            )}
          </div>

        </div>

        {/* 3. Core Analysis Dashboard Grid: Left Audio Spectrum & Right Risk Gauge + Wire Interceptor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): 60 FPS Audio Visualizer Canvas + Acoustic Anomaly Breakdown */}
          <div className="lg:col-span-7 flex flex-col gap-6">
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

          {/* Right Column (5 cols): Dynamic Bayesian Risk Gauge & FinTech Wire Interceptor */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <RiskGauge
              metrics={metrics}
              onTriggerMitigation={() => setIsInterventionModalOpen(true)}
            />

            {/* FinTech Wire Transfer Interceptor Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase font-heading flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  FinTech Wire Transfer Interceptor
                </span>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md font-bold">
                  Sub-500ms Killswitch
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5 font-body">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Target Transfer Amount:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ₹{(activePreset?.transactionAmount || 250000).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Claimed Authorized Caller:</span>
                  <span className="text-slate-800 font-semibold truncate max-w-[180px]">
                    {activePreset?.callerName || 'Account Holder'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Deepfake Auto-Freeze Threshold:</span>
                  <span className="font-mono text-rose-600 font-bold">&gt; 75% Composite Risk</span>
                </div>
              </div>

              <button
                onClick={() => setIsInterventionModalOpen(true)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer font-body"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Simulate Wire Transfer Intervention Modal</span>
              </button>
            </div>

          </div>

        </div>

        {/* 4. Evaluator & Demonstration Suite (Tabs for Presets, Accents, Context, Architecture) */}
        <JudgeConsole
          isStreaming={isStreaming}
          isLiveMic={isLiveMic}
          activePresetId={activePreset?.id}
          metrics={metrics}
          onStartLiveMic={handleStartLiveMic}
          onPlayPreset={handlePlayPreset}
          onStopAudio={handleStopAudio}
          onUploadFile={handleUploadFile}
          onContextChange={handleContextChange}
        />

      </main>

      {/* 5. Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500 font-mono mt-8">
        VaniRakshak (वाणी रक्षक) • Real-Time AI Voice Deepfake Defense & Dynamic Fraud Interception System • DPDP Act 2023 Sec 6 Compliant
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
