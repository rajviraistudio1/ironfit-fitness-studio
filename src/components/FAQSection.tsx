import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../data/gymData';

export const FAQSection: React.FC = () => {
  // Allow at most one or two questions open at a time
  const [openIds, setOpenIds] = useState<string[]>(['faq-1']);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        // Keep maximum 2 open as per guidelines
        const updated = [...prev, id];
        return updated.slice(-2);
      }
    });
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-neutral-900 border-t border-b border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-3">
            QUESTIONS & ANSWERS
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-neutral-400">
            Everything you need to know about the 30-Day Fitness Challenge and IronFit.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-neutral-950 rounded border border-neutral-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-lg sm:text-xl font-bold text-neutral-100 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-red-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-neutral-300 leading-relaxed border-t border-neutral-800/60 whitespace-pre-line animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
