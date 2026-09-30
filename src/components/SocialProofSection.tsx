import React from 'react';
import { Star, Quote } from 'lucide-react';
import { BUSINESS_INFO, TESTIMONIALS } from '../data/gymData';

export const SocialProofSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-3">
            COMMUNITY & REVIEWS
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-8">
            Trusted by the IronFit Community
          </h2>

          {/* Prominent Google Rating Display (Differentiated from Testimonial Cards) */}
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 bg-neutral-900 border border-neutral-800 px-8 py-5 rounded-lg shadow-lg">
            <div className="flex items-center gap-1.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm sm:text-base">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {BUSINESS_INFO.socialProof.rating}
              </span>
              <span className="text-neutral-400">
                {BUSINESS_INFO.socialProof.platform}
              </span>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <span className="font-semibold text-neutral-200">
                {BUSINESS_INFO.socialProof.reviewCount}
              </span>
            </div>
          </div>
        </div>

        {/* Testimonials Cards (Exact provided text only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/60 p-8 rounded border border-neutral-800 flex flex-col justify-between relative hover:border-neutral-700 transition-colors"
            >
              <div>
                <Quote className="w-8 h-8 text-neutral-700 mb-4" />
                <p className="text-neutral-300 text-base leading-relaxed italic mb-6">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="font-heading text-lg font-bold text-white">
                  {testimonial.author}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  Verified Member
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
