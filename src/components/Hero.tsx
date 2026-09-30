import React from 'react';
import { ArrowRight, MapPin, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../data/gymData';

interface HeroProps {
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPrimaryCta, onSecondaryCta }) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-neutral-950">
      {/* Background Graphic & Subtle Glow Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep red atmospheric gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-950/20 blur-[130px] rounded-full" />
        <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-red-900/10 blur-[110px] rounded-full" />
        
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ambient background fitness silhouette / overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust & Location Signal Kicker */}
        <div className="inline-flex items-center gap-2 mb-6 text-xs uppercase tracking-widest text-neutral-400 font-semibold">
          <span className="flex items-center gap-1 text-red-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>30-DAY FITNESS CHALLENGE</span>
          </span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span className="flex items-center gap-1 text-neutral-300">
            <MapPin className="w-3 h-3 text-red-500" />
            <span>HSR Layout, Bengaluru</span>
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[1.08] mb-6">
          Start Your Fitness Journey <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-red-500">
            With IronFit
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed font-normal mb-8">
          A structured 30-Day Fitness Challenge for people who want to improve their fitness, build consistency, lose weight, build muscle, or get stronger — with professional guidance at IronFit Fitness Studio in HSR Layout.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-8">
          <button
            onClick={onPrimaryCta}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-base px-8 py-4 rounded shadow-xl shadow-red-950/60 transition-all transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 cursor-pointer"
          >
            <span>{BUSINESS_INFO.campaign.primaryCta}</span>
            <ArrowRight className="w-5 h-5 text-white/90" />
          </button>
          
          <button
            onClick={onSecondaryCta}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-base px-7 py-4 rounded border border-neutral-700/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 cursor-pointer"
          >
            <span>{BUSINESS_INFO.campaign.secondaryCta}</span>
          </button>
        </div>

        {/* Microcopy & Trust Metadata */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>Located in HSR Layout, Bengaluru</span>
          </div>
          <span aria-hidden="true" className="hidden sm:inline text-neutral-700">·</span>
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-semibold text-white">4.8 / 5 Google Rating</span>
            <span className="text-neutral-500">(320+ Reviews)</span>
          </div>
          <span aria-hidden="true" className="hidden sm:inline text-neutral-700">·</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Structured Guidance & Beginners Welcome</span>
          </div>
        </div>
      </div>
    </section>
  );
};
