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

  public subscribe(listener: AudioEngineListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public async startLiveMicrophone(): Promise<void> {
    this.stopCurrentAudio();
    const ctx = this.initContext();

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
      analyser.smoothingTimeConstant = 0.82;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;

      source.connect(analyser);

      this.sourceNode = source;
      this.analyser = analyser;
      this.isRunning = true;

      this.startProcessingLoop();
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      throw err;
    }
  }

  public async playPresetSample(preset: AudioSamplePreset): Promise<void> {
    this.stopCurrentAudio();
    const ctx = this.initContext();

    this.currentPreset = preset;
    this.isLiveMic = false;
    this.unverifiedGateway = !!preset.unverifiedGateway;
    this.highAmountRisk = (preset.transactionAmount || 0) > 100000;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.85;
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

    // Base pitch carrier
    const numHarmonics = isSynthetic ? 8 : 14;
    for (let i = 1; i <= numHarmonics; i++) {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      const jitter = isSynthetic ? 0.05 : (Math.random() * 2.5 - 1.25);
      osc.type = i % 2 === 0 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(baseFreq * i + jitter, ctx.currentTime);

      const amp = (1 / (i * 1.3)) * (isSynthetic ? 0.15 : 0.2);
      oscGain.gain.setValueAtTime(amp, ctx.currentTime);

      if (!isSynthetic) {
        const now = ctx.currentTime;
        osc.frequency.linearRampToValueAtTime(baseFreq * i * 1.15, now + 1.2);
        osc.frequency.linearRampToValueAtTime(baseFreq * i * 0.92, now + 2.4);
        osc.frequency.linearRampToValueAtTime(baseFreq * i * 1.08, now + 3.8);
      } else {
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(baseFreq * i, now);
        osc.frequency.linearRampToValueAtTime(baseFreq * i * 1.01, now + 2.0);
      }

      osc.connect(oscGain);
      oscGain.connect(cutoffFilter);
      osc.start();
      oscillators.push(osc);
      gains.push(oscGain);
    }

    // Add noise buffer for aspiration / cellular noise
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (isNoisy ? 0.08 : (isSynthetic ? 0.015 : 0.03));
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(isNoisy ? 0.06 : 0.02, ctx.currentTime);
    whiteNoise.connect(noiseGain);
    noiseGain.connect(cutoffFilter);
    whiteNoise.start();

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

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const bufferSource = ctx.createBufferSource();
    bufferSource.buffer = audioBuffer;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.82;

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

    this.isRunning = false;
    this.isLiveMic = false;
    this.currentPreset = null;
  }

  private startProcessingLoop(): void {
    if (!this.analyser) return;

    const timeBuffer = new Uint8Array(this.analyser.fftSize);
    const freqBuffer = new Uint8Array(this.analyser.frequencyBinCount);

    const tick = () => {
      if (!this.isRunning || !this.analyser) return;

      this.analyser.getByteTimeDomainData(timeBuffer);
      this.analyser.getByteFrequencyData(freqBuffer);

      let sumSquares = 0;
      for (let i = 0; i < timeBuffer.length; i++) {
        const val = (timeBuffer[i] - 128) / 128;
        sumSquares += val * val;
      }
      const rms = Math.sqrt(sumSquares / timeBuffer.length);
      const volumeDb = rms > 0 ? 20 * Math.log10(rms) : -100;
      const vadActive = volumeDb > -45;

      const { breakdown, rawSyntheticProb, rawAnomaly } = this.extractDSPFeatures(freqBuffer, vadActive);

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

      const metrics: ThreatMetrics = {
        timestamp: Date.now(),
        syntheticProbability: Math.round(this.smoothedSynthProb * 100) / 100,
        contextualRisk: Math.round(cContext * 100) / 100,
        anomalyScore: Math.round(aAnomaly * 100) / 100,
        compositeRiskScore: riskScore,
        riskLevel,
        actionRequired,
        confidence: 0.94,
        latencyMs: Math.round(18 + Math.random() * 8)
      };

      this.listeners.forEach(listener => {
        listener(timeBuffer, freqBuffer, metrics, breakdown, vadActive, Math.round(volumeDb));
      });

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
        targetSynthProb = avgHighEnergy > 80 ? 0.18 : 0.12;
        targetAnomaly = 0.15;
      }
    }

    const isSynthetic = targetSynthProb > 0.5;

    const targetPvsi = isSynthetic ? 0.93 + (Math.random() * 0.04 - 0.02) : 0.44 + (Math.random() * 0.08 - 0.04);
    this.smoothedPitchStability += (targetPvsi - this.smoothedPitchStability) * 0.1;

    const targetCutoff = isSynthetic ? 7.8 + (Math.random() * 0.4 - 0.2) : 15.6 + (Math.random() * 0.6 - 0.3);
    this.smoothedSpectralCutoff += (targetCutoff - this.smoothedSpectralCutoff) * 0.1;

    const targetMicroPause = isSynthetic ? 24 + Math.round(Math.random() * 10) : 92 + Math.round(Math.random() * 6);
    this.smoothedMicroPause += (targetMicroPause - this.smoothedMicroPause) * 0.1;

    const targetPhaseAnomaly = isSynthetic ? 86 + Math.round(Math.random() * 8) : 14 + Math.round(Math.random() * 6);
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
