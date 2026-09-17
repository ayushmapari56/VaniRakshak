import React from 'react';
import { 
  Shield, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Globe, 
  Zap, 
  Play, 
  DollarSign, 
  Layers, 
  AlertTriangle,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';
import { HeroSection } from './HeroSection';
import { REGIONAL_ACCENTS } from '../../data/presets';
import { smoothScroll } from '../../services/smoothScroll';

interface LandingPageProps {
  onStart: () => void;
  onSelectPresetAndStart?: (presetId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const scrollToSection = (sectionId: string) => {
    smoothScroll.scrollTo(`#${sectionId}`, { offset: -70, duration: 1.4 });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-body selection:bg-blue-500/20 selection:text-blue-900">
      
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => smoothScroll.scrollTo(0, { duration: 1.2 })}>
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-md flex items-center justify-center p-0.5">
              <img src="/logo.png" alt="VaniRakshak Logo" className="w-full h-full object-contain" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold font-heading tracking-tight text-slate-900">
                  VaniRakshak
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-orange-50 text-orange-700 border border-orange-200 font-body">
                  वाणी रक्षक
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium font-body tracking-wide">Real-Time AI Voice Deepfake Defense</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 font-body">
            <button onClick={() => scrollToSection('features')} className="hover:text-orange-600 transition-colors cursor-pointer">
              Features
            </button>
            <button onClick={() => scrollToSection('pipeline')} className="hover:text-orange-600 transition-colors cursor-pointer">
              Architecture
            </button>
            <button onClick={() => scrollToSection('accents')} className="hover:text-orange-600 transition-colors cursor-pointer">
              Indian Languages
            </button>
            <button onClick={() => scrollToSection('compliance')} className="hover:text-orange-600 transition-colors cursor-pointer">
              DPDP Compliance
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('features')}
              className="hidden sm:inline-flex px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors font-body cursor-pointer"
            >
              Explore More
            </button>

            <button
              onClick={onStart}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center gap-2 transition-all transform active:scale-95 font-body cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Let's Start</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. Hero Section with User's Image */}
      <HeroSection 
        onStart={onStart}
        onExplore={() => scrollToSection('live-preview')}
      />

      {/* 3. Live KPI Stats & Interactive Interception Mockup Section (id="live-preview") */}
      <section id="live-preview" className="py-16 bg-white border-b border-slate-100 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 4 Quick Stat Pills with Space Grotesk Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14 font-body">
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/90 text-left shadow-xs light-card-hover">
              <div className="text-3xl font-extrabold font-body text-emerald-600">₹0.00</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Cloud Compute Cost / Call</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">100% Client-Side ONNX</div>
            </div>
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/90 text-left shadow-xs light-card-hover">
              <div className="text-3xl font-extrabold font-body text-blue-600">&lt; 50 ms</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Edge Inference Latency</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">4s Buffer / 50% Overlap</div>
            </div>
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/90 text-left shadow-xs light-card-hover">
              <div className="text-3xl font-extrabold font-body text-indigo-600">99.4%</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Accent Invariance</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">AI4Bharat Kathbath Trained</div>
            </div>
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/90 text-left shadow-xs light-card-hover">
              <div className="text-3xl font-extrabold font-body text-slate-900">100%</div>
              <div className="text-xs text-slate-600 font-medium mt-1">DPDP Act Compliant</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Section 6 Ephemeral RAM</div>
            </div>
          </div>

          {/* Interactive Live Call Interception Showcase */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
            
            {/* Ambient background blur */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>LIVE THREAT INTERCEPTION</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  Senior Citizen Extortion Call Suspended in Real Time
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed font-body">
                  Scammer using ElevenLabs neural voice cloning attempted to impersonate a grandson in distress requesting ₹1,80,000 emergency NEFT transfer. VaniRakshak’s on-device acoustic engine detected artificial pitch stability and HiFi-GAN high-frequency cutoffs, suspending the transaction in under 500ms.
                </p>

                <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                    • PVSI: 0.94 (Synthetic Constancy)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                    • Cutoff: 7.8 kHz (Neural Vocoder)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold">
                    • Threat: 92.4% CRITICAL
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onStart}
                    className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current text-slate-950" />
                    <span>Test This Scenario in Live Console</span>
                  </button>
                </div>
              </div>

              {/* Mockup Audio Visualizer Frame */}
              <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-inner space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>16 kHz PCM DSP Stream</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                    TRANSFER QUARANTINED
                  </span>
                </div>

                <div className="h-32 w-full rounded-xl bg-[#090d16] p-3 flex flex-col justify-between border border-slate-950">
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                    <span>Harmonic Energy (HNR: 22.4 dB)</span>
                    <span className="text-rose-400 font-bold">Vocoder Cutoff: 7.8 kHz</span>
                  </div>

                  <div className="flex items-end justify-between gap-1 h-14">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-400 via-blue-500 to-rose-500 rounded-full"
                        style={{
                          height: `${Math.max(20, (Math.sin(i * 0.45) * 0.5 + 0.5) * 100)}%`,
                          opacity: i > 18 ? 0.35 : 0.95
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>0 Hz</span>
                    <span className="text-rose-400">⚠️ ElevenLabs Neural Vocoder Truncation</span>
                    <span>8 kHz</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span className="text-rose-200 text-[11px] font-semibold">
                      Out-of-band Step-up SMS OTP challenge dispatched to victim
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-300">OTP: 8492</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. Key Architecture & Features Breakdown (id="features") */}
      <section id="features" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 uppercase tracking-widest font-mono bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/70">
              Core Technical Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading">
              Built for Real-Time Financial & Enterprise Defense
            </h2>
            <p className="text-slate-600 text-base font-body leading-relaxed">
              VaniRakshak combines physical acoustic analysis with quantized deep learning to deliver instant, explainable, and privacy-compliant deepfake verdicts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Real-Time Signal Canvas */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm light-card-hover space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                60 FPS Mel-Spectrogram Visualizer
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Renders high-resolution frequency waterfalls (0–8000 Hz) using native browser Web Audio API. Instantly highlights artificial low-pass cutoffs characteristic of neural vocoders like HiFi-GAN and DiffWave.
              </p>
            </div>

            {/* Feature 2: Dynamic Bayesian Risk Gauge */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm light-card-hover space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Dynamic Threat Risk Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Fuses synthetic probability (P_synth), network metadata risk (C_context), and speaker baseline deviation (A_anomaly) into a live 0% to 100% composite score updating every 1–2s.
              </p>
            </div>

            {/* Feature 3: Automated Fraud Mitigation */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm light-card-hover space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Automated Wire Transfer Killswitch
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                When risk exceeds 75%, verbal transaction clearance is immediately suspended. Automatically challenges the caller with out-of-band SMS OTP step-up verification or secondary manager authorization.
              </p>
            </div>

            {/* Feature 4: Acoustic Artifact Breakdown */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm light-card-hover space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Pitch Variation Stability Index (PVSI)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Detects unnatural robotic pitch constancy typical of text-to-speech models versus dynamic human vocal fold prosody. Tracks micro-pause respiration and glottal phase coherence.
              </p>
            </div>

            {/* Feature 5: Indian Regional Invariance */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm light-card-hover space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 font-bold">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Indian Regional Accent Invariance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Fine-tuned with AI4Bharat Kathbath speech corpora across Hindi, Tamil, Bengali, Telugu, and Marathi, achieving &gt;98.5% invariance to avoid discriminatory false positives against native Indian accents.
              </p>
            </div>

            {/* Feature 6: Section 6 DPDP Act Compliance */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm light-card-hover space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                DPDP Act 2023 Statutory Privacy
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Section 6 compliant ephemeral in-memory circular ring buffer. Zero bytes of voice biometrics are persisted to disk or cloud databases, guaranteeing zero data leakage and ₹0.00 cloud GPU cost.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Architecture Pipeline (id="pipeline") with Space Grotesk Outline Numbers */}
      <section id="pipeline" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-widest font-mono bg-slate-100 px-3.5 py-1 rounded-full border border-slate-300">
              End-to-End Processing
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading">
              Sub-50ms Edge Audio Processing Pipeline
            </h2>
            <p className="text-slate-600 text-base font-body">
              How VaniRakshak processes continuous incoming audio without cloud latency or server bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Step 01 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 light-card-hover relative overflow-hidden">
              <div className="outline-number text-5xl opacity-40 absolute top-3 right-4">01</div>
              <div>
                <div className="text-xs font-body font-bold text-blue-600 mb-1">STEP 01</div>
                <h4 className="text-base font-bold text-slate-900 font-heading">Audio Ingestion</h4>
                <p className="text-xs text-slate-600 mt-1 font-body leading-relaxed">
                  16 kHz native mono PCM audio stream capture via Web Audio API.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 font-medium">
                MediaDevices.getUserMedia
              </div>
            </div>

            {/* Step 02 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 light-card-hover relative overflow-hidden">
              <div className="outline-number text-5xl opacity-40 absolute top-3 right-4">02</div>
              <div>
                <div className="text-xs font-body font-bold text-blue-600 mb-1">STEP 02</div>
                <h4 className="text-base font-bold text-slate-900 font-heading">Silero VAD Filter</h4>
                <p className="text-xs text-slate-600 mt-1 font-body leading-relaxed">
                  Drops silence and ambient gaps to isolate active speech frames.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 font-medium">
                WASM Voice Activity
              </div>
            </div>

            {/* Step 03 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 light-card-hover relative overflow-hidden">
              <div className="outline-number text-5xl opacity-40 absolute top-3 right-4">03</div>
              <div>
                <div className="text-xs font-body font-bold text-blue-600 mb-1">STEP 03</div>
                <h4 className="text-base font-bold text-slate-900 font-heading">Sliding Ring Buffer</h4>
                <p className="text-xs text-slate-600 mt-1 font-body leading-relaxed">
                  4-second volatile window with 50% overlap flushed every 2000ms.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 font-medium">
                Ephemeral Circular RAM
              </div>
            </div>

            {/* Step 04 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 light-card-hover relative overflow-hidden">
              <div className="outline-number text-5xl opacity-40 absolute top-3 right-4">04</div>
              <div>
                <div className="text-xs font-body font-bold text-blue-600 mb-1">STEP 04</div>
                <h4 className="text-base font-bold text-slate-900 font-heading">Edge INT8 Classifier</h4>
                <p className="text-xs text-slate-600 mt-1 font-body leading-relaxed">
                  RawTFNet ONNX model executes on client CPU/NPU in ~18ms.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 font-medium">
                ONNX-Web SIMD INT8
              </div>
            </div>

            {/* Step 05 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 light-card-hover relative overflow-hidden">
              <div className="outline-number text-5xl opacity-40 absolute top-3 right-4">05</div>
              <div>
                <div className="text-xs font-body font-bold text-blue-600 mb-1">STEP 05</div>
                <h4 className="text-base font-bold text-slate-900 font-heading">Dynamic Mitigation</h4>
                <p className="text-xs text-slate-600 mt-1 font-body leading-relaxed">
                  Triggers out-of-band OTP challenge and halts wire transfer if risk &gt; 75%.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 font-medium">
                Automated Killswitch
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Indian Regional Language Matrix (id="accents") */}
      <section id="accents" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-widest font-mono bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/70">
              Invariance Matrix
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading">
              Pan-Indian Language & Accent Coverage
            </h2>
            <p className="text-slate-600 text-base font-body">
              Fine-tuned to prevent false alarms on regional Indian dialects, phonology, and intonation patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONAL_ACCENTS.map((accent) => (
              <div key={accent.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3.5 light-card-hover font-body">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-lg font-heading">{accent.name}</h4>
                  <span className="text-xs font-body font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    {accent.invarianceScore}% Invariance
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-body">{accent.region}</div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic font-body leading-relaxed">
                  "{accent.samplePhrase}"
                </div>
                <div className="text-[11px] font-body text-slate-500 flex justify-between pt-1">
                  <span>Pitch Range:</span>
                  <span className="text-slate-800 font-semibold">{accent.typicalPitchRangeHz}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Statutory Compliance & Hackathon Pillars (id="compliance") */}
      <section id="compliance" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-body">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-widest font-mono bg-slate-100 px-3.5 py-1 rounded-full border border-slate-300">
              Evaluation Criteria Alignment
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading">
              Why VaniRakshak Wins on Every Dimension
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 light-card-hover relative overflow-hidden">
              <div className="outline-number text-4xl opacity-30 absolute top-3 right-4">01</div>
              <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-heading">Social Benefit</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                Protects senior citizens from fake emergency arrest extortion calls and guards enterprises against CEO voice cloning wire transfer scams.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 light-card-hover relative overflow-hidden">
              <div className="outline-number text-4xl opacity-30 absolute top-3 right-4">02</div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-heading">Technical Feasibility</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                Sub-50ms inference latency achieved using a volatile 4-second sliding ring buffer with 50% overlap, running at 60 FPS in any standard browser.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 light-card-hover relative overflow-hidden">
              <div className="outline-number text-4xl opacity-30 absolute top-3 right-4">03</div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-heading">Economic Affordability</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                Eliminates expensive GPU cloud infrastructure (₹0.00 compute cost per call) by quantizing models to 14.2 MB for client-side WASM execution.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 light-card-hover relative overflow-hidden">
              <div className="outline-number text-4xl opacity-30 absolute top-3 right-4">04</div>
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-heading">DPDP Act 2023</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                Complies with Section 6 of India's DPDP Act. Ephemeral in-memory audio buffering with zero persistent biometric storage on external servers.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 8. Bottom Action Banner */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden font-body">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading">
            Ready to Evaluate VaniRakshak Live?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-body">
            Test live microphone speech, trigger ElevenLabs & DiffWave cloned voice benchmarks, and inspect automated wire transfer fraud interception.
          </p>
          <div className="pt-2">
            <button
              onClick={onStart}
              className="px-9 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-extrabold text-base shadow-xl flex items-center gap-2.5 mx-auto transition-all transform hover:scale-105 active:scale-95 font-body cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Let's Start Live Evaluation</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <p>VaniRakshak (वाणी रक्षक) • AI Voice Deepfake Defense & Fraud Interception Platform • DPDP Act 2023 Sec 6 Compliant</p>
      </footer>

    </div>
  );
};
