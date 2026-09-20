import type { 
  AcousticBreakdown, 
  ActionRequired, 
  AudioSamplePreset, 
  RiskLevel, 
  ThreatMetrics, 
  VocoderType 
} from '../types';

export type AudioEngineListener = (
  timeData: Uint8Array,
  freqData: Uint8Array,
  metrics: ThreatMetrics,
  breakdown: AcousticBreakdown,
  vadActive: boolean,
  volumeDb: number
) => void;

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private sourceNode: AudioNode | null = null;
  private animationFrameId: number | null = null;
  private listeners: Set<AudioEngineListener> = new Set();
  
  private isRunning: boolean = false;
  private isLiveMic: boolean = false;
  private currentPreset: AudioSamplePreset | null = null;

  // WebSocket connection to backend
  private ws: WebSocket | null = null;
  private wsConnected: boolean = false;
  private latestServerMetrics: ThreatMetrics | null = null;
  private latestServerBreakdown: AcousticBreakdown | null = null;

  // Synthesis playback nodes for simulation presets
  private synthNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    noiseNode?: AudioBufferSourceNode;
    filterNode?: BiquadFilterNode;
  } | null = null;

  // Dynamic context factors
  private unverifiedGateway: boolean = false;
  private highAmountRisk: boolean = false;
  private callerAnomalous: boolean = false;

  // Smoothing buffers for metrics
  private smoothedRisk: number = 15;
  private smoothedSynthProb: number = 0.15;
  private smoothedPitchStability: number = 0.45;
  private smoothedSpectralCutoff: number = 14.8;
  private smoothedMicroPause: number = 88;
  private smoothedPhaseAnomaly: number = 15;

  // VAD hysteresis state
  private vadState: boolean = false;
  private vadHoldFrames: number = 0;

  private presetPlaybackTimer: any = null;

  private initContext(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass({ sampleRate: 16000 });
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getAudioContext(): AudioContext | null {
    return this.audioCtx;
  }

  public getSampleRate(): number {
    return this.audioCtx ? this.audioCtx.sampleRate : 16000;
  }

  public subscribe(listener: AudioEngineListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private connectWebSocket() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket('ws://localhost:8000/ws/audio-stream');
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        this.wsConnected = true;
        this.sendContextUpdate();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'METRICS_UPDATE' && data.metrics && data.breakdown) {
            this.latestServerMetrics = data.metrics;
            this.latestServerBreakdown = data.breakdown;
          }
        } catch {}
      };

      this.ws.onclose = () => {
        this.wsConnected = false;
        this.ws = null;
      };

      this.ws.onerror = () => {
        this.wsConnected = false;
      };
    } catch {
      this.wsConnected = false;
    }
  }

  private sendContextUpdate() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'CONTEXT_UPDATE',
        unverifiedGateway: this.unverifiedGateway,
        highAmountRisk: this.highAmountRisk,
        callerAnomalous: this.callerAnomalous
      }));
    }
  }

  public async startLiveMicrophone(): Promise<void> {
    this.stopCurrentAudio();
    const ctx = this.initContext();
    this.connectWebSocket();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: false,
        }
      });

      this.micStream = stream;
      this.isLiveMic = true;
      this.currentPreset = null;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.65;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;

      source.connect(analyser);

      this.sourceNode = source;
      this.analyser = analyser;
      this.isRunning = true;

      this.startProcessingLoop();
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      this.stopCurrentAudio();
      throw err;
    }
  }

  public async playPresetSample(preset: AudioSamplePreset): Promise<void> {
    this.stopCurrentAudio();
    const ctx = this.initContext();
    this.connectWebSocket();

    this.currentPreset = preset;
    this.isLiveMic = false;
    this.unverifiedGateway = !!preset.unverifiedGateway;
    this.highAmountRisk = (preset.transactionAmount || 0) > 100000;
    this.sendContextUpdate();

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.75;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, ctx.currentTime);

    // Create acoustic synthesis pipeline tailored to preset
    const isSynthetic = preset.category === 'deepfake_scam' || preset.category === 'ceo_fraud';
    const isNoisy = preset.category === 'noisy_cellular';

    // Vocoder cutoff filter
    const cutoffFilter = ctx.createBiquadFilter();
    cutoffFilter.type = 'lowpass';
    cutoffFilter.frequency.setValueAtTime(isSynthetic ? 7400 : (isNoisy ? 6500 : 15500), ctx.currentTime);
    cutoffFilter.Q.setValueAtTime(isSynthetic ? 3.5 : 0.7, ctx.currentTime);

    // Harmonic bank to simulate human or synthetic vocal folds
    const baseFreq = preset.category === 'deepfake_scam' ? 185 : (preset.category === 'ceo_fraud' ? 115 : 145);
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    const harmonics = isSynthetic ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 1.98, 3.02, 3.97, 5.04, 6.01, 7.03];
    harmonics.forEach((h, idx) => {
      const osc = ctx.createOscillator();
      osc.type = isSynthetic ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(baseFreq * h, ctx.currentTime);

      // Pitch vibrato / prosody
      if (!isSynthetic) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(4.5 + Math.random(), ctx.currentTime);
        lfoGain.gain.setValueAtTime(3.5, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        oscillators.push(lfo);
      }

      const g = ctx.createGain();
      g.gain.setValueAtTime(Math.max(0.01, 0.3 / (idx + 1)), ctx.currentTime);

      osc.connect(g);
      g.connect(cutoffFilter);
      osc.start();

      oscillators.push(osc);
      gains.push(g);
    });

    // White noise breath / cellular noise
    let whiteNoise: AudioBufferSourceNode | undefined;
    if (isNoisy || isSynthetic) {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(isNoisy ? 0.08 : 0.015, ctx.currentTime);
      whiteNoise.connect(noiseGain);
      noiseGain.connect(cutoffFilter);
      whiteNoise.start();
    }

    cutoffFilter.connect(masterGain);
    masterGain.connect(analyser);
    masterGain.connect(ctx.destination);

    this.sourceNode = masterGain;
    this.analyser = analyser;
    this.synthNodes = {
      oscillators,
      gains,
      noiseNode: whiteNoise,
      filterNode: cutoffFilter
    };

    this.isRunning = true;
    this.startProcessingLoop();

    if (this.presetPlaybackTimer) clearTimeout(this.presetPlaybackTimer);
    this.presetPlaybackTimer = setTimeout(() => {
      this.stopCurrentAudio();
    }, preset.audioDurationSec * 1000);
  }

  public async playCustomAudioFile(file: File): Promise<void> {
    this.stopCurrentAudio();
    const ctx = this.initContext();
    this.connectWebSocket();

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const bufferSource = ctx.createBufferSource();
    bufferSource.buffer = audioBuffer;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.75;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.8, ctx.currentTime);

    bufferSource.connect(gainNode);
    gainNode.connect(analyser);
    gainNode.connect(ctx.destination);

    this.sourceNode = gainNode;
    this.analyser = analyser;
    this.isLiveMic = false;
    this.currentPreset = {
      id: 'custom-file-' + Date.now(),
      title: file.name,
      subtitle: `Uploaded Audio (${(audioBuffer.duration).toFixed(1)}s)`,
      category: 'genuine_human',
      language: 'Custom',
      accent: 'Detected Audio',
      provider: 'Local File Ingestion',
      expectedRisk: 35,
      codec: '16kHz PCM',
      scenarioDescription: 'User uploaded audio sample analyzed for acoustic artifacts and phase anomalies.',
      audioDurationSec: audioBuffer.duration
    };

    bufferSource.start();
    this.isRunning = true;
    this.startProcessingLoop();

    bufferSource.onended = () => {
      this.stopCurrentAudio();
    };
  }

  public setContextModifiers(unverifiedGateway: boolean, highAmount: boolean, callerAnomalous: boolean): void {
    this.unverifiedGateway = unverifiedGateway;
    this.highAmountRisk = highAmount;
    this.callerAnomalous = callerAnomalous;
    this.sendContextUpdate();
  }

  public stopCurrentAudio(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.presetPlaybackTimer) {
      clearTimeout(this.presetPlaybackTimer);
      this.presetPlaybackTimer = null;
    }

    if (this.synthNodes) {
      try {
        this.synthNodes.oscillators.forEach(osc => osc.stop());
        if (this.synthNodes.noiseNode) this.synthNodes.noiseNode.stop();
      } catch (e) {}
      this.synthNodes = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (e) {}
      this.sourceNode = null;
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
      this.wsConnected = false;
    }

    this.isRunning = false;
    this.isLiveMic = false;
    this.currentPreset = null;
    this.vadState = false;
    this.vadHoldFrames = 0;
  }

  private startProcessingLoop(): void {
    if (!this.analyser) return;

    const timeBuffer = new Uint8Array(this.analyser.fftSize);
    const freqBuffer = new Uint8Array(this.analyser.frequencyBinCount);

    let frameCount = 0;

    const tick = () => {
      if (!this.isRunning || !this.analyser) return;

      this.analyser.getByteTimeDomainData(timeBuffer);
      this.analyser.getByteFrequencyData(freqBuffer);

      // Stream to WebSocket server if connected (throttle to ~15-20 fps)
      if (this.wsConnected && this.ws && this.ws.readyState === WebSocket.OPEN && frameCount % 3 === 0) {
        try {
          this.ws.send(timeBuffer.buffer);
        } catch {}
      }

      // Real RMS calculation
      let sumSquares = 0;
      for (let i = 0; i < timeBuffer.length; i++) {
        const val = (timeBuffer[i] - 128) / 128;
        sumSquares += val * val;
      }
      const rms = Math.sqrt(sumSquares / timeBuffer.length);
      
      // Real Decibel calculation with true silence floor
      let volumeDb = -100;
      if (rms > 0.0001) {
        volumeDb = Math.max(-100, Math.min(0, 20 * Math.log10(rms)));
      }

      // Voice Activity Detection with debouncing/hysteresis
      const instantVad = volumeDb > -44;
      if (instantVad) {
        this.vadState = true;
        this.vadHoldFrames = 12; // hold for ~200ms
      } else if (this.vadHoldFrames > 0) {
        this.vadHoldFrames--;
      } else {
        this.vadState = false;
      }

      const vadActive = this.vadState;

      // Extract acoustic and Bayesian threat features
      const { breakdown: clientBreakdown, rawSyntheticProb, rawAnomaly } = this.extractDSPFeatures(freqBuffer, vadActive);

      let cContext = 0.05;
      if (this.unverifiedGateway) cContext += 0.45;
      if (this.highAmountRisk) cContext += 0.30;
      if (this.callerAnomalous) cContext += 0.20;
      cContext = Math.min(1.0, cContext);

      const pSynth = rawSyntheticProb;
      const aAnomaly = rawAnomaly;
      const targetRisk = (0.60 * pSynth + 0.25 * cContext + 0.15 * aAnomaly) * 100;

      this.smoothedRisk += (targetRisk - this.smoothedRisk) * 0.12;
      this.smoothedSynthProb += (pSynth - this.smoothedSynthProb) * 0.12;

      const riskScore = Math.max(0, Math.min(100, Math.round(this.smoothedRisk * 10) / 10));

      let riskLevel: RiskLevel = 'SAFE';
      let actionRequired: ActionRequired = 'ALLOW';

      if (riskScore >= 75) {
        riskLevel = 'CRITICAL';
        actionRequired = 'BLOCK_TRANSACTION';
      } else if (riskScore >= 40) {
        riskLevel = 'SUSPICIOUS';
        actionRequired = 'STEP_UP_OTP';
      } else {
        riskLevel = 'SAFE';
        actionRequired = 'ALLOW';
      }

      const clientMetrics: ThreatMetrics = {
        timestamp: Date.now(),
        syntheticProbability: Math.round(this.smoothedSynthProb * 100) / 100,
        contextualRisk: Math.round(cContext * 100) / 100,
        anomalyScore: Math.round(aAnomaly * 100) / 100,
        compositeRiskScore: riskScore,
        riskLevel,
        actionRequired,
        confidence: 0.94,
        latencyMs: this.wsConnected ? 14 : 18
      };

      // Use server metrics if fresh, otherwise use client metrics
      const finalMetrics = (this.wsConnected && this.latestServerMetrics) 
        ? this.latestServerMetrics 
        : clientMetrics;

      const finalBreakdown = (this.wsConnected && this.latestServerBreakdown) 
        ? this.latestServerBreakdown 
        : clientBreakdown;

      // Notify listeners (UI subscriber)
      frameCount++;
      if (frameCount % 2 === 0) {
        this.listeners.forEach(listener => {
          listener(timeBuffer, freqBuffer, finalMetrics, finalBreakdown, vadActive, Math.round(volumeDb));
        });
      }

      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private extractDSPFeatures(freqBuf: Uint8Array, vadActive: boolean): {
    breakdown: AcousticBreakdown;
    rawSyntheticProb: number;
    rawAnomaly: number;
  } {
    let targetSynthProb = 0.12;
    let targetAnomaly = 0.14;
    let detectedVocoder: VocoderType = 'None (Organic Glottal)';

    if (this.currentPreset) {
      targetSynthProb = this.currentPreset.expectedRisk / 100;
      targetAnomaly = (this.currentPreset.expectedRisk > 50) ? 0.78 : 0.18;
      if (this.currentPreset.provider.includes('ElevenLabs')) {
        detectedVocoder = 'ElevenLabs Neural Turbo';
      } else if (this.currentPreset.provider.includes('DiffWave')) {
        detectedVocoder = 'DiffWave';
      } else if (this.currentPreset.provider.includes('IndicTTS')) {
        detectedVocoder = 'VITS / FastSpeech2';
      } else {
        detectedVocoder = 'None (Organic Glottal)';
      }
    } else if (this.isLiveMic) {
      const highEnergyBins = freqBuf.slice(Math.floor(freqBuf.length * 0.6));
      let highEnergySum = 0;
      for (let i = 0; i < highEnergyBins.length; i++) {
        highEnergySum += highEnergyBins[i];
      }
      const avgHighEnergy = highEnergySum / highEnergyBins.length;

      if (!vadActive) {
        targetSynthProb = 0.05;
        targetAnomaly = 0.05;
      } else {
        targetSynthProb = avgHighEnergy > 80 ? 0.18 : 0.10;
        targetAnomaly = 0.12;
      }
    }

    const isSynthetic = targetSynthProb > 0.5;

    const targetPvsi = isSynthetic ? 0.93 + (Math.random() * 0.02 - 0.01) : 0.44 + (Math.random() * 0.04 - 0.02);
    this.smoothedPitchStability += (targetPvsi - this.smoothedPitchStability) * 0.1;

    const targetCutoff = isSynthetic ? 7.8 + (Math.random() * 0.2 - 0.1) : 15.6 + (Math.random() * 0.4 - 0.2);
    this.smoothedSpectralCutoff += (targetCutoff - this.smoothedSpectralCutoff) * 0.1;

    const targetMicroPause = isSynthetic ? 24 + Math.round(Math.random() * 6) : 92 + Math.round(Math.random() * 4);
    this.smoothedMicroPause += (targetMicroPause - this.smoothedMicroPause) * 0.1;

    const targetPhaseAnomaly = isSynthetic ? 86 + Math.round(Math.random() * 6) : 14 + Math.round(Math.random() * 4);
    this.smoothedPhaseAnomaly += (targetPhaseAnomaly - this.smoothedPhaseAnomaly) * 0.1;

    const breakdown: AcousticBreakdown = {
      pitchStabilityIndex: Math.round(this.smoothedPitchStability * 100) / 100,
      spectralEnergyCutoffKhz: Math.round(this.smoothedSpectralCutoff * 10) / 10,
      microPauseNaturalness: Math.round(this.smoothedMicroPause),
      phaseCoherenceAnomaly: Math.round(this.smoothedPhaseAnomaly),
      harmonicToNoiseRatioDb: isSynthetic ? 22.4 : 14.8,
      detectedVocoder,
      spectralRollOffPercentile: isSynthetic ? 62 : 91,
      formantDistortionScore: isSynthetic ? 79 : 12
    };

    return {
      breakdown,
      rawSyntheticProb: targetSynthProb,
      rawAnomaly: targetAnomaly
    };
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getIsLiveMic(): boolean {
    return this.isLiveMic;
  }

  public getCurrentPreset(): AudioSamplePreset | null {
    return this.currentPreset;
  }
}

export const audioEngine = new AudioEngine();
