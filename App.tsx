
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectShowcase from './components/ProjectShowcase';
import ProjectPage from './components/ProjectPage';
import Clients from './components/Clients';
import ShortContent from './components/ShortContent';
import Reviews from './components/Reviews';
import ImageSlider from './components/ImageSlider';
import Team from './components/Team';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import Loader from './components/Loader';
import GridBackground from './components/GridBackground';
import WhatsAppPopup from './components/WhatsAppPopup';
import BookingPopup from './components/BookingPopup';
import BentoGridSection from './components/BentoGridSection';
import TeamPage from './components/TeamPage';
import ContactPage from './components/ContactPage';
import ProjectsPage from './components/ProjectsPage';
import ServicesMarquee from './components/ServicesMarquee';
import Hero from './components/Hero';

const HomePage: React.FC<{
  loading: boolean;
  onOpenBooking: () => void;
}> = ({ loading, onOpenBooking }) => {
  return (
    <main className={`transition-all duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
      <div id="home">
        <Hero startAnimation={!loading} onOpenBooking={onOpenBooking} />
      </div>

      <div className="scroll-reveal">
        <Clients />
      </div>

      <ProjectShowcase
        onOpenBooking={onOpenBooking}
      />

      <div className="scroll-reveal">
        <ShortContent />
      </div>

      <div className="scroll-reveal">
        <ServicesMarquee />
      </div>

      <div className="scroll-reveal">
        <Reviews onOpenBooking={onOpenBooking} />
      </div>

      <div className="scroll-reveal">
        <ImageSlider />
      </div>

      <div className="scroll-reveal">
        <Team onOpenBooking={onOpenBooking} />
      </div>

      <div className="scroll-reveal">
        <FAQ onOpenContact={onOpenBooking} />
      </div>

      <CTASection onOpenBooking={onOpenBooking} />
    </main>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const location = useLocation();
  const isProjectPage = location.pathname.startsWith('/project/');
  const isProjectsPage = location.pathname === '/projecten';
  const isSubPage = isProjectPage || isProjectsPage;

  useLayoutEffect(() => {
    const handleScroll = () => {
      document.documentElement.style.setProperty('--scroll-y', window.scrollY.toString());
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, location.pathname]);

  // Skip loader on sub-pages (direct URL access)
  useEffect(() => {
    if (isSubPage && loading) {
      setLoading(false);
    }
  }, [isSubPage, loading]);

  const anyModalOpen = loading || isServicesOpen || isTeamOpen || isContactOpen;

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#25D366] selection:text-black">
      {!isSubPage && loading && <Loader onComplete={() => setLoading(false)} />}

      {!isSubPage && <GridBackground hide={anyModalOpen} />}

      {!loading && <Navbar onOpenBooking={() => setIsBookingOpen(true)} />}

      <div
        key={location.pathname}
        className="animate-page-fade-in"
      >
        <Routes location={location}>
          <Route
            path="/"
            element={
              <HomePage
                loading={loading}
                onOpenBooking={() => setIsBookingOpen(true)}
              />
            }
          />
          <Route
            path="/projecten"
            element={
              <ProjectsPage onOpenBooking={() => setIsBookingOpen(true)} />
            }
          />
          <Route
            path="/project/:slug"
            element={
              <ProjectPage onOpenBooking={() => setIsBookingOpen(true)} />
            }
          />
        </Routes>
      </div>

      {!isSubPage && !loading && <Footer onOpenBooking={() => setIsBookingOpen(true)} />}
      {isSubPage && <Footer onOpenBooking={() => setIsBookingOpen(true)} />}

      {!loading && <WhatsAppPopup />}

      <BookingPopup
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <BentoGridSection
        isOpen={isServicesOpen}
        onClose={() => setIsServicesOpen(false)}
      />

      <TeamPage
        isOpen={isTeamOpen}
        onClose={() => setIsTeamOpen(false)}
      />

      <ContactPage
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
};

export default App;
