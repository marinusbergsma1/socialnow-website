
import React, { useState, useLayoutEffect, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Clients from './components/Clients';
import CertificationBadges from './components/CertificationBadges';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
import GridBackground from './components/GridBackground';
import NotFound from './components/NotFound';
import { useSEO } from './hooks/useSEO';

// Retry lazy imports once on chunk load failure (e.g. network error on mobile)
function lazyRetry(importFn: () => Promise<{ default: React.ComponentType<any> }>) {
  return lazy(() =>
    importFn().catch((err) => {
      console.warn('[SocialNow] Chunk load failed, retrying...', err);
      return new Promise<{ default: React.ComponentType<any> }>((resolve, reject) => {
        setTimeout(() => importFn().then(resolve).catch(reject), 1000);
      });
    })
  );
}

// Lazy-load below-fold homepage sections — keeps initial bundle small
const WebShowcase = lazyRetry(() => import('./components/WebShowcase'));
const ProjectShowcase = lazyRetry(() => import('./components/ProjectShowcase'));
const ShortContent = lazyRetry(() => import('./components/ShortContent'));
const ServicesMarquee = lazyRetry(() => import('./components/ServicesMarquee'));
const ProcessSection = lazyRetry(() => import('./components/ProcessSection'));
const Reviews = lazyRetry(() => import('./components/Reviews'));
const ImageSlider = lazyRetry(() => import('./components/ImageSlider'));
const Team = lazyRetry(() => import('./components/Team'));
const FAQ = lazyRetry(() => import('./components/FAQ'));
const CTASection = lazyRetry(() => import('./components/CTASection'));
const Footer = lazyRetry(() => import('./components/Footer'));
const WhatsAppPopup = lazyRetry(() => import('./components/WhatsAppPopup'));
const PixelCursor = lazyRetry(() => import('./components/PixelCursor'));

// Lazy-load popup/modal components — only loaded when opened
const BookingPopup = lazyRetry(() => import('./components/BookingPopup'));
const BentoGridSection = lazyRetry(() => import('./components/BentoGridSection'));
const TeamPage = lazyRetry(() => import('./components/TeamPage'));
const ContactPage = lazyRetry(() => import('./components/ContactPage'));

// Lazy-load sub-pages for code splitting
const ProjectsPage = lazyRetry(() => import('./components/ProjectsPage'));
const ServicesPage = lazyRetry(() => import('./components/ServicesPage'));
const ProjectPage = lazyRetry(() => import('./components/ProjectPage'));
const PrivacyPage = lazyRetry(() => import('./components/PrivacyPage'));
const PricingPage = lazyRetry(() => import('./components/PricingPage'));

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
  useSEO({
    title: 'SocialNow | AI-Powered Web & Project Development Amsterdam',
    description: 'SocialNow is een creatief bureau in Amsterdam gespecialiseerd in AI-gestuurde webontwikkeling, branding, UX/UI design en social media marketing.',
    path: '/',
  });

  return (
    <main className={`transition-all duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
      <div id="home">
        <Hero startAnimation={!loading} onOpenBooking={onOpenBooking} />
      </div>

      <div className="scroll-reveal">
        <Clients />
      </div>

      <div className="scroll-reveal">
        <CertificationBadges />
      </div>

      <Suspense fallback={null}>
        <div className="scroll-reveal">
          <WebShowcase />
        </div>

        <ProjectShowcase onOpenBooking={onOpenBooking} />

        <div className="scroll-reveal">
          <ShortContent />
        </div>

        <div className="scroll-reveal">
          <ServicesMarquee />
        </div>

        <div className="scroll-reveal">
          <ProcessSection onOpenBooking={onOpenBooking} />
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
      </Suspense>
    </main>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);

  const location = useLocation();
  const isProjectPage = location.pathname.startsWith('/project/');
  const isProjectsPage = location.pathname === '/projecten';
  const isServicesPage = location.pathname === '/diensten';
  const isPrivacyPage = location.pathname === '/privacy';
  const isPricingPage = location.pathname === '/prijzen';
  const isSubPage = isProjectPage || isProjectsPage || isServicesPage || isPrivacyPage || isPricingPage;

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Stop Lenis during loader & modals, resume when done
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const anyOpen = loading || isBookingOpen || isServicesOpen || isTeamOpen || isContactOpen;
    if (anyOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [loading, isBookingOpen, isServicesOpen, isTeamOpen, isContactOpen]);

  // Scroll to top on route change
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [location.pathname]);

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
    <ErrorBoundary>
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#25D366] selection:text-black grain-overlay">
      <a href="#main-content" className="skip-to-content">Ga naar inhoud</a>

      {!isSubPage && loading && <Loader onComplete={() => setLoading(false)} />}

      {!isSubPage && <GridBackground hide={anyModalOpen} startAnimation={!loading} />}

      {!loading && <Navbar onOpenBooking={() => setIsBookingOpen(true)} onOpenContact={() => setIsContactOpen(true)} />}

      <div
        id="main-content"
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
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <ProjectsPage onOpenBooking={() => setIsBookingOpen(true)} />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/diensten"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <ServicesPage onOpenBooking={() => setIsBookingOpen(true)} />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/project/:slug"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <ProjectPage onOpenBooking={() => setIsBookingOpen(true)} />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/prijzen"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <PricingPage onOpenBooking={() => setIsBookingOpen(true)} />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/privacy"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <PrivacyPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Suspense fallback={null}>
        {!isSubPage && !loading && <Footer onOpenBooking={() => setIsBookingOpen(true)} />}
        {isSubPage && <Footer onOpenBooking={() => setIsBookingOpen(true)} />}

        {!loading && <WhatsAppPopup />}

        {!loading && <PixelCursor />}
      </Suspense>

      <ErrorBoundary>
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
      </ErrorBoundary>
    </div>
    </ErrorBoundary>
  );
};

export default App;
