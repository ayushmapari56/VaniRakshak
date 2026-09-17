import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
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

  const handleVerifyOtp = () => {
    setOtpState('VERIFYING');
    setTimeout(() => {
      if (otpInput === '8492' || otpInput === '1234') {
        setOtpState('AUTHORIZED');
      } else {
        setOtpState('REJECTED');
      }
    }, 900);
  };

  const handleKillswitch = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-rose-500/50 rounded-2xl shadow-2xl overflow-hidden glass-panel-danger glow-red">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-rose-900/90 via-rose-800 to-red-950 px-6 py-4 flex items-center justify-between border-b border-rose-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-200 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-display tracking-wide uppercase flex items-center gap-2">
                Automated Fraud Mitigation Active
                <span className="text-xs bg-rose-950 border border-rose-400/50 text-rose-200 px-2 py-0.5 rounded-full">
                  Risk: {metrics.compositeRiskScore.toFixed(1)}%
                </span>
              </h3>
              <p className="text-xs text-rose-200/90">
                Synthetic Voice Impersonation Detected — Financial Wire Transfer Suspended
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-slate-200 max-h-[80vh] overflow-y-auto">
          
          {/* Intercept Alert Card */}
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-rose-200 text-sm block">VaniRakshak Zero-Trust Threat Enforcement</strong>
              <p className="text-slate-300 leading-relaxed">
                Vocal tract acoustics during the verbal transfer authorization failed biological neural signature verification. High probability of real-time AI voice conversion (ElevenLabs / DiffWave clone).
              </p>
            </div>
          </div>

          {/* Intercepted Transaction Details Card */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                Interception Target Transaction
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                SUSPENDED IN MEMORY
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Requested Amount</span>
                <span className="font-bold text-rose-400 text-sm font-mono">
                  ₹{transfer.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Claimed Speaker</span>
                <span className="font-semibold text-white truncate block">{transfer.requestedByCaller}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Beneficiary Target</span>
                <span className="font-semibold text-white truncate block">{transfer.recipientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Caller Gateway</span>
                <span className="font-mono text-amber-300">{transfer.callerLocation}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Target Account</span>
                <span className="font-mono text-slate-300">{transfer.accountNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">DPDP Status</span>
                <span className="text-emerald-400 font-medium">Sec 6 Compliant</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Triggered Anomaly Vectors:</span>
              <div className="flex flex-wrap gap-1.5">
                {transfer.securityFlags.map((flag, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-rose-500/40 text-rose-300 font-mono">
                    • {flag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Out-of-band Step-up OTP Verification Module */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase font-mono">
                  Step-Up Out-of-Band Verification Challenge
                </span>
              </div>
              <span className="text-[10px] text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                SMS Token Dispatched
              </span>
            </div>

            <p className="text-xs text-slate-300">
              To prevent deepfake extortion, an urgent 4-digit verification code has been dispatched to the account owner's registered primary device.
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={!otpInput || otpState === 'AUTHORIZED'}
                className="w-full sm:w-auto px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Fingerprint className="w-4 h-4" />
                <span>{otpState === 'VERIFYING' ? 'Verifying...' : (otpState === 'AUTHORIZED' ? 'Authorized' : 'Submit Challenge')}</span>
              </button>
            </div>

            {otpState === 'AUTHORIZED' && (
              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Out-of-band biometric authentication successful. Legitimate caller override active.</span>
              </div>
            )}

            {otpState === 'REJECTED' && (
              <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Incorrect OTP. Unauthorized synthetic actor confirmed. Transfer remains quarantined.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleKillswitch}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all glow-red"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Trigger Audio Killswitch & Freeze Account</span>
            </button>

            <button
              onClick={handleExportForensicReport}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{reportExported ? 'Report Downloaded (JSON)' : 'Export Forensic Audit (JSON)'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
