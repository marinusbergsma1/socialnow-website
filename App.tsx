
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Clients from './components/Clients';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
const GridBackground = lazyRetry(() => import('./components/GridBackground'));
import NotFound from './components/NotFound';
import { useSEO } from './hooks/useSEO';

// Retry lazy imports once on chunk load failure (e.g. network error on mobile)
function lazyRetry(importFn: () => Promise<{ default: React.ComponentType<any> }>) {
  return lazy(() =>
    importFn().catch((err) => {
      console.warn('[SocialNow] Chunk load failed, retrying...', err);
      return new Promise<{ default: React.ComponentType<any> }>((resolve, reject) => {
        setTimeout(() => {
          importFn().then(resolve).catch((retryErr) => {
            console.error('[SocialNow] Chunk load failed after retry:', retryErr);
            reject(retryErr);
          });
        }, 1000);
      });
    })
  );
}

// Lazy-load below-fold homepage sections — keeps initial bundle small
const WebShowcase = lazyRetry(() => import('./components/WebShowcase'));
const SocialMediaSlider = lazyRetry(() => import('./components/SocialMediaSlider'));
const ProjectShowcase = lazyRetry(() => import('./components/ProjectShowcase'));
const ShortContent = lazyRetry(() => import('./components/ShortContent'));
const ServicesMarquee = lazyRetry(() => import('./components/ServicesMarquee'));
const ProcessSection = lazyRetry(() => import('./components/ProcessSection'));
const Reviews = lazyRetry(() => import('./components/Reviews'));
const ImageSlider = lazyRetry(() => import('./components/ImageSlider'));
const Team = lazyRetry(() => import('./components/Team'));
const FAQ = lazyRetry(() => import('./components/FAQ'));
const Footer = lazyRetry(() => import('./components/Footer'));
const WhatsAppPopup = lazyRetry(() => import('./components/WhatsAppPopup'));
const PixelCursor = lazyRetry(() => import('./components/PixelCursor'));

// v2.0 — New sections
// v2.1 — Bento features grid ("WAT WIJ BOUWEN") vervangt de oude AIMetricsSection ("BEWEZEN IMPACT")
const BentoFeaturesSection = lazyRetry(() => import('./components/BentoFeaturesSection'));
const PricingStrip = lazyRetry(() => import('./components/PricingStrip'));

// Lazy-load popup/modal components — only loaded when opened
const BookingPopup = lazyRetry(() => import('./components/BookingPopup'));
const BentoGridSection = lazyRetry(() => import('./components/BentoGridSection'));
const ContactPage = lazyRetry(() => import('./components/ContactPage'));

// Lazy-load sub-pages for code splitting
const TeamPage = lazyRetry(() => import('./components/TeamPage'));
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
    description: 'Je website, CRM, content en advertenties — allemaal samen in 1 overzichtelijke AI chat. Custom AI Solutions uit Amsterdam. Gratis proof of concept: website demo én rebranding.',
    path: '/',
  });

  return (
    <main className={`transition-opacity duration-1000 ease-out ${loading ? 'opacity-0' : 'opacity-100'}`}>
      <div id="home">
        <Hero startAnimation={!loading} onOpenBooking={onOpenBooking} />
      </div>

      <div className="scroll-reveal">
        <Clients />
      </div>

      <Suspense fallback={null}>
        {/* Instagram-feed direct na Clients: social media is core business */}
        <div className="scroll-reveal">
          <SocialMediaSlider />
        </div>

        {/* v2.1: Bento features grid ("WAT WIJ BOUWEN") */}
        <div className="scroll-reveal">
          <BentoFeaturesSection onOpenBooking={onOpenBooking} />
        </div>

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

        {/* v2.1: Glasheldere prijzen op de homepage */}
        <div className="scroll-reveal">
          <PricingStrip onOpenBooking={onOpenBooking} />
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
      </Suspense>
    </main>
  );
};

// Skip loader on returning visits within the same session
const hasSeenLoader = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('sn_loaded') === '1';

const App: React.FC = () => {
  const [loading, setLoading] = useState(!hasSeenLoader);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const location = useLocation();
  const isProjectPage = location.pathname.startsWith('/project/');
  const isProjectsPage = location.pathname === '/projecten';
  const isServicesPage = location.pathname === '/diensten';
  const isPrivacyPage = location.pathname === '/privacy';
  const isPricingPage = location.pathname === '/prijzen';
  const isTeamPage = location.pathname === '/team';
  const isSubPage = isProjectPage || isProjectsPage || isServicesPage || isPrivacyPage || isPricingPage || isTeamPage;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.05 });

    // Observe existing + any newly added scroll-reveal elements
    const observeAll = () => {
      document.querySelectorAll('.scroll-reveal:not(.is-visible)').forEach((el) => {
        observer.observe(el);
      });
    };
    observeAll();

    // Watch for NEW scroll-reveal elements from lazy-loaded components
    // Throttle on mobile to prevent excessive callback firing during lazy component mounts
    let mutationTimer: ReturnType<typeof setTimeout> | null = null;
    const throttledObserveAll = () => {
      if (mutationTimer) return;
      mutationTimer = setTimeout(() => {
        observeAll();
        mutationTimer = null;
      }, 150);
    };
    const mutationObserver = new MutationObserver(throttledObserveAll);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      if (mutationTimer) clearTimeout(mutationTimer);
    };
  }, [loading, location.pathname]);

  // Skip loader on sub-pages (direct URL access)
  useEffect(() => {
    if (isSubPage && loading) {
      setLoading(false);
    }
  }, [isSubPage, loading]);

  const anyModalOpen = loading || isServicesOpen || isContactOpen;

  return (
    <ErrorBoundary>
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#25D366] selection:text-black grain-overlay">
      <a href="#main-content" className="skip-to-content">Ga naar inhoud</a>

      {!isSubPage && loading && <Loader onComplete={() => { sessionStorage.setItem('sn_loaded', '1'); setLoading(false); }} />}

      <Suspense fallback={null}>
        <GridBackground hide={anyModalOpen} startAnimation={!loading || isSubPage} />
      </Suspense>

      <div className={`transition-opacity duration-700 ease-out ${loading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Navbar onOpenBooking={() => setIsBookingOpen(true)} onOpenContact={() => setIsContactOpen(true)} />
      </div>

      <div
        id="main-content"
        key={location.pathname}
        className="animate-page-fade-in relative z-10"
        onAnimationEnd={(e) => {
          // fill-mode forwards houdt de transform/filter-animatie actief (ook op
          // eindwaarde none) en maakt #main-content zo een backdrop root — dan
          // bereikt de glass-blur/lens van de tiles de globe erachter nooit.
          // Klasse weghalen zodra de fade klaar is; bij routewissel geeft de
          // key-prop een vers element mét klasse, dus de fade blijft werken.
          if (e.target === e.currentTarget && e.animationName === 'pageFadeIn') {
            e.currentTarget.classList.remove('animate-page-fade-in');
          }
        }}
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
            path="/team"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <TeamPage onOpenBooking={() => setIsBookingOpen(true)} />
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
                  <ServicesPage onOpenBooking={() => setIsBookingOpen(true)} />
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
          {isContactOpen && (
            <ContactPage
              isOpen={isContactOpen}
              onClose={() => setIsContactOpen(false)}
              onOpenBooking={() => setIsBookingOpen(true)}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
    </ErrorBoundary>
  );
};

export default App;
