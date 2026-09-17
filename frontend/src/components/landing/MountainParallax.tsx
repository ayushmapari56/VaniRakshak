import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';

interface MountainParallaxProps {
  onStart: () => void;
  onExplore: () => void;
}

export const MountainParallax: React.FC<MountainParallaxProps> = ({ onStart, onExplore }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full h-[85vh] sm:h-[92vh] min-h-[640px] max-h-[920px] overflow-hidden bg-gradient-to-b from-[#e8f1f8] via-[#dce8f3] to-white flex flex-col justify-between select-none">
      
      {/* 1. Sky & Cyber Sun Atmosphere Layer (Parallax 0.1x) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.12}px, 0)` }}
      >
        {/* Soft Ambient Radial Sun Glow */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full bg-gradient-to-br from-blue-300/40 via-cyan-200/30 to-transparent blur-3xl" />
        
        {/* Distant Birds / Acoustic Signal Particles */}
        <div className="absolute top-[18%] left-[22%] w-2 h-2 rounded-full bg-blue-400/50 blur-[1px] animate-soft-pulse" />
        <div className="absolute top-[14%] right-[28%] w-1.5 h-1.5 rounded-full bg-indigo-400/40 blur-[1px]" />
        <div className="absolute top-[24%] right-[18%] w-3 h-3 rounded-full bg-cyan-300/60 blur-[2px]" />
      </div>

      {/* 2. Distant Deep Himalayan Peaks Layer (Parallax 0.22x) */}
      <div 
        className="absolute bottom-0 left-0 right-0 w-full pointer-events-none will-change-transform z-10"
        style={{ transform: `translate3d(0, ${scrollY * 0.22}px, 0)` }}
      >
        <svg 
          viewBox="0 0 1440 460" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block min-w-[1000px] opacity-70"
          preserveAspectRatio="none"
        >
          {/* Back Mountain Silhouette with subtle gradient */}
          <path 
            d="M0,460 L0,220 L160,140 L340,240 L520,90 L720,230 L890,110 L1080,260 L1260,130 L1440,210 L1440,460 Z" 
            fill="url(#back-mountains-grad)" 
          />
          <defs>
            <linearGradient id="back-mountains-grad" x1="720" y1="90" x2="720" y2="460" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.85" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3. Mid-range Mountain Ridge Layer with Soundwave Topography (Parallax 0.42x) */}
      <div 
        className="absolute bottom-0 left-0 right-0 w-full pointer-events-none will-change-transform z-20"
        style={{ transform: `translate3d(0, ${scrollY * 0.42}px, 0)` }}
      >
        <svg 
          viewBox="0 0 1440 420" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block min-w-[1000px] opacity-85"
          preserveAspectRatio="none"
        >
          {/* Mid Mountain Silhouette */}
          <path 
            d="M0,420 L0,280 L220,180 L440,310 L680,140 L920,280 L1180,160 L1440,260 L1440,420 Z" 
            fill="url(#mid-mountains-grad)" 
          />

          {/* Soundwave Contour Lines along the Ridge (Symbolizing Vani / Voice Signals) */}
          <path 
            d="M0,280 Q220,180 440,310 T680,140 T920,280 T1180,160 T1440,260" 
            stroke="rgba(2, 132, 199, 0.4)" 
            strokeWidth="2" 
            fill="none"
          />
          <path 
            d="M0,295 Q220,195 440,325 T680,155 T920,295 T1180,175 T1440,275" 
            stroke="rgba(14, 165, 233, 0.25)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            fill="none"
          />
          
          <defs>
            <linearGradient id="mid-mountains-grad" x1="720" y1="140" x2="720" y2="420" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#64748b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#334155" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Foreground Foothills & Mist Transition Layer (Parallax 0.65x) */}
      <div 
        className="absolute bottom-0 left-0 right-0 w-full pointer-events-none will-change-transform z-30"
        style={{ transform: `translate3d(0, ${scrollY * 0.65}px, 0)` }}
      >
        <svg 
          viewBox="0 0 1440 320" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block min-w-[1000px]"
          preserveAspectRatio="none"
        >
          {/* Front Rocky Ridge */}
          <path 
            d="M0,320 L0,190 L180,240 L380,130 L640,230 L880,110 L1120,220 L1320,150 L1440,210 L1440,320 Z" 
            fill="url(#front-mountains-grad)" 
          />
          
          {/* Acoustic Crest Neon Line */}
          <path 
            d="M0,190 L180,240 L380,130 L640,230 L880,110 L1120,220 L1320,150 L1440,210" 
            stroke="rgba(56, 189, 248, 0.6)" 
            strokeWidth="2.5" 
            fill="none" 
          />

          <defs>
            <linearGradient id="front-mountains-grad" x1="720" y1="110" x2="720" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient Mist Gradient Fading Downward to White Content Card */}
        <div className="w-full h-16 sm:h-24 bg-gradient-to-b from-transparent via-white/80 to-white -mt-1" />
      </div>

      {/* 5. Hero Foreground Content (Floating Over Mountain Scene) */}
      <div 
        className="relative z-40 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 text-center space-y-6 will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollY * 0.3}px, 0)`,
          opacity: Math.max(0, 1 - scrollY / 550)
        }}
      >
        {/* Logo Guardian Avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl overflow-hidden bg-white/95 p-1.5 shadow-2xl border border-white backdrop-blur-md animate-soft-pulse">
          <img src="/logo.png" alt="VaniRakshak Guardian Logo" className="w-full h-full object-contain" />
        </div>

        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-300 text-slate-800 text-xs font-semibold shadow-md font-body">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Acoustic Invariance & Real-Time Threat Interception</span>
          <span className="text-slate-400">•</span>
          <span className="text-blue-700 font-bold">DPDP 2023</span>
        </div>


        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading text-slate-900 leading-[1.08] drop-shadow-xs">
          Guard Every Voice. <br />
          <span className="gradient-text">Stop AI Impersonation.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-700 max-w-3xl mx-auto font-body leading-relaxed font-normal drop-shadow-xs">
          <strong>VaniRakshak</strong> is India’s edge-first real-time synthetic voice deepfake detection & wire fraud mitigation platform. Sub-50ms latency with ₹0.00 cloud compute cost.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base shadow-xl shadow-slate-900/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95 font-body cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-cyan-300" />
            <span>Let's Start Live Detection</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/90 hover:bg-white text-slate-800 font-bold text-base border border-slate-300/80 shadow-md backdrop-blur-md transition-all flex items-center justify-center gap-2 font-body cursor-pointer"
          >
            <span>Explore Architecture</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Floating Scroll Indicator at bottom */}
      <div 
        onClick={onExplore}
        className="relative z-40 mb-6 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
      >
        <span className="text-[11px] font-mono uppercase tracking-widest font-bold">Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>

    </div>
  );
};
