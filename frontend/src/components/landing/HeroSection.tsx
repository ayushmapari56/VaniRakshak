import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Lock, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart, onExplore }) => {
  return (
    <section 
      className="relative min-h-[calc(100vh-72px)] min-h-[640px] flex items-center bg-white bg-no-repeat bg-cover bg-[position:75%_center] lg:bg-center border-b border-slate-200/80 overflow-hidden"
      style={{
        backgroundImage: `url('/hero-banner.png')`
      }}
    >
      {/* Subtle responsive gradient overlay on mobile/tablet to ensure text readability while keeping the robot crisp */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent lg:from-white/70 lg:via-white/20 lg:to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10 w-full">
        <div className="max-w-2xl space-y-7 text-left">
          
          {/* Live Security Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-orange-200 text-orange-900 text-xs font-bold font-body shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 -ml-5" />
            <span>AI Voice Deepfake & Wire Fraud Interception</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.12]">
            Real-Time Defense Against{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              Synthetic Voice
            </span>{' '}
            Fraud.
          </h1>

          {/* Body Description */}
          <p className="text-base sm:text-lg text-slate-700 font-body leading-relaxed font-normal bg-white/40 lg:bg-transparent backdrop-blur-xs lg:backdrop-blur-none p-2 rounded-xl">
            <strong className="text-slate-900 font-semibold font-heading">VaniRakshak (वाणी रक्षक)</strong> is an edge-native AI voice defense platform that inspects acoustic vocoder artifacts, micro-pauses, and phase anomalies to stop clone impersonation scams before wire transfers are approved.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStart}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95 font-body cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Let's Start</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExplore}
              className="px-7 py-4 rounded-2xl bg-white/90 hover:bg-white text-slate-800 font-bold text-sm sm:text-base border border-slate-300/80 shadow-md hover:border-slate-400 flex items-center gap-2 transition-all font-body cursor-pointer backdrop-blur-sm"
            >
              <span>Explore More</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left font-body">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs p-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-slate-800 font-semibold">DPDP Act Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs p-2 rounded-xl">
              <Zap className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="text-xs text-slate-800 font-semibold">&lt; 50ms Edge Latency</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs p-2 rounded-xl">
              <Lock className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-xs text-slate-800 font-semibold">₹0.00 Compute Cost</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
