export type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'CRITICAL';

export type ActionRequired = 
  | 'ALLOW'
  | 'MONITOR_SPEECH'
  | 'FLAG_FOR_AUDIT'
  | 'BLOCK_TRANSACTION'
  | 'STEP_UP_OTP';

export type VocoderType = 
  | 'HiFi-GAN v2' 
  | 'DiffWave' 
  | 'VITS / FastSpeech2' 
  | 'ElevenLabs Neural Turbo' 
  | 'None (Organic Glottal)';

export interface ThreatMetrics {
  timestamp: number;
  syntheticProbability: number; // 0.0 - 1.0 (P_synth)
  contextualRisk: number;        // 0.0 - 1.0 (C_context)
  anomalyScore: number;          // 0.0 - 1.0 (A_anomaly)
  compositeRiskScore: number;    // 0 - 100 (S_risk)
  riskLevel: RiskLevel;
  actionRequired: ActionRequired;
  confidence: number;
  latencyMs: number;
}

export interface AcousticBreakdown {
  pitchStabilityIndex: number;         // 0.0 - 1.0 (synthetic = high unnatural stability ~0.85-0.98, human = dynamic variation ~0.35-0.65)
  spectralEnergyCutoffKhz: number;     // e.g. 7.5 kHz (synthetic vocoder cutoff) vs 15.8 kHz (natural wideband)
  microPauseNaturalness: number;       // 0 - 100% (human respiration & phrase pauses)
  phaseCoherenceAnomaly: number;       // 0 - 100% (neural vocoder phase mismatch)
  harmonicToNoiseRatioDb: number;      // e.g. 18.4 dB
  detectedVocoder: VocoderType;
  spectralRollOffPercentile: number;   // 85% roll-off point
  formantDistortionScore: number;      // 0 - 100%
}

export interface RegionalAccent {
  id: string;
  name: string;
  code: string;
  region: string;
  invarianceScore: number; // Invariance % confirming system doesn't falsely flag accent as deepfake
  typicalPitchRangeHz: string;
  samplePhrase: string;
}

export interface AudioSamplePreset {
  id: string;
  title: string;
  subtitle: string;
  category: 'deepfake_scam' | 'ceo_fraud' | 'genuine_human' | 'regional_accent' | 'noisy_cellular';
  language: string;
  accent: string;
  provider: string; // e.g. 'ElevenLabs Voice Clone', 'IndicTTS Synthetic', 'Organic Human Speech', 'Play.ht'
  expectedRisk: number; // Expected synthetic risk %
  codec: '16kHz PCM' | 'AMR-WB (Cellular 2G/3G)' | 'VoLTE 4G HD' | 'Opus Clean';
  scenarioDescription: string;
  transactionAmount?: number;
  unverifiedGateway?: boolean;
  callerName?: string;
  audioDurationSec: number;
}

export interface WireTransferSimulation {
  transactionId: string;
  amount: number;
  recipientName: string;
  recipientBank: string;
  accountNumber: string;
  requestedByCaller: string;
  callerPhone: string;
  callerLocation: string;
  status: 'PENDING' | 'INTERCEPTED_SUSPENDED' | 'OTP_CHALLENGE' | 'AUTHORIZED' | 'BLOCKED_FRAUD';
  securityFlags: string[];
}

export interface EdgeTelemetry {
  inferenceDevice: 'Client WebAssembly (SIMD)' | 'Client NPU WebGPU' | 'FastAPI Python Server (Fallback)';
  onnxModel: 'RawTFNet-INT8 (14.2 MB)' | 'Truncated XLS-R / Wav2Vec2';
  cloudComputeCostPerCall: string; // "₹0.00 (Zero Cloud Compute)"
  dpdpCompliance: {
    ephemeralBuffer: boolean; // Section 6 DPDP Act 2023 - 0 bytes disk storage
    localDeviceInference: boolean;
    voiceBiometricsEncrypted: boolean;
    dataRetentionSeconds: number; // 0 (Ephemeral)
  };
  bufferOverlaps: string; // "4s window / 50% overlap"
  frameProcessingTimeMs: number;
}

export interface ForensicReport {
  reportId: string;
  generatedAt: string;
  callerIdentity: string;
  riskScore: number;
  riskVerdict: RiskLevel;
  syntheticProbability: number;
  anomalyFactors: {
    pvsi: number;
    vocoderCutoff: number;
    pauseNaturalness: number;
    phaseAnomaly: number;
  };
  detectedVocoder: string;
  mitigationActionTaken: string;
  dpdpAuditHash: string;
}
