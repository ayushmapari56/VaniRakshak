from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

from .api.endpoints import stream, analysis, wire_transfer, forensics

app = FastAPI(
    title="VaniRakshak Voice Deepfake Defense API",
    description="Real-Time AI Voice Deepfake Defense & Dynamic Fraud Interception System (DPDP Act 2023 Compliant)",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(stream.router, prefix="", tags=["WebSocket Stream"])
app.include_router(analysis.router, prefix="/api", tags=["Audio Analysis & Presets"])
app.include_router(wire_transfer.router, prefix="/api/wire-transfer", tags=["Wire Transfer Interceptor"])
app.include_router(forensics.router, prefix="/api/forensics", tags=["Forensic Reports"])

@app.get("/")
async def root():
    return {
        "service": "VaniRakshak AI Voice Defense Engine",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "uptime": "100%",
        "timestamp": int(time.time() * 1000),
        "engine": "FastAPI + NumPy Audio DSP",
        "dpdpSection6": "ENFORCED"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
