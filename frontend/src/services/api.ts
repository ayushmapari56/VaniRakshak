import type { 
  AcousticBreakdown, 
  AudioSamplePreset, 
  RegionalAccent, 
  ThreatMetrics 
} from '../types';

const API_BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000';

export interface AudioAnalysisResult {
  success: boolean;
  filename?: string;
  durationSec: number;
  sampleRate: number;
  metrics: ThreatMetrics;
  breakdown: AcousticBreakdown;
  vadActive: boolean;
  volumeDb: number;
  notes: string[];
}

export interface WireInterceptResponse {
  transactionId: string;
  status: 'PENDING' | 'INTERCEPTED_SUSPENDED' | 'OTP_CHALLENGE' | 'AUTHORIZED' | 'BLOCKED_FRAUD';
  actionTaken: string;
  authAuditCode: string;
  timestamp: string;
  securityFlags: string[];
}

export interface ForensicReportPayload {
  callerIdentity: string;
  riskScore: number;
  riskVerdict: string;
  syntheticProbability: number;
  breakdown: AcousticBreakdown;
  mitigationActionTaken: string;
}

export interface VerifiedForensicReport {
  reportId: string;
  generatedAt: string;
  callerIdentity: string;
  riskScore: number;
  riskVerdict: string;
  syntheticProbability: number;
  breakdown: AcousticBreakdown;
  mitigationActionTaken: string;
  dpdpAuditHash: string;
  verificationSignature: string;
  dpdpCompliance: {
    ephemeralBuffer: boolean;
    section6Compliant: boolean;
    zeroAudioRetention: boolean;
    auditStandard: string;
  };
}

class ApiService {
  private backendAvailable: boolean = false;
  private listeners: Set<(online: boolean) => void> = new Set();

  constructor() {
    this.checkHealth();
    // Poll health status periodically
    setInterval(() => this.checkHealth(), 10000);
  }

  public onStatusChange(callback: (online: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.backendAvailable);
    return () => this.listeners.delete(callback);
  }

  public isOnline(): boolean {
    return this.backendAvailable;
  }

  public getWsUrl(): string {
    return `${WS_BASE_URL}/ws/audio-stream`;
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
      const ok = res.ok;
      if (this.backendAvailable !== ok) {
        this.backendAvailable = ok;
        this.notifyListeners();
      }
      return ok;
    } catch {
      if (this.backendAvailable !== false) {
        this.backendAvailable = false;
        this.notifyListeners();
      }
      return false;
    }
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn(this.backendAvailable));
  }

  public async getPresets(): Promise<AudioSamplePreset[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/presets`);
      if (!res.ok) throw new Error('Failed to fetch presets');
      return await res.json();
    } catch (err) {
      console.warn('Backend presets endpoint unreachable, using client presets', err);
      return [];
    }
  }

  public async getRegionalAccents(): Promise<RegionalAccent[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/regional-accents`);
      if (!res.ok) throw new Error('Failed to fetch regional accents');
      return await res.json();
    } catch (err) {
      console.warn('Backend accents endpoint unreachable', err);
      return [];
    }
  }

  public async analyzeAudioFile(
    file: File, 
    contextModifiers?: { unverifiedGateway?: boolean; highAmountRisk?: boolean; callerAnomalous?: boolean }
  ): Promise<AudioAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (contextModifiers?.unverifiedGateway) formData.append('unverifiedGateway', 'true');
    if (contextModifiers?.highAmountRisk) formData.append('highAmountRisk', 'true');
    if (contextModifiers?.callerAnomalous) formData.append('callerAnomalous', 'true');

    const res = await fetch(`${API_BASE_URL}/api/analyze-audio`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      throw new Error(`Audio analysis failed: ${res.statusText}`);
    }
    return await res.json();
  }

  public async interceptWireTransfer(
    request: {
      transactionId: string;
      amount: number;
      recipientName: string;
      recipientBank: string;
      accountNumber: string;
      requestedByCaller: string;
      callerPhone: string;
      callerLocation: string;
      compositeRiskScore: number;
      action: 'INTERCEPT' | 'CHALLENGE_OTP' | 'FREEZE_ACCOUNT' | 'AUTHORIZE';
    }
  ): Promise<WireInterceptResponse> {
    const res = await fetch(`${API_BASE_URL}/api/wire-transfer/intercept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!res.ok) {
      throw new Error(`Wire intercept action failed: ${res.statusText}`);
    }
    return await res.json();
  }

  public async generateForensicReport(
    payload: ForensicReportPayload
  ): Promise<VerifiedForensicReport> {
    const res = await fetch(`${API_BASE_URL}/api/forensics/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Report generation failed: ${res.statusText}`);
    }
    return await res.json();
  }
}

export const apiService = new ApiService();
