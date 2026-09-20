from pydantic import BaseModel, Field
from typing import List, Optional, Literal

RiskLevel = Literal['SAFE', 'SUSPICIOUS', 'CRITICAL']
ActionRequired = Literal[
    'ALLOW',
    'MONITOR_SPEECH',
    'FLAG_FOR_AUDIT',
    'BLOCK_TRANSACTION',
    'STEP_UP_OTP'
]

VocoderType = Literal[
    'HiFi-GAN v2',
    'DiffWave',
    'VITS / FastSpeech2',
    'ElevenLabs Neural Turbo',
    'None (Organic Glottal)'
]

class ThreatMetrics(BaseModel):
    timestamp: int
    syntheticProbability: float = Field(..., ge=0.0, le=1.0)
    contextualRisk: float = Field(..., ge=0.0, le=1.0)
    anomalyScore: float = Field(..., ge=0.0, le=1.0)
    compositeRiskScore: float = Field(..., ge=0.0, le=100.0)
    riskLevel: RiskLevel
    actionRequired: ActionRequired
    confidence: float = Field(default=0.94)
    latencyMs: float = Field(default=18.0)

class AcousticBreakdown(BaseModel):
    pitchStabilityIndex: float
    spectralEnergyCutoffKhz: float
    microPauseNaturalness: float
    phaseCoherenceAnomaly: float
    harmonicToNoiseRatioDb: float
    detectedVocoder: VocoderType
    spectralRollOffPercentile: float
    formantDistortionScore: float

class AudioAnalysisResponse(BaseModel):
    success: bool
    filename: Optional[str] = None
    durationSec: float
    sampleRate: int
    metrics: ThreatMetrics
    breakdown: AcousticBreakdown
    vadActive: bool
    volumeDb: float
    notes: List[str]

class ContextModifiers(BaseModel):
    unverifiedGateway: bool = False
    highAmountRisk: bool = False
    callerAnomalous: bool = False

class AudioSamplePreset(BaseModel):
    id: str
    title: str
    subtitle: str
    category: str
    language: str
    accent: str
    provider: str
    expectedRisk: float
    codec: str
    scenarioDescription: str
    transactionAmount: Optional[float] = None
    unverifiedGateway: Optional[bool] = None
    callerName: Optional[str] = None
    audioDurationSec: float

class RegionalAccent(BaseModel):
    id: str
    name: string_name if False else str
    code: str
    region: str
    invarianceScore: float
    typicalPitchRangeHz: str
    samplePhrase: str

class WireTransferRequest(BaseModel):
    transactionId: str
    amount: float
    recipientName: str
    recipientBank: str
    accountNumber: str
    requestedByCaller: str
    callerPhone: str
    callerLocation: str
    compositeRiskScore: float
    action: Literal['INTERCEPT', 'CHALLENGE_OTP', 'FREEZE_ACCOUNT', 'AUTHORIZE']

class WireTransferResponse(BaseModel):
    transactionId: str
    status: Literal['PENDING', 'INTERCEPTED_SUSPENDED', 'OTP_CHALLENGE', 'AUTHORIZED', 'BLOCKED_FRAUD']
    actionTaken: str
    authAuditCode: str
    timestamp: str
    securityFlags: List[str]

class ForensicReportRequest(BaseModel):
    callerIdentity: str
    riskScore: float
    riskVerdict: RiskLevel
    syntheticProbability: float
    breakdown: AcousticBreakdown
    mitigationActionTaken: str

class ForensicReportResponse(BaseModel):
    reportId: str
    generatedAt: str
    callerIdentity: str
    riskScore: float
    riskVerdict: RiskLevel
    syntheticProbability: float
    breakdown: AcousticBreakdown
    mitigationActionTaken: str
    dpdpAuditHash: str
    verificationSignature: str
    dpdpCompliance: dict
