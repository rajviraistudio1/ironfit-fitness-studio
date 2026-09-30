import React from 'react';
import { Phone, MessageSquare, Mail, MapPin, Clock, ArrowRight, Lock } from 'lucide-react';
import { BUSINESS_INFO } from '../data/gymData';

interface FooterProps {
  onJoinClick: () => void;
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onJoinClick, onAdminClick }) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 pt-16 pb-12 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-neutral-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-heading text-3xl font-bold tracking-wider text-white">
              IRON<span className="text-red-600">FIT</span>
            </span>
            <p className="text-sm font-semibold text-neutral-300">
              {BUSINESS_INFO.type}
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              IronFit Fitness Studio is a modern fitness centre focused on helping members build strength, improve fitness, lose weight, and develop a consistent healthy lifestyle.
            </p>
            <div className="pt-2">
              <button
                onClick={onJoinClick}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>{BUSINESS_INFO.campaign.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Address & Timings */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
              Studio Location & Timings
            </h4>
            
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-1" />
              <p className="text-neutral-300">
                {BUSINESS_INFO.address}
              </p>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Clock className="w-4 h-4 text-red-500 shrink-0 mt-1" />
              <div className="space-y-1 text-neutral-300">
                <p>{BUSINESS_INFO.openingHours.weekday}</p>
                <p>{BUSINESS_INFO.openingHours.sunday}</p>
              </div>
            </div>
          </div>

          {/* Contact Direct */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${BUSINESS_INFO.phoneClean}`}
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-red-500" />
                <span>{BUSINESS_INFO.phone}</span>
              </a>

              <a
                href={BUSINESS_INFO.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp: {BUSINESS_INFO.whatsapp}</span>
              </a>

              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-red-500" />
                <span>{BUSINESS_INFO.email}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright + Owner Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>
            © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onAdminClick}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-neutral-300 transition-colors py-1 cursor-pointer"
            >
              <Lock className="w-3 h-3 text-neutral-400" />
              <span>Owner Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
