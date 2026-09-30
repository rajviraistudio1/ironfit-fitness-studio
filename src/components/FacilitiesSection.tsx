import React from 'react';
import {
  Dumbbell,
  Activity,
  Weight,
  Flame,
  Users,
  DoorClosed,
  Lock,
  Droplets,
  Wind,
  Car,
  ArrowRight,
} from 'lucide-react';
import { BUSINESS_INFO, FACILITIES } from '../data/gymData';

interface FacilitiesSectionProps {
  onFreeTrialClick: () => void;
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ onFreeTrialClick }) => {
  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-red-500" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-red-500" />;
      case 'Weight':
        return <Weight className="w-5 h-5 text-red-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-red-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-red-500" />;
      case 'DoorClosed':
        return <DoorClosed className="w-5 h-5 text-red-500" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-red-500" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-red-500" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-red-500" />;
      case 'Car':
      default:
        return <Car className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <section id="facilities" className="py-20 sm:py-24 bg-neutral-900 border-t border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-3">
            STUDIO AMENITIES
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-6">
            Everything You Need to Train
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            IronFit provides a modern workout environment with dedicated spaces and facilities for different types of training.
          </p>
        </div>

        {/* 10 Facilities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-16">
          {FACILITIES.map((facility, idx) => (
            <div
              key={idx}
              className="bg-neutral-950 p-5 sm:p-6 rounded border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col items-center text-center justify-center group"
            >
              <div className="w-12 h-12 rounded bg-neutral-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {getFacilityIcon(facility.iconName)}
              </div>
              <span className="text-sm font-semibold text-neutral-200 leading-snug">
                {facility.name}
              </span>
            </div>
          ))}
        </div>

        {/* CTA: Book a Free Trial as specified in Section 20 */}
        <div className="text-center">
          <button
            onClick={onFreeTrialClick}
            className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-base px-8 py-4 rounded border border-neutral-700 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{BUSINESS_INFO.campaign.secondaryCta}</span>
            <ArrowRight className="w-5 h-5 text-red-500" />
          </button>
        </div>

      </div>
    </section>
  );
};
