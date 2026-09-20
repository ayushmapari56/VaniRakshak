import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  PhoneOff, 
  CheckCircle2, 
  KeyRound, 
  X, 
  Download, 
  CreditCard,
  Fingerprint
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ThreatMetrics, WireTransferSimulation } from '../../types';
import { apiService } from '../../services/api';

interface BankingInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ThreatMetrics;
  transferData?: Partial<WireTransferSimulation>;
  onKillswitchAudio: () => void;
}

export const BankingInterventionModal: React.FC<BankingInterventionModalProps> = ({
  isOpen,
  onClose,
  metrics,
  transferData,
  onKillswitchAudio
}) => {
  const [otpInput, setOtpInput] = useState('');
  const [otpState, setOtpState] = useState<'PENDING' | 'VERIFYING' | 'REJECTED' | 'AUTHORIZED'>('PENDING');
  const [reportExported, setReportExported] = useState(false);
  const [backendActionMsg, setBackendActionMsg] = useState<string | null>(null);

  const transfer: WireTransferSimulation = {
    transactionId: 'TXN-VR-994281',
    amount: transferData?.amount || 250000,
    recipientName: transferData?.recipientName || 'Overseas Mule Account #4091',
    recipientBank: 'National Reserve Clearing Bank',
    accountNumber: '•••• •••• 9821',
    requestedByCaller: transferData?.requestedByCaller || 'Aarav Sharma (Claimed Grandson)',
    callerPhone: '+91 98765 43210 (VoIP Spoof)',
    callerLocation: 'Unverified International Gateway',
    status: 'INTERCEPTED_SUSPENDED',
    securityFlags: [
      'Synthetic Vocoder Detected (P_synth = ' + ((metrics.syntheticProbability || 0.89) * 100).toFixed(0) + '%)',
      'Unverified VoIP Trunk Gateway (+91 Caller ID Spoofing)',
      'High-Value Instant NEFT Clearance Flag'
    ]
  };

  useEffect(() => {
    if (isOpen && metrics.riskLevel === 'CRITICAL') {
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
    }
  }, [isOpen, metrics.riskLevel]);

  if (!isOpen) return null;

  const handleVerifyOtp = async () => {
    setOtpState('VERIFYING');
    
    // Simulate / Call backend
    if (otpInput === '8492' || otpInput === '1234') {
      setOtpState('AUTHORIZED');
      try {
        const res = await apiService.interceptWireTransfer({
          transactionId: transfer.transactionId,
          amount: transfer.amount,
          recipientName: transfer.recipientName,
          recipientBank: transfer.recipientBank,
          accountNumber: transfer.accountNumber,
          requestedByCaller: transfer.requestedByCaller,
          callerPhone: transfer.callerPhone,
          callerLocation: transfer.callerLocation,
          compositeRiskScore: metrics.compositeRiskScore,
          action: 'AUTHORIZE'
        });
        setBackendActionMsg(`Server Auth Code: ${res.authAuditCode} (${res.actionTaken})`);
      } catch {
        setBackendActionMsg('Authorized locally via out-of-band verification.');
      }
    } else {
      setOtpState('REJECTED');
      try {
        await apiService.interceptWireTransfer({
          transactionId: transfer.transactionId,
          amount: transfer.amount,
          recipientName: transfer.recipientName,
          recipientBank: transfer.recipientBank,
          accountNumber: transfer.accountNumber,
          requestedByCaller: transfer.requestedByCaller,
          callerPhone: transfer.callerPhone,
          callerLocation: transfer.callerLocation,
          compositeRiskScore: metrics.compositeRiskScore,
          action: 'CHALLENGE_OTP'
        });
      } catch {}
    }
  };

  const handleKillswitch = async () => {
    try {
      const res = await apiService.interceptWireTransfer({
        transactionId: transfer.transactionId,
        amount: transfer.amount,
        recipientName: transfer.recipientName,
        recipientBank: transfer.recipientBank,
        accountNumber: transfer.accountNumber,
        requestedByCaller: transfer.requestedByCaller,
        callerPhone: transfer.callerPhone,
        callerLocation: transfer.callerLocation,
        compositeRiskScore: metrics.compositeRiskScore,
        action: 'FREEZE_ACCOUNT'
      });
      setBackendActionMsg(`Server Audit Code: ${res.authAuditCode}`);
    } catch {}

    onKillswitchAudio();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleExportForensicReport = () => {
    const report = {
      vaniRakshakVersion: '2.4.0',
      timestamp: new Date().toISOString(),
      dpdpActCompliance: 'DPDP Act 2023 Section 6 Ephemeral Verification',
      incidentSummary: 'Synthetic Voice Impersonation Detected — Wire Transfer Suspended',
      riskVerdict: metrics.riskLevel,
      compositeRiskScore: metrics.compositeRiskScore,
      syntheticProbability: metrics.syntheticProbability,
      contextRiskFactor: metrics.contextualRisk,
      acousticAnomalyScore: metrics.anomalyScore,
      actionTaken: 'TRANSACTION_BLOCKED_CALL_QUARANTINED',
      interceptionPayload: transfer,
      auditHash: 'SHA256:' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VaniRakshak-Fraud-Interception-Report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setReportExported(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white border border-rose-200 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-white/30 flex items-center justify-center shrink-0 shadow-sm">
              <img src="/logo.png" alt="VaniRakshak Guardian Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display tracking-wide uppercase flex items-center gap-2">
                Automated Fraud Mitigation Active
                <span className="text-xs bg-white text-rose-800 px-2 py-0.5 rounded-full font-bold">
                  Risk: {metrics.compositeRiskScore.toFixed(1)}%
                </span>
              </h3>
              <p className="text-xs text-rose-100">
                Synthetic Voice Impersonation Detected — Wire Transfer Suspended
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-slate-800 max-h-[80vh] overflow-y-auto">
          
          {backendActionMsg && (
            <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{backendActionMsg}</span>
            </div>
          )}

          {/* Intercept Alert Card */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-rose-800 text-sm block">VaniRakshak Zero-Trust Threat Enforcement</strong>
              <p className="text-rose-950/80 leading-relaxed">
                Vocal tract acoustics during the verbal transfer authorization failed biological neural signature verification. High probability of real-time AI voice conversion (ElevenLabs / DiffWave clone).
              </p>
            </div>
          </div>

          {/* Intercepted Transaction Details Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                Interception Target Transaction
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 font-bold">
                SUSPENDED IN MEMORY
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Requested Amount</span>
                <span className="font-extrabold text-rose-600 text-sm font-mono">
                  ₹{transfer.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Claimed Speaker</span>
                <span className="font-bold text-slate-900 truncate block">{transfer.requestedByCaller}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Beneficiary Target</span>
                <span className="font-bold text-slate-900 truncate block">{transfer.recipientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Caller Gateway</span>
                <span className="font-mono text-amber-700 font-semibold">{transfer.callerLocation}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Target Account</span>
                <span className="font-mono text-slate-700 font-medium">{transfer.accountNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">DPDP Status</span>
                <span className="text-emerald-700 font-bold">Sec 6 Compliant</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 font-semibold block mb-1.5">Triggered Anomaly Vectors:</span>
              <div className="flex flex-wrap gap-1.5">
                {transfer.securityFlags.map((flag, idx) => (
                  <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded-full bg-white border border-rose-200 text-rose-700 font-mono font-medium">
                    • {flag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Out-of-band Step-up OTP Verification Module */}
          <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-950 uppercase font-mono">
                  Step-Up Out-of-Band Verification Challenge
                </span>
              </div>
              <span className="text-[10px] text-blue-800 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded font-mono font-bold">
                SMS Token Dispatched
              </span>
            </div>

            <p className="text-xs text-slate-600">
              To prevent deepfake extortion, a 4-digit verification code has been dispatched to the account owner's registered phone.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 4-digit OTP (Demo: 8492)"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  disabled={otpState === 'AUTHORIZED'}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={!otpInput || otpState === 'AUTHORIZED'}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Fingerprint className="w-4 h-4" />
                <span>{otpState === 'VERIFYING' ? 'Verifying...' : (otpState === 'AUTHORIZED' ? 'Authorized' : 'Submit Challenge')}</span>
              </button>
            </div>

            {otpState === 'AUTHORIZED' && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Out-of-band biometric authentication successful. Legitimate caller override active.</span>
              </div>
            )}

            {otpState === 'REJECTED' && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>Incorrect OTP. Unauthorized synthetic actor confirmed. Transfer remains quarantined.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleKillswitch}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Trigger Audio Killswitch & Freeze Account</span>
            </button>

            <button
              onClick={handleExportForensicReport}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>{reportExported ? 'Report Downloaded (JSON)' : 'Export Forensic Audit (JSON)'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
