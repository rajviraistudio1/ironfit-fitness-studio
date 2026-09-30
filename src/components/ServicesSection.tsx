import React from 'react';
import { Dumbbell, UserCheck, Flame, Zap, Users } from 'lucide-react';
import { PROGRAMS } from '../data/gymData';

interface ServicesSectionProps {
  onSelectProgram?: (programName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = () => {
  const getProgramIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Dumbbell className="w-6 h-6 text-red-500" />;
      case 1:
        return <UserCheck className="w-6 h-6 text-red-500" />;
      case 2:
        return <Flame className="w-6 h-6 text-red-500" />;
      case 3:
        return <Zap className="w-6 h-6 text-red-500" />;
      case 4:
      default:
        return <Users className="w-6 h-6 text-red-500" />;
    }
  };

  return (
    <section id="programs" className="py-20 sm:py-24 bg-neutral-900 border-t border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-3">
            PROGRAMS & SERVICES
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-6">
            Training Options For Different Fitness Goals
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Whether you're just getting started or already have experience in the gym, IronFit offers different training options to support your fitness journey.
          </p>
        </div>

        {/* 5 Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS.map((program, idx) => (
            <div
              key={idx}
              className={`bg-neutral-950 p-8 rounded border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded bg-neutral-900 flex items-center justify-center mb-6 border border-neutral-800">
                  {getProgramIcon(idx)}
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-3">
                  {program.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {program.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
