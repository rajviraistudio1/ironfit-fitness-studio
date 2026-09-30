import React from 'react';
import { MapPin, Clock, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { BUSINESS_INFO } from '../data/gymData';

export const LocationSection: React.FC = () => {
  // Safe Google Maps search query using the exact provided address
  const encodedAddress = encodeURIComponent(
    'IronFit Fitness Studio, #142, 27th Main Road, Sector 2, HSR Layout, Bengaluru, Karnataka 560102'
  );
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="location" className="py-20 sm:py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-3">
            HSR LAYOUT, BENGALURU
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mb-6">
            Train Close to Home or Work
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            IronFit Fitness Studio is located in HSR Layout, Bengaluru, making it convenient for people living or working in the surrounding area.
          </p>
        </div>

        {/* Location & Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Details Card */}
          <div className="lg:col-span-5 bg-neutral-900 p-8 sm:p-10 rounded border border-neutral-800 space-y-8">
            
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-neutral-950 flex items-center justify-center shrink-0 border border-neutral-800">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white mb-1">
                  Address
                </h3>
                <p className="text-sm font-semibold text-neutral-200">
                  {BUSINESS_INFO.name}
                </p>
                <p className="text-sm text-neutral-400 leading-relaxed mt-0.5">
                  #142, 27th Main Road, Sector 2,
                  <br />
                  HSR Layout, Bengaluru, Karnataka 560102
                </p>
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 mt-2 font-medium"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-neutral-950 flex items-center justify-center shrink-0 border border-neutral-800">
                <Clock className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white mb-1">
                  Opening Hours
                </h3>
                <div className="text-sm text-neutral-300 space-y-1">
                  <p>
                    <span className="font-medium text-white">Monday – Saturday:</span>{' '}
                    5:30 AM – 10:00 PM
                  </p>
                  <p>
                    <span className="font-medium text-white">Sunday:</span>{' '}
                    6:00 AM – 1:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Phone & WhatsApp Contacts */}
            <div className="pt-6 border-t border-neutral-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-red-500" />
                  <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                    Phone
                  </span>
                </div>
                <a
                  href={`tel:${BUSINESS_INFO.phoneClean}`}
                  className="text-sm font-semibold text-white hover:text-red-400 transition-colors"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                    WhatsApp
                  </span>
                </div>
                <a
                  href={BUSINESS_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>{BUSINESS_INFO.whatsapp}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 bg-neutral-900 rounded border border-neutral-800 overflow-hidden h-[380px] lg:h-[440px] relative">
            <iframe
              title="IronFit Fitness Studio Location Map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              loading="lazy"
              allowFullScreen
              src={embedMapUrl}
              className="w-full h-full"
            />
            <div className="absolute bottom-4 left-4 bg-neutral-950/90 backdrop-blur-sm px-4 py-2 rounded border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>HSR Layout Sector 2, Bengaluru</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
