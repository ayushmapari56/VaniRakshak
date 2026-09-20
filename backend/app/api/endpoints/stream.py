from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import numpy as np
import base64
from typing import Dict, Any

from ...services.dsp_engine import dsp_engine

router = APIRouter()

@router.websocket("/ws/audio-stream")
async def audio_stream_websocket(websocket: WebSocket):
    await websocket.accept()
    context_modifiers = {
        "unverifiedGateway": False,
        "highAmountRisk": False,
        "callerAnomalous": False
    }

    try:
        while True:
            # Receive either binary PCM audio or JSON message with base64 PCM / context updates
            message = await websocket.receive()

            if "bytes" in message and message["bytes"]:
                raw_bytes = message["bytes"]
                # Convert raw byte buffer (e.g. 16-bit PCM or 8-bit time-domain buffer)
                audio_np = np.frombuffer(raw_bytes, dtype=np.uint8)
                metrics, breakdown, vad_active, volume_db = dsp_engine.analyze_pcm_frame(
                    audio_np, 
                    sample_rate=16000, 
                    context_modifiers=context_modifiers
                )
                
                response_payload = {
                    "type": "METRICS_UPDATE",
                    "metrics": metrics.model_dump(),
                    "breakdown": breakdown.model_dump(),
                    "vadActive": vad_active,
                    "volumeDb": volume_db
                }
                await websocket.send_text(json.dumps(response_payload))

            elif "text" in message and message["text"]:
                data = json.loads(message["text"])
                msg_type = data.get("type", "FRAME")

                if msg_type == "CONTEXT_UPDATE":
                    context_modifiers["unverifiedGateway"] = bool(data.get("unverifiedGateway", False))
                    context_modifiers["highAmountRisk"] = bool(data.get("highAmountRisk", False))
                    context_modifiers["callerAnomalous"] = bool(data.get("callerAnomalous", False))
                    await websocket.send_text(json.dumps({
                        "type": "CONTEXT_ACK",
                        "context": context_modifiers
                    }))

                elif msg_type == "PCM_CHUNK":
                    # Base64 encoded uint8 / float32 array
                    b64_data = data.get("data", "")
                    raw_bytes = base64.b64decode(b64_data)
                    audio_np = np.frombuffer(raw_bytes, dtype=np.uint8)

                    metrics, breakdown, vad_active, volume_db = dsp_engine.analyze_pcm_frame(
                        audio_np, 
                        sample_rate=16000, 
                        context_modifiers=context_modifiers
                    )

                    response_payload = {
                        "type": "METRICS_UPDATE",
                        "metrics": metrics.model_dump(),
                        "breakdown": breakdown.model_dump(),
                        "vadActive": vad_active,
                        "volumeDb": volume_db
                    }
                    await websocket.send_text(json.dumps(response_payload))

                elif msg_type == "PING":
                    await websocket.send_text(json.dumps({"type": "PONG", "timestamp": data.get("timestamp")}))

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_text(json.dumps({"type": "ERROR", "message": str(e)}))
        except Exception:
            pass
