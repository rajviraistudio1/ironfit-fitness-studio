import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data/gymData';

interface MobileStickyCTAProps {
  onJoinClick: () => void;
}

export const MobileStickyCTA: React.FC<MobileStickyCTAProps> = ({ onJoinClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past initial hero (e.g. 400px)
      // and hide when near the form at the bottom
      const formElement = document.getElementById('join-form');
      if (formElement) {
        const rect = formElement.getBoundingClientRect();
        // If form is visible on screen, hide the sticky button so it doesn't obstruct
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setIsVisible(false);
          return;
        }
      }

      setIsVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 md:hidden animate-slideUp shadow-2xl">
      <button
        onClick={onJoinClick}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-sm py-3.5 px-4 rounded shadow-lg shadow-red-950/60 transition-all cursor-pointer"
      >
        <span>{BUSINESS_INFO.campaign.primaryCta}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
