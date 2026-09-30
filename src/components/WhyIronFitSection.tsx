import React from 'react';
import { ArrowRight, Users, Dumbbell, Calendar, HeartHandshake, MapPin } from 'lucide-react';
import { BUSINESS_INFO, WHY_CHOOSE_IRONFIT } from '../data/gymData';

interface WhyIronFitSectionProps {
  onJoinClick: () => void;
}

export const WhyIronFitSection: React.FC<WhyIronFitSectionProps> = ({ onJoinClick }) => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Users className="w-5 h-5 text-red-500" />;
      case 1:
        return <Dumbbell className="w-5 h-5 text-red-500" />;
      case 2:
        return <Calendar className="w-5 h-5 text-red-500" />;
      case 3:
        return <HeartHandshake className="w-5 h-5 text-red-500" />;
      case 4:
      default:
        return <MapPin className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-3">
            THE IRONFIT DIFFERENCE
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-6">
            Why Train at IronFit?
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            IronFit Fitness Studio is a modern fitness centre in HSR Layout focused on helping members build strength, improve fitness, lose weight, and develop a consistent healthy lifestyle.
          </p>
        </div>

        {/* 5 Trust / Value Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {WHY_CHOOSE_IRONFIT.map((point, idx) => (
            <div
              key={idx}
              className={`bg-neutral-900/70 p-7 rounded border border-neutral-800/80 hover:border-neutral-700 transition-all ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="w-10 h-10 rounded bg-neutral-950 flex items-center justify-center mb-4 border border-neutral-800">
                {getIcon(idx)}
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div className="text-center">
          <button
            onClick={onJoinClick}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-base px-8 py-4 rounded shadow-xl shadow-red-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{BUSINESS_INFO.campaign.primaryCta}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};
