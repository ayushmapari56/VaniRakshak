import React, { useRef, useEffect, useState } from 'react';
import { Activity, Radio, Zap, AlertTriangle } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';
import type { RiskLevel } from '../../types';

interface AudioCanvasProps {
  timeData: Uint8Array;
  freqData: Uint8Array;
  isStreaming: boolean;
  vadActive: boolean;
  volumeDb: number;
  riskLevel: RiskLevel;
  vocoderCutoffKhz: number;
}

export const AudioCanvas: React.FC<AudioCanvasProps> = ({
  isStreaming,
  vadActive,
  volumeDb,
  riskLevel,
  vocoderCutoffKhz
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'dual' | 'spectrogram' | 'waveform'>('dual');
  
  // Offscreen canvas for continuous smooth rolling spectrogram history
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Reusable local typed buffers for canvas RAF loop
  const localTimeBufRef = useRef<Uint8Array>(new Uint8Array(1024));
  const localFreqBufRef = useRef<Uint8Array>(new Uint8Array(512));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create / ensure offscreen canvas for rolling spectrogram blitting
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
      offscreenCanvasRef.current.width = 800;
      offscreenCanvasRef.current.height = 400;
      const offCtx = offscreenCanvasRef.current.getContext('2d');
      if (offCtx) {
        offCtx.fillStyle = '#070b14';
        offCtx.fillRect(0, 0, 800, 400);
      }
    }

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep forensic canvas background
      ctx.fillStyle = '#070b14';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle technical background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Sample real audio analyser node if active
      const analyser = audioEngine.getAnalyser();
      const timeBuf = localTimeBufRef.current;
      const freqBuf = localFreqBufRef.current;

      if (analyser && isStreaming) {
        analyser.getByteTimeDomainData(timeBuf as any);
        analyser.getByteFrequencyData(freqBuf as any);
      } else {
        timeBuf.fill(128);
        freqBuf.fill(0);
      }

      // Render selected visualization mode
      if (viewMode === 'dual') {
        const waveHeight = Math.floor(height * 0.40);
        const specY = waveHeight;
        const specHeight = height - waveHeight;

        drawWaveform(ctx, 0, 0, width, waveHeight, timeBuf);
        drawSpectrogram(ctx, 0, specY, width, specHeight, freqBuf);

        // Technical divider line
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, specY);
        ctx.lineTo(width, specY);
        ctx.stroke();

        // Divider mode labels
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText('OSCILLOSCOPE WAVEFORM (16 kHz PCM)', 12, specY - 6);
        ctx.fillText('ROLLING FFT SPECTROGRAM (0–8 kHz)', 12, specY + 14);

        // Vocoder cutoff overlay line if detected
        renderVocoderCutoffLine(ctx, 0, specY, width, specHeight);

      } else if (viewMode === 'spectrogram') {
        drawSpectrogram(ctx, 0, 0, width, height, freqBuf);
        renderVocoderCutoffLine(ctx, 0, 0, width, height);

        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText('FULL-SPECTRUM ROLLING FFT SPECTROGRAM (0–8 kHz)', 12, 16);

      } else {
        drawWaveform(ctx, 0, 0, width, height, timeBuf);

        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText('HIGH-RESOLUTION OSCILLOSCOPE TIME DOMAIN (16 kHz PCM)', 12, 16);
      }

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [viewMode, isStreaming, riskLevel, vocoderCutoffKhz]);

  // Render Oscilloscope Waveform
  const drawWaveform = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    timeData: Uint8Array
  ) => {
    const centerY = y + h / 2;

    // Center baseline
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, centerY);
    ctx.lineTo(x + w, centerY);
    ctx.stroke();

    if (!isStreaming) {
      // Standby clean flat line
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, centerY);
      ctx.lineTo(x + w, centerY);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText('STANDBY: INGESTION PIPELINE READY', x + w / 2 - 100, centerY - 10);
      return;
    }

    const waveColor = riskLevel === 'CRITICAL' ? '#f43f5e' : (riskLevel === 'SUSPICIOUS' ? '#f59e0b' : '#38bdf8');
    const glowColor = riskLevel === 'CRITICAL' ? 'rgba(244, 63, 94, 0.35)' : (riskLevel === 'SUSPICIOUS' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(56, 189, 248, 0.35)');

    ctx.save();
    
    // Waveform glow pass
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    const sliceWidth = w / timeData.length;
    for (let i = 0; i < timeData.length; i++) {
      const v = (timeData[i] - 128) / 128;
      const posY = centerY + v * (h * 0.42);
      if (i === 0) ctx.moveTo(x + i * sliceWidth, posY);
      else ctx.lineTo(x + i * sliceWidth, posY);
    }
    ctx.stroke();

    // Sharp foreground wave
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Subtle area fill under wave
    ctx.lineTo(x + w, centerY);
    ctx.lineTo(x, centerY);
    ctx.fillStyle = riskLevel === 'CRITICAL' ? 'rgba(244, 63, 94, 0.05)' : 'rgba(56, 189, 248, 0.05)';
    ctx.fill();

    ctx.restore();
  };

  // Render Rolling FFT Spectrogram
  const drawSpectrogram = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    freqData: Uint8Array
  ) => {
    const offCanvas = offscreenCanvasRef.current;
    if (!offCanvas) return;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    const offW = offCanvas.width;
    const offH = offCanvas.height;

    if (isStreaming) {
      // Step 1: Shift offscreen canvas left by 2px (Rolling continuous time scroll)
      const scrollSpeed = 2;
      offCtx.drawImage(offCanvas, scrollSpeed, 0, offW - scrollSpeed, offH, 0, 0, offW - scrollSpeed, offH);

      // Step 2: Render new frequency column on rightmost edge
      const colX = offW - scrollSpeed;
      const binCount = Math.min(256, freqData.length);

      for (let j = 0; j < binCount; j++) {
        const val = freqData[j] / 255;
        const binY = offH - (j / binCount) * offH;
        const binHeight = Math.ceil(offH / binCount) + 1;

        // Forensic color palette (Deep Navy -> Cyan -> Purple -> Amber/Gold)
        let r = 7, g = 11, b = 20; // Background base
        if (val > 0.05) {
          if (val < 0.25) {
            // Low energy: Indigo/Blue
            const t = (val - 0.05) / 0.2;
            r = Math.floor(10 + t * 20);
            g = Math.floor(20 + t * 80);
            b = Math.floor(60 + t * 180);
          } else if (val < 0.55) {
            // Speech harmonics: Bright Cyan
            const t = (val - 0.25) / 0.3;
            r = Math.floor(30 + t * 20);
            g = Math.floor(100 + t * 120);
            b = Math.floor(240 + t * 15);
          } else if (val < 0.8) {
            // Strong formant resonance: Electric Purple/Pink
            const t = (val - 0.55) / 0.25;
            r = Math.floor(50 + t * 180);
            g = Math.floor(220 * (1 - t * 0.6));
            b = Math.floor(255 * (1 - t * 0.2));
          } else {
            // Peak energy bursts: Gold / Amber
            const t = (val - 0.8) / 0.2;
            r = 255;
            g = Math.floor(140 + t * 115);
            b = Math.floor(50 + t * 150);
          }
        }

        offCtx.fillStyle = `rgb(${r},${g},${b})`;
        offCtx.fillRect(colX, binY - binHeight, scrollSpeed, binHeight);
      }
    }

    // Blit offscreen rolling spectrogram onto the main canvas
    ctx.drawImage(offCanvas, 0, 0, offW, offH, x, y, w, h);

    // Overlay frequency ticks and labels
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '9px JetBrains Mono, monospace';
    const freqs = ['8 kHz', '6 kHz', '4 kHz', '2 kHz', '0 Hz'];
    for (let i = 0; i < freqs.length; i++) {
      const fy = y + (i / (freqs.length - 1)) * (h - 16) + 12;
      ctx.fillText(freqs[i], x + w - 38, fy);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(x + w - 44, fy - 3);
      ctx.lineTo(x + w, fy - 3);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Render Vocoder Cutoff Overlay Line
  const renderVocoderCutoffLine = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    if (vocoderCutoffKhz < 10) {
      const cutoffRatio = Math.max(0.1, Math.min(0.9, vocoderCutoffKhz / 16));
      const lineY = y + h * (1 - cutoffRatio);

      ctx.save();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.9)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(x, lineY);
      ctx.lineTo(x + w, lineY);
      ctx.stroke();

      ctx.fillStyle = 'rgba(244, 63, 94, 0.95)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(
        `⚠️ NEURAL VOCODER CUTOFF: ${vocoderCutoffKhz.toFixed(1)} kHz (HiFi-GAN / DiffWave Truncation)`,
        x + 12,
        lineY - 6
      );
      ctx.restore();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 flex flex-col gap-3.5 border border-slate-200 shadow-xs">
      
      {/* Top Controls & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-wide font-heading flex items-center gap-2">
              Real-Time Signal Canvas
              <span className="text-[10px] text-blue-700 font-semibold px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-md font-mono">
                16 kHz PCM / 60 FPS
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-body">
              Live Spectral Mel-Decomposition & High-Frequency Vocoder Boundary Analysis
            </p>
          </div>
        </div>

        {/* Live VAD & Level Indicators */}
        <div className="flex items-center gap-2.5">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono border transition-all ${
            vadActive
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <Radio className={`w-3.5 h-3.5 ${vadActive ? 'animate-pulse text-emerald-600' : 'text-slate-400'}`} />
            <span>VAD: {vadActive ? 'VOICE ACTIVE' : 'SILENT GAP'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
            <span className="text-slate-400 text-[10px]">RMS</span>
            <span className="font-semibold">{isStreaming ? (volumeDb > -90 ? `${volumeDb} dB` : '-∞ dB') : '-∞ dB'}</span>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('dual')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'dual' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dual
            </button>
            <button
              onClick={() => setViewMode('spectrogram')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'spectrogram' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Spectrogram
            </button>
            <button
              onClick={() => setViewMode('waveform')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'waveform' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Waveform
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Display with Dark Display Interior for Spectral Contrast */}
      <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-slate-900 bg-[#070b14] shadow-inner">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Telemetry Bar at bottom of canvas */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] font-mono text-slate-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-cyan-400 font-semibold">
              <Zap className="w-3 h-3" /> Ring Buffer: 4.0s (50% Overlap)
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">FFT: 1024-pt Hann Window</span>
          </div>

          <div className="flex items-center gap-2">
            {vocoderCutoffKhz < 10 ? (
              <span className="flex items-center gap-1 text-rose-400 font-bold animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> High-Freq Cutoff ({vocoderCutoffKhz.toFixed(1)} kHz)
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Natural Harmonic Spectrum (16 kHz Full-Band)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ephemeral Memory Explainer */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1 font-body">
        <span>⚡ <strong>Section 6 DPDP Compliance</strong>: Sliding audio memory frames are overwritten every 2000ms with zero persistent disk writes.</span>
        <span className="font-mono text-blue-600 font-semibold">Client Memory: ~4.2 MB RAM</span>
      </div>

    </div>
  );
};
