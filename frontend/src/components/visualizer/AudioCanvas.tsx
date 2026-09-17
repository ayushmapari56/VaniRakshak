import React, { useRef, useEffect, useState } from 'react';
import { Activity, Radio, Zap, AlertTriangle } from 'lucide-react';
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
  timeData,
  freqData,
  isStreaming,
  vadActive,
  volumeDb,
  riskLevel,
  vocoderCutoffKhz
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'dual' | 'spectrogram' | 'waveform'>('dual');
  const spectrogramHistoryRef = useRef<Uint8Array[]>([]);

  useEffect(() => {
    if (isStreaming && freqData && freqData.length > 0) {
      const slice = new Uint8Array(freqData);
      spectrogramHistoryRef.current.push(slice);
      if (spectrogramHistoryRef.current.length > 120) {
        spectrogramHistoryRef.current.shift();
      }
    }
  }, [freqData, isStreaming]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // High contrast dark canvas background inside the clean white frame
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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

    if (viewMode === 'dual') {
      const midY = height * 0.45;
      drawSpectrogram(ctx, 0, 0, width, midY);
      drawWaveform(ctx, 0, midY, width, height - midY);

      ctx.strokeStyle = 'rgba(14, 165, 233, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();
    } else if (viewMode === 'spectrogram') {
      drawSpectrogram(ctx, 0, 0, width, height);
    } else {
      drawWaveform(ctx, 0, 0, width, height);
    }

    if (vocoderCutoffKhz < 10) {
      const cutoffRatio = Math.max(0.1, Math.min(0.9, vocoderCutoffKhz / 16));
      const targetCanvasHeight = viewMode === 'dual' ? height * 0.45 : (viewMode === 'spectrogram' ? height : 0);
      
      if (targetCanvasHeight > 0) {
        const lineY = targetCanvasHeight * (1 - cutoffRatio);
        
        ctx.save();
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.9)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();

        ctx.fillStyle = 'rgba(244, 63, 94, 0.95)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`⚠️ NEURAL VOCODER CUTOFF: ${vocoderCutoffKhz.toFixed(1)} kHz (HiFi-GAN / DiffWave)`, 12, lineY - 6);
        ctx.restore();
      }
    }

  }, [timeData, freqData, viewMode, isStreaming, riskLevel, vocoderCutoffKhz]);

  const drawWaveform = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const centerY = y + h / 2;

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, centerY);
    ctx.lineTo(x + w, centerY);
    ctx.stroke();

    if (!isStreaming || !timeData || timeData.length === 0) {
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const time = Date.now() / 300;
      for (let i = 0; i < w; i++) {
        const amp = Math.sin(i * 0.03 + time) * 8 * Math.cos(i * 0.01);
        if (i === 0) ctx.moveTo(x + i, centerY + amp);
        else ctx.lineTo(x + i, centerY + amp);
      }
      ctx.stroke();
      return;
    }

    const waveColor = riskLevel === 'CRITICAL' ? '#f43f5e' : (riskLevel === 'SUSPICIOUS' ? '#f59e0b' : '#0284c7');
    const glowColor = riskLevel === 'CRITICAL' ? 'rgba(244, 63, 94, 0.4)' : (riskLevel === 'SUSPICIOUS' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(2, 132, 199, 0.4)');

    ctx.save();
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    const sliceWidth = w / timeData.length;
    for (let i = 0; i < timeData.length; i++) {
      const v = (timeData[i] - 128) / 128;
      const posY = centerY + v * (h * 0.42);
      if (i === 0) ctx.moveTo(x + i * sliceWidth, posY);
      else ctx.lineTo(x + i * sliceWidth, posY);
    }
    ctx.stroke();

    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineTo(x + w, centerY);
    ctx.lineTo(x, centerY);
    ctx.fillStyle = riskLevel === 'CRITICAL' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(2, 132, 199, 0.08)';
    ctx.fill();
    ctx.restore();
  };

  const drawSpectrogram = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const history = spectrogramHistoryRef.current;
    if (history.length === 0) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText('Awaiting 16 kHz Audio Stream for Spectral Analysis...', x + 20, y + h / 2);
      return;
    }

    const columnWidth = w / 120;
    const binCount = Math.min(256, history[0].length);

    for (let i = 0; i < history.length; i++) {
      const colX = x + i * columnWidth;
      const bins = history[i];

      for (let j = 0; j < binCount; j++) {
        const val = bins[j] / 255;
        const binY = y + h - (j / binCount) * h;
        const binHeight = Math.ceil(h / binCount) + 1;

        let r = 0, g = 0, b = 0;
        if (val < 0.25) {
          b = Math.floor(val * 4 * 180);
          r = Math.floor(val * 4 * 40);
        } else if (val < 0.6) {
          const t = (val - 0.25) / 0.35;
          r = Math.floor(t * 30);
          g = Math.floor(t * 220);
          b = Math.floor(180 + t * 75);
        } else if (val < 0.85) {
          const t = (val - 0.6) / 0.25;
          r = Math.floor(30 + t * 225);
          g = Math.floor(220 + t * 35);
          b = Math.floor(255 * (1 - t));
        } else {
          const t = (val - 0.85) / 0.15;
          r = 255;
          g = Math.floor(255 * (1 - t * 0.7));
          b = Math.floor(t * 80);
        }

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(colX, binY - binHeight, Math.ceil(columnWidth) + 1, binHeight);
      }
    }

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '9px JetBrains Mono, monospace';
    const freqs = ['8 kHz', '6 kHz', '4 kHz', '2 kHz', '0 Hz'];
    for (let i = 0; i < freqs.length; i++) {
      const fy = y + (i / (freqs.length - 1)) * (h - 14) + 10;
      ctx.fillText(freqs[i], x + w - 38, fy);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(x + w - 44, fy - 3);
      ctx.lineTo(x + w, fy - 3);
      ctx.stroke();
    }
    ctx.restore();
  };

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 flex flex-col gap-3.5 border border-slate-200 shadow-sm">
      
      {/* Top Controls & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-wide font-display flex items-center gap-2">
              Real-Time Signal Canvas
              <span className="text-[10px] text-blue-700 font-semibold px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-md font-mono">
                16 kHz PCM / 60 FPS
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Live Spectral Mel-Decomposition & High-Frequency Vocoder Boundary Analysis
            </p>
          </div>
        </div>

        {/* Live VAD & Level Indicators */}
        <div className="flex items-center gap-2.5">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
            vadActive
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <Radio className={`w-3.5 h-3.5 ${vadActive ? 'animate-pulse text-emerald-600' : 'text-slate-400'}`} />
            <span>VAD: {vadActive ? 'VOICE ACTIVE' : 'SILENT GAP'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
            <span className="text-slate-400 text-[10px]">RMS</span>
            <span className="font-semibold">{isStreaming ? `${volumeDb} dB` : '-∞ dB'}</span>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('dual')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'dual' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dual
            </button>
            <button
              onClick={() => setViewMode('spectrogram')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'spectrogram' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Spectrogram
            </button>
            <button
              onClick={() => setViewMode('waveform')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'waveform' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Waveform
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Display with Dark Display Interior for Spectral Contrast */}
      <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-slate-900 bg-[#0a0f1d] shadow-inner">
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
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>⚡ <strong>Section 6 DPDP Compliance</strong>: Sliding audio memory frames are overwritten every 2000ms with zero persistent disk writes.</span>
        <span className="font-mono text-blue-600 font-semibold">Client Memory: ~4.2 MB RAM</span>
      </div>

    </div>
  );
};
