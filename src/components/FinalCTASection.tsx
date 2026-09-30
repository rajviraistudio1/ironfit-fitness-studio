import React from 'react';
import { LeadForm } from './LeadForm';

export const FinalCTASection: React.FC = () => {
  return (
    <section id="join-form" className="py-20 sm:py-24 bg-neutral-950 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-950/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-3">
            READY TO GET STARTED?
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-4">
            Take the First Step With the 30-Day Fitness Challenge
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed">
            Tell us a little about yourself and your fitness goal. Submit your details and the IronFit team will contact you to help you get started.
          </p>
        </div>

        {/* Lead Form Container */}
        <div className="max-w-2xl mx-auto">
          <LeadForm />
        </div>

      </div>
    </section>
  );
};
