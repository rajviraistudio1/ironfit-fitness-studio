import React from 'react';
import { ArrowRight, CheckCircle2, Dumbbell, Compass, CalendarCheck, Target } from 'lucide-react';
import { BUSINESS_INFO, CHALLENGE_OFFERS, HOW_TO_GET_STARTED, WHO_IS_IT_FOR } from '../data/gymData';

interface ChallengeSectionProps {
  onJoinClick: () => void;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({ onJoinClick }) => {
  const getOfferIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell':
        return <Dumbbell className="w-6 h-6 text-red-500" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-red-500" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-6 h-6 text-red-500" />;
      case 'Target':
      default:
        return <Target className="w-6 h-6 text-red-500" />;
    }
  };

  return (
    <section id="challenge" className="py-20 sm:py-24 bg-neutral-900 border-t border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-3">
            THE CAMPAIGN
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-6">
            Your 30-Day Challenge Starts Here
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-neutral-300 leading-relaxed text-left sm:text-center">
            <p>
              Getting started with fitness is often easier when you have a structured plan, professional guidance, and a place that keeps you focused.
            </p>
            <p>
              The IronFit 30-Day Fitness Challenge is designed for people who want to take the next step toward their fitness goals with guided workouts and support from experienced fitness coaches.
            </p>
            <p>
              Whether your goal is weight loss, muscle gain, strength training, general fitness, or simply building a consistent workout routine, IronFit provides a professional fitness environment to help you get started.
            </p>
          </div>
        </div>

        {/* What the Challenge Offers */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white uppercase">
              What the Challenge Offers
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CHALLENGE_OFFERS.map((offer, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 p-6 sm:p-7 rounded border border-neutral-800 hover:border-neutral-700 transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded bg-neutral-900 flex items-center justify-center mb-5 border border-neutral-800">
                    {getOfferIcon(offer.iconName)}
                  </div>
                  <h4 className="font-heading text-xl font-bold text-white mb-3">
                    {offer.title}
                  </h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {offer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who Is It For? */}
        <div className="bg-neutral-950 p-8 sm:p-12 rounded border border-neutral-800 mb-20">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white uppercase text-center mb-8">
              Who Is It For?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WHO_IS_IT_FOR.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded bg-neutral-900/50 border border-neutral-800/60">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-neutral-200 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Get Started */}
        <div className="mb-14">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
              SIMPLE 3-STEP PROCESS
            </p>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white uppercase">
              How to Get Started
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {HOW_TO_GET_STARTED.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-neutral-950 p-8 rounded border border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <span className="font-heading text-4xl sm:text-5xl font-extrabold text-red-600 block mb-4">
                    {item.step}
                  </span>
                  <h4 className="font-heading text-xl sm:text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
