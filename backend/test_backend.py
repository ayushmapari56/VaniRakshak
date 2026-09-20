import urllib.request
import json
import sys

# Set standard output encoding
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_URL = "http://localhost:8000"

def test_health():
    with urllib.request.urlopen(f"{BASE_URL}/api/health") as response:
        data = json.loads(response.read().decode())
        assert data["status"] == "HEALTHY", f"Health status unexpected: {data}"
        print("[PASS] Health endpoint passed:", data)

def test_presets():
    with urllib.request.urlopen(f"{BASE_URL}/api/presets") as response:
        data = json.loads(response.read().decode())
        assert len(data) > 0, "No presets returned"
        print(f"[PASS] Presets endpoint passed: {len(data)} presets returned")

def test_regional_accents():
    with urllib.request.urlopen(f"{BASE_URL}/api/regional-accents") as response:
        data = json.loads(response.read().decode())
        assert len(data) > 0, "No accents returned"
        print(f"[PASS] Regional accents endpoint passed: {len(data)} accents returned")

def test_wire_intercept():
    payload = {
        "transactionId": "TXN-TEST-101",
        "amount": 150000.0,
        "recipientName": "Mule Corp",
        "recipientBank": "Test Bank",
        "accountNumber": "1234567890",
        "requestedByCaller": "Scammer Impersonation",
        "callerPhone": "+91 9999999999",
        "callerLocation": "Unknown VoIP",
        "compositeRiskScore": 88.5,
        "action": "FREEZE_ACCOUNT"
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/wire-transfer/intercept",
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        assert data["status"] == "BLOCKED_FRAUD", f"Unexpected status: {data}"
        print("[PASS] Wire Intercept endpoint passed:", data["actionTaken"])

def test_forensics():
    payload = {
        "callerIdentity": "Grandson Extortion Preset",
        "riskScore": 92.5,
        "riskVerdict": "CRITICAL",
        "syntheticProbability": 0.95,
        "breakdown": {
            "pitchStabilityIndex": 0.92,
            "spectralEnergyCutoffKhz": 7.4,
            "microPauseNaturalness": 22.0,
            "phaseCoherenceAnomaly": 84.0,
            "harmonicToNoiseRatioDb": 22.4,
            "detectedVocoder": "ElevenLabs Neural Turbo",
            "spectralRollOffPercentile": 62.0,
            "formantDistortionScore": 79.0
        },
        "mitigationActionTaken": "BLOCK_TRANSACTION"
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/forensics/generate-report",
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        assert data["reportId"].startswith("VR-REP-"), f"Unexpected report ID: {data}"
        assert data["dpdpAuditHash"].startswith("0x"), f"Unexpected hash: {data}"
        print("[PASS] Forensics report endpoint passed:", data["reportId"], "| Hash:", data["dpdpAuditHash"][:18] + "...")

if __name__ == "__main__":
    test_health()
    test_presets()
    test_regional_accents()
    test_wire_intercept()
    test_forensics()
    print("\n[ALL BACKEND ENDPOINTS PASSED VERIFICATION!]")
