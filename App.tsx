
import React, { useState, useLayoutEffect, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProjectShowcase from './components/ProjectShowcase';
import ProjectModal from './components/ProjectModal';
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
import { Project } from './types';

const sharedProjects: Project[] = [
  {
    id: 1,
    title: "Banners & Socials",
    category: "Universal Studios, Sony",
    client: "Universal / Sony Pictures",
    year: "2023 - 2024",
    services: ["Campaign Design", "Social Media", "Digital OOH Media", "Offline Media"],
    description: "Voor diverse filmreleases van UNIVERSAL_NL en SonyPicturesNL ontwikkelden wij geïntegreerde on- en offline campagnes die de bioscooplanceringen direct ondersteunden door meer bezoekers te trekken.",
    image: "https://i.ibb.co/WWZCxsb2/CRAFTURE-FASTX-PERSWAND-400x2200-1.webp", 
    align: 'right', 
    gallery: [
      "https://i.ibb.co/nNb5FYBq/WARNER-FLASH-FRAMES.webp",
      "https://i.ibb.co/d4Xvg2Nd/UNIVERSAL-OPENHEIMER-FRAMES.webp",
      "https://i.ibb.co/mV9FkFZy/UNIVERSAL-NOHARDFEELINGS-FRAMES.webp"
    ]
  },
  {
    id: 5,
    title: "Social Artworks",
    category: "Voetbalclub AZ",
    client: "AZ Alkmaar",
    year: "Ongoing",
    services: ["Social Media Design", "Webvisuals", "Campaign Design", "UX/UI Visuals", "Branding"],
    description: "Voor AZ ontwierpen wij diverse socialmediaposts en websitevisuals, waaronder dankuitingen voor spelers, wedstrijdwijzigingen en campagnes voor de jeugdteams.",
    image: "https://i.ibb.co/GQqxQHmz/AZ-Champions-Leageu-Header.webp",
    align: 'right',
    gallery: [
      "https://i.ibb.co/HDnNddpm/header-Bouadu-v2-2.webp",
      "https://i.ibb.co/BKYLR4wG/AZ-25-K-Volgers-Post.webp",
      "https://i.ibb.co/RkHCGbNS/AZ-Boadu-Bedankt-Post.webp"
    ]
  },
  {
    id: 2,
    title: "Performance Branding",
    category: "RAVEG",
    client: "RAVEG",
    year: "2024",
    services: ["Branding", "Visual Identity", "Webdesign", "Video & Motion Design", "Content Creation"],
    description: "Voor RAVEG ontwikkelden wij de volledige branding vanaf de start, opgebouwd tot een herkenbare en consistente merkidentiteit.",
    image: "https://i.ibb.co/yBXWFYqx/RAVEG-Hyperpower.webp",
    align: 'left',
    gallery: [
      "https://storage.googleapis.com/video-slider/RAVEG%20DYADIUM%20STORY.mp4",
      "https://storage.googleapis.com/video-slider/RAVEG_HYPERPOWER_VID_EN_2_STORY.mp4",
      "https://storage.googleapis.com/video-slider/RAVEG_HYPERPOWER_VID_EN_4_STORY.mp4"
    ]
  },
  {
    id: 3,
    title: "Content Engine",
    category: "Kids Heroes",
    client: "DAY&NITE",
    year: "2024",
    services: ["Campaign Design", "Social Media", "Digital OOH Media", "Offline Media"],
    description: "Voor Kids Heroes verzorgden wij de complete branding en uitvoering van de campagnes, verspreid over meerdere edities.",
    image: "https://i.ibb.co/tTCTL6DZ/Slider-Mobiel-Kids-Heroes-Koningshoek-1.webp",
    align: 'right',
    gallery: [
      "https://i.ibb.co/HD1RJt2z/1200x1200-Kids-Heroes-Koningshoek3-1.webp",
      "https://i.ibb.co/LXBkrK52/1200x1200-Kids-Heroes-Koningshoek3-1.webp",
      "https://i.ibb.co/tTCTL6DZ/Slider-Mobiel-Kids-Heroes-Koningshoek-1.webp"
    ]
  },
  {
    id: 4,
    title: "Creative Interieurdesign",
    category: "Print & Bind",
    client: "Print & Bind Amsterdam",
    year: "2023",
    services: ["Brand Activation", "Environmental Design", "Print Design", "Visual Identity", "Signage"],
    description: "Voor Print&Bind verzorgden wij de visuele aankleding en merkdoorvertaling, met als doel de merkidentiteit ook fysiek tot leven te brengen op de werkvloer.",
    image: "https://i.ibb.co/wZwdpDnY/666f15bbb49442553d264e6d-PRINT-BIND.webp",
    align: 'left',
    gallery: [
      "https://i.ibb.co/8D1GLhGM/Bannert.webp",
      "https://i.ibb.co/xSTR7yV9/Meeting-Room-2.webp",
      "https://i.ibb.co/998R1QP8/IMG-1686.webp"
    ]
  }
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

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
  }, [loading]);

  const anyModalOpen = loading || selectedProjectIndex !== null || isProjectsOpen || isServicesOpen || isTeamOpen || isContactOpen;

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#25D366] selection:text-black">
      {loading && <Loader onComplete={() => setLoading(false)} />}
      
      <GridBackground hide={anyModalOpen} />
      
      {!loading && <Navbar onOpenBooking={() => setIsBookingOpen(true)} />}

      <main className={`transition-all duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <div id="home">
          <Hero startAnimation={!loading} onOpenBooking={() => setIsBookingOpen(true)} />
        </div>
        
        <div className="scroll-reveal">
          <Clients />
        </div>

        <ProjectShowcase 
          onOpenBooking={() => setIsBookingOpen(true)}
          setSelectedIndex={setSelectedProjectIndex}
        />

        <div className="scroll-reveal">
          <ShortContent />
        </div>

        <div className="scroll-reveal">
          <ServicesMarquee />
        </div>

        <div className="scroll-reveal">
          <Reviews onOpenBooking={() => setIsBookingOpen(true)} />
        </div>

        <div className="scroll-reveal">
          <ImageSlider />
        </div>

        <div className="scroll-reveal">
          <Team onOpenBooking={() => setIsBookingOpen(true)} />
        </div>

        <div className="scroll-reveal">
          <FAQ onOpenContact={() => setIsBookingOpen(true)} />
        </div>

        <CTASection onOpenBooking={() => setIsBookingOpen(true)} />
      </main>

      {!loading && <Footer onOpenBooking={() => setIsBookingOpen(true)} />}

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
      
      <ProjectsPage 
        isOpen={isProjectsOpen} 
        onClose={() => setIsProjectsOpen(false)} 
      />

      {selectedProjectIndex !== null && (
        <ProjectModal 
          project={sharedProjects[selectedProjectIndex]}
          projects={sharedProjects}
          onClose={() => setSelectedProjectIndex(null)}
          onNext={() => setSelectedProjectIndex((selectedProjectIndex + 1) % sharedProjects.length)}
          onPrev={() => setSelectedProjectIndex((selectedProjectIndex - 1 + sharedProjects.length) % sharedProjects.length)}
          onOpenBooking={() => {
            setSelectedProjectIndex(null);
            setIsBookingOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default App;
