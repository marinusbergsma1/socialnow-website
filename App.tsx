
import React, { useState, useLayoutEffect, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectShowcase from './components/ProjectShowcase';
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
// Lazy-load popup/modal components — only loaded when opened
const BookingPopup = lazy(() => import('./components/BookingPopup'));
const BentoGridSection = lazy(() => import('./components/BentoGridSection'));
const TeamPage = lazy(() => import('./components/TeamPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
import ServicesMarquee from './components/ServicesMarquee';
import Hero from './components/Hero';
import WebShowcase from './components/WebShowcase';

// Lazy-load sub-pages for code splitting
const ProjectsPage = lazy(() => import('./components/ProjectsPage'));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const ProjectPage = lazy(() => import('./components/ProjectPage'));

// Minimal fallback while lazy components load
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-white/20 border-t-[#25D366] rounded-full animate-spin" />
  </div>
);

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

      <div className="scroll-reveal">
        <WebShowcase />
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
  const isServicesPage = location.pathname === '/diensten';
  const isSubPage = isProjectPage || isProjectsPage || isServicesPage;

  useLayoutEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--scroll-y', window.scrollY.toString());
        ticking = false;
      });
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

      {!isSubPage && <GridBackground hide={anyModalOpen} startAnimation={!loading} />}

      {!loading && <Navbar onOpenBooking={() => setIsBookingOpen(true)} onOpenContact={() => setIsContactOpen(true)} />}

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
              <Suspense fallback={<PageLoader />}>
                <ProjectsPage onOpenBooking={() => setIsBookingOpen(true)} />
              </Suspense>
            }
          />
          <Route
            path="/diensten"
            element={
              <Suspense fallback={<PageLoader />}>
                <ServicesPage onOpenBooking={() => setIsBookingOpen(true)} />
              </Suspense>
            }
          />
          <Route
            path="/project/:slug"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProjectPage onOpenBooking={() => setIsBookingOpen(true)} />
              </Suspense>
            }
          />
        </Routes>
      </div>

      {!isSubPage && !loading && <Footer onOpenBooking={() => setIsBookingOpen(true)} />}
      {isSubPage && <Footer onOpenBooking={() => setIsBookingOpen(true)} />}

      {!loading && <WhatsAppPopup />}

      <Suspense fallback={null}>
        {isBookingOpen && (
          <BookingPopup
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
          />
        )}
        {isServicesOpen && (
          <BentoGridSection
            isOpen={isServicesOpen}
            onClose={() => setIsServicesOpen(false)}
          />
        )}
        {isTeamOpen && (
          <TeamPage
            isOpen={isTeamOpen}
            onClose={() => setIsTeamOpen(false)}
          />
        )}
        {isContactOpen && (
          <ContactPage
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

export default App;
