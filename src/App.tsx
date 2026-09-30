import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ChallengeSection } from './components/ChallengeSection';
import { BenefitsSection } from './components/BenefitsSection';
import { ServicesSection } from './components/ServicesSection';
import { WhyIronFitSection } from './components/WhyIronFitSection';
import { TrainersSection } from './components/TrainersSection';
import { SocialProofSection } from './components/SocialProofSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { LocationSection } from './components/LocationSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { MobileStickyCTA } from './components/MobileStickyCTA';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Check path or hash on initial load
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      setIsAdminRoute(path.startsWith('/admin') || hash === '#admin');
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    // Check stored session
    const savedToken = localStorage.getItem('ironfit_admin_token');
    const savedUser = localStorage.getItem('ironfit_admin_user');
    if (savedToken && savedUser) {
      try {
        setAdminToken(savedToken);
        setAdminUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('ironfit_admin_token');
        localStorage.removeItem('ironfit_admin_user');
      }
    }

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminSuccess = (token: string, user: { name: string; email: string }) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('ironfit_admin_token', token);
    localStorage.setItem('ironfit_admin_user', JSON.stringify(user));
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('ironfit_admin_token');
    localStorage.removeItem('ironfit_admin_user');
  };

  const scrollToJoinForm = () => {
    const formSection = document.getElementById('join-form');
    if (formSection) {
      const navOffset = 70;
      const elementPosition = formSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Auto focus name input for convenience
      setTimeout(() => {
        const nameInput = document.getElementById('name') as HTMLInputElement | null;
        if (nameInput) {
          nameInput.focus();
        }
      }, 500);
    }
  };

  // ADMIN ROUTE
  if (isAdminRoute) {
    if (!adminToken || !adminUser) {
      return (
        <AdminLogin
          onSuccess={handleAdminSuccess}
          onBackToSite={navigateToHome}
        />
      );
    }

    return (
      <AdminDashboard
        token={adminToken}
        user={adminUser}
        onLogout={handleAdminLogout}
        onViewSite={navigateToHome}
      />
    );
  }

  // PUBLIC 30-DAY FITNESS CHALLENGE LANDING PAGE (Exact order 1-13)
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* 1. Header / Navigation */}
      <Header
        onJoinClick={scrollToJoinForm}
        onAdminClick={navigateToAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Hero */}
        <Hero
          onPrimaryCta={scrollToJoinForm}
          onSecondaryCta={scrollToJoinForm}
        />

        {/* 3. Challenge / Offer */}
        <ChallengeSection onJoinClick={scrollToJoinForm} />

        {/* 4. Benefits */}
        <BenefitsSection onJoinClick={scrollToJoinForm} />

        {/* 5. Programs / Services */}
        <ServicesSection onSelectProgram={scrollToJoinForm} />

        {/* 6. Why Choose IronFit */}
        <WhyIronFitSection onJoinClick={scrollToJoinForm} />

        {/* 7. Trainers */}
        <TrainersSection onJoinClick={scrollToJoinForm} />

        {/* 8. Social Proof */}
        <SocialProofSection />

        {/* 9. Facilities */}
        <FacilitiesSection onFreeTrialClick={scrollToJoinForm} />

        {/* 10. Location & Opening Hours */}
        <LocationSection />

        {/* 11. FAQ */}
        <FAQSection />

        {/* 12. Final CTA + Lead Form */}
        <FinalCTASection />
      </main>

      {/* 13. Footer */}
      <Footer
        onJoinClick={scrollToJoinForm}
        onAdminClick={navigateToAdmin}
      />

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA onJoinClick={scrollToJoinForm} />
    </div>
  );
}
