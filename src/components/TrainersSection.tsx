import React, { useState } from 'react';
import { ArrowRight, Dumbbell, Award, User } from 'lucide-react';
import { BUSINESS_INFO, TRAINERS } from '../data/gymData';

interface TrainersSectionProps {
  onJoinClick: () => void;
}

export const TrainersSection: React.FC<TrainersSectionProps> = ({ onJoinClick }) => {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <section id="trainers" className="py-20 sm:py-24 bg-neutral-900 border-t border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-3">
            EXPERT COACHING
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-6">
            Meet Your Fitness Coaches
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Professional guidance can make your fitness journey easier to approach and more structured. Meet the coaches at IronFit.
          </p>
        </div>

        {/* 2 Trainer Cards with Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {TRAINERS.map((trainer, idx) => {
            const hasImageError = imageErrors[idx];
            return (
              <div
                key={idx}
                className="bg-neutral-950 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all overflow-hidden flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Trainer Photo Container */}
                  <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-neutral-900">
                    {trainer.image && !hasImageError ? (
                      <img
                        src={trainer.image}
                        alt={`${trainer.name} — ${trainer.role}`}
                        loading="lazy"
                        onError={() => handleImageError(idx)}
                        className="w-full h-full object-cover object-top filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-600">
                        <User className="w-16 h-16 text-neutral-700 mb-2" />
                        <span className="font-heading text-xl font-bold text-neutral-500">
                          {trainer.name}
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay for seamless dark transition */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none" />

                    {/* Role Tag Pill */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-red-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow-md">
                        {trainer.role}
                      </span>
                    </div>

                    {/* Trainer Monogram Badge */}
                    <div className="absolute bottom-4 right-4 z-10 w-12 h-12 rounded-full bg-neutral-950/90 border border-neutral-800 flex items-center justify-center text-red-500 font-heading text-lg font-bold shadow-lg">
                      {trainer.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  </div>

                  {/* Trainer Details */}
                  <div className="p-6 sm:p-8">
                    <div className="mb-4">
                      <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1">
                        {trainer.name}
                      </h3>
                      <p className="text-xs uppercase tracking-wider text-red-500 font-semibold">
                        {trainer.role} · IronFit Studio
                      </p>
                    </div>

                    <div className="mb-6 flex items-start gap-2.5 text-neutral-300 text-sm leading-relaxed bg-neutral-900/60 p-3.5 rounded border border-neutral-800/80">
                      <Award className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p>{trainer.experience}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-3 flex items-center gap-1.5">
                        <Dumbbell className="w-3.5 h-3.5 text-red-500" />
                        <span>Specializations</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300">
                        {trainer.specializations.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-neutral-900 border border-neutral-800/90 text-neutral-200 px-2.5 py-1 rounded text-xs font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
