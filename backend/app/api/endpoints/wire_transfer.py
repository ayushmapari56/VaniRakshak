from fastapi import APIRouter, HTTPException
import uuid
import datetime
import hashlib

from ...models.schemas import WireTransferRequest, WireTransferResponse

router = APIRouter()

@router.post("/intercept", response_model=WireTransferResponse)
async def process_wire_intercept(request: WireTransferRequest):
    """
    Simulate banking API gateway hook for real-time sub-500ms wire transfer intercept,
    generating biometric freeze, out-of-band OTP challenges, or account freeze locks.
    """
    timestamp_str = datetime.datetime.now(datetime.timezone.utc).isoformat()

    # Generate audit hash
    raw_sig = f"{request.transactionId}:{request.amount}:{request.compositeRiskScore}:{timestamp_str}"
    audit_code = "TX-SEC-" + hashlib.sha256(raw_sig.encode()).hexdigest()[:12].upper()

    security_flags = []
    if request.compositeRiskScore >= 75.0:
        security_flags.append("VOICE_DEEPFAKE_PROBABILITY_EXCEEDED_THRESHOLD")
    if request.amount > 100000:
        security_flags.append("HIGH_VALUE_TRANSACTION_ALERT")

    status = 'PENDING'
    action_taken = ''

    if request.action == 'FREEZE_ACCOUNT':
        status = 'BLOCKED_FRAUD'
        action_taken = f"Account and transaction {request.transactionId} frozen immediately. Cyber cell notification dispatched."
        security_flags.append("ACCOUNT_LOCKED_FRAUD_PREVENTION")
    elif request.action == 'CHALLENGE_OTP':
        status = 'OTP_CHALLENGE'
        action_taken = f"Out-of-band biometric challenge dispatched to verified customer mobile device."
        security_flags.append("OOB_STEP_UP_OTP_DISPATCHED")
    elif request.action == 'INTERCEPT':
        status = 'INTERCEPTED_SUSPENDED'
        action_taken = f"Wire transfer of ₹{request.amount:,.2f} paused by VaniRakshak sub-500ms automated killswitch."
        security_flags.append("SUB_500MS_KILLSWITCH_TRIGGERED")
    elif request.action == 'AUTHORIZE':
        status = 'AUTHORIZED'
        action_taken = f"Transaction cleared following manual secondary human verification override."
        security_flags.append("MANUAL_ANALYST_OVERRIDE")

    return WireTransferResponse(
        transactionId=request.transactionId,
        status=status,
        actionTaken=action_taken,
        authAuditCode=audit_code,
        timestamp=timestamp_str,
        securityFlags=security_flags
    )
