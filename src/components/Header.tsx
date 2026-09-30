import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/gymData';

interface HeaderProps {
  onJoinClick: () => void;
  onAdminClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onJoinClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Challenge', href: '#challenge' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'Programs', href: '#programs' },
    { label: 'Trainers', href: '#trainers' },
    { label: 'Facilities', href: '#facilities' },
    { label: 'Location', href: '#location' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navHeight = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 py-3 shadow-xl'
          : 'bg-gradient-to-b from-neutral-950/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand Name */}
          <a
            href="#"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
            aria-label="IronFit Fitness Studio Home"
          >
            <span className="font-heading text-2xl sm:text-3xl font-bold tracking-wider text-white group-hover:text-red-500 transition-colors">
              IRON<span className="text-red-600">FIT</span>
            </span>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-neutral-400 font-medium pl-2 border-l border-neutral-800">
              HSR Layout
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative py-1 hover:border-b-2 hover:border-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Header Actions */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`tel:${BUSINESS_INFO.phoneClean}`}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white px-3 py-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              title="Call IronFit directly"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>{BUSINESS_INFO.phone}</span>
            </a>
            <button
              onClick={onJoinClick}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded shadow-lg shadow-red-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 cursor-pointer"
            >
              {BUSINESS_INFO.campaign.primaryCta}
            </button>
          </div>

          {/* Mobile Hamburger & Quick Action */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onJoinClick}
              className="sm:hidden bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
            >
              Join Challenge
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-300 hover:text-white p-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-6 transition-all animate-fadeIn">
          <nav className="flex flex-col gap-4 mb-6" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-neutral-200 hover:text-red-500 py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onJoinClick();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-center py-3 rounded shadow-md transition-colors"
            >
              {BUSINESS_INFO.campaign.primaryCta}
            </button>
            <a
              href={`tel:${BUSINESS_INFO.phoneClean}`}
              className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-medium text-center py-2.5 rounded border border-neutral-800 transition-colors"
            >
              <Phone className="w-4 h-4 text-red-500" />
              <span>Call: {BUSINESS_INFO.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
