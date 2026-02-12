import { Project } from '../types';

// --- WEB DESIGN & DEVELOPMENT SHOWCASE (aparte sectie op homepage) ---
export const webShowcaseProjects: Project[] = [
  {
    id: 6,
    slug: "vdz-brigade-website",
    title: "VDZ Brigade",
    category: "AI Web Development",
    client: "VDZ Brigade",
    year: "2025",
    services: ["AI Website Development", "UX/UI Design", "Full-Stack Development", "Responsive Design"],
    description: "Een complete website met AI-gestuurde technologie. Modern platform met responsief design en snelle laadtijden.",
    image: `${import.meta.env.BASE_URL}screenshots/vdz-brigade-hero.jpg`,
    fullPageScreenshot: `${import.meta.env.BASE_URL}screenshots/vdz-brigade-full.jpg`,
    align: 'right',
    url: "https://vdz-brigade.nl",
    gallery: []
  },
  {
    id: 7,
    slug: "divine-machines-website",
    title: "Divine Machines",
    category: "AI Web Development",
    client: "Divine Machines",
    year: "2025",
    services: ["AI Website Development", "UX/UI Design", "Full-Stack Development", "Creative Direction"],
    description: "High-performance website met AI-driven development. Strak design en technische precisie.",
    image: `${import.meta.env.BASE_URL}screenshots/divine-machines-hero.jpg`,
    fullPageScreenshot: `${import.meta.env.BASE_URL}screenshots/divine-machines-full.jpg`,
    align: 'left',
    url: "https://divinemachines.nl",
    gallery: []
  },
  {
    id: 8,
    slug: "vintage-watches-website",
    title: "Vintage Watches",
    category: "Web Design & Development",
    client: "Vintage Watches De Meesters",
    year: "2025",
    services: ["Web Design", "Web Development", "E-Commerce", "UX/UI Design"],
    description: "Luxueuze, donkere website met premium uitstraling. Goud-accenten en elegante typografie.",
    image: `${import.meta.env.BASE_URL}screenshots/vintage-watches-hero.jpg`,
    fullPageScreenshot: `${import.meta.env.BASE_URL}screenshots/vintage-watches-full.jpg`,
    align: 'right',
    url: "https://socialnow-vintagewatchesdemeesters.github.io/website/index.html",
    gallery: []
  },
  {
    id: 9,
    slug: "newblack-website",
    title: "NewBlack Fashion",
    category: "Web Design & Development",
    client: "NewBlack",
    year: "2025",
    services: ["Web Design", "Web Development", "Branding", "Creative Direction"],
    description: "Stijlvolle high-end website voor de internationale fashion industrie. Minimalistisch en krachtig.",
    image: `${import.meta.env.BASE_URL}screenshots/newblack-hero.jpg`,
    fullPageScreenshot: `${import.meta.env.BASE_URL}screenshots/newblack-full.jpg`,
    align: 'left',
    url: "https://newblack.netlify.app/",
    gallery: []
  }
];

// --- CASE STUDIES (branding, campaigns, etc.) ---
export const allProjects: Project[] = [
  {
    id: 1,
    slug: "universal-sony-banners",
    title: "Banners & Socials",
    category: "Universal Studios, Sony",
    client: "Universal / Sony Pictures",
    year: "2023 - 2024",
    services: ["Campaign Design", "Social Media", "Digital OOH Media", "Offline Media"],
    description: "Voor diverse filmreleases van UNIVERSAL_NL en SonyPicturesNL ontwikkelden wij geïntegreerde on- en offline campagnes die de bioscooplanceringen direct ondersteunden door meer bezoekers te trekken, de zichtbaarheid van de films te vergroten en het publiek online én offline te enthousiasmeren.",
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
    slug: "az-alkmaar-socials",
    title: "Social Artworks",
    category: "Voetbalclub AZ",
    client: "AZ Alkmaar",
    year: "Ongoing",
    services: ["Social Media Design", "Webvisuals", "Campaign Design", "UX/UI Visuals", "Branding"],
    description: "Voor AZ ontwierpen wij diverse socialmediaposts en websitevisuals, waaronder dankuitingen voor spelers, wedstrijdwijzigingen en campagnes voor de jeugdteams. Daarnaast ontwikkelden we nieuwe headers en home-achtergronden voor de spelerspagina's op AZ.nl.",
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
    slug: "raveg-branding",
    title: "Performance Branding",
    category: "RAVEG",
    client: "RAVEG",
    year: "2024",
    services: ["Branding", "Visual Identity", "Webdesign", "Video & Motion Design", "Content Creation"],
    description: "Voor RAVEG ontwikkelden wij de volledige branding vanaf de start, opgebouwd tot een herkenbare en consistente merkidentiteit. Deze werd doorvertaald naar een moderne website en dynamische video- en motion design-content.",
    image: "https://i.ibb.co/yBXWFYqx/RAVEG-Hyperpower.webp",
    align: 'left',
    gallery: [
      "/socialnow-website/videos/raveg-dyadium.mp4",
      "https://storage.googleapis.com/video-slider/RAVEG_HYPERPOWER_VID_EN_2_STORY.mp4",
      "https://storage.googleapis.com/video-slider/RAVEG_HYPERPOWER_VID_EN_4_STORY.mp4"
    ]
  },
  {
    id: 3,
    slug: "kids-heroes-content",
    title: "Content Engine",
    category: "Kids Heroes",
    client: "DAY&NITE",
    year: "2024",
    services: ["Campaign Design", "Social Media", "Digital OOH Media", "Offline Media"],
    description: "Voor Kids Heroes verzorgden wij de complete branding en uitvoering van de campagnes, verspreid over meerdere edities. Van concept en planning tot de doorvertaling naar social media, drukwerk en eventaankleding.",
    image: "https://i.ibb.co/tTCTL6DZ/Slider-Mobiel-Kids-Heroes-Koningshoek-1.webp",
    align: 'right',
    gallery: [
      "https://i.ibb.co/HD1RJt2z/1200x1200-Kids-Heroes-Koningshoek2-1.webp",
      "https://i.ibb.co/LXBkrK52/1200x1200-Kids-Heroes-Koningshoek3-1.webp",
      "https://i.ibb.co/tTCTL6DZ/Slider-Mobiel-Kids-Heroes-Koningshoek-1.webp"
    ]
  },
  {
    id: 4,
    slug: "print-bind-interieur",
    title: "Creative Interieurdesign",
    category: "Print & Bind",
    client: "Print & Bind Amsterdam",
    year: "2023",
    services: ["Brand Activation", "Environmental Design", "Print Design", "Visual Identity", "Signage"],
    description: "Voor Print&Bind verzorgden wij de visuele aankleding en merkdoorvertaling, met als doel de merkidentiteit ook fysiek tot leven te brengen op de werkvloer. Het volledige pand werd voorzien van banners en stickers.",
    image: "https://i.ibb.co/wZwdpDnY/666f15bbb49442553d264e6d-PRINT-BIND.webp",
    align: 'left',
    gallery: [
      "https://i.ibb.co/8D1GLhGM/Bannert.webp",
      "https://i.ibb.co/xSTR7yV9/Meeting-Room-2.webp",
      "https://i.ibb.co/998R1QP8/IMG-1686.webp"
    ]
  }
];

export const featuredProjects = allProjects.filter(p => [1, 5, 2, 3, 4].includes(p.id));

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find(p => p.slug === slug);
}

export function getAdjacentProjects(slug: string): { prev: Project; next: Project } {
  const idx = allProjects.findIndex(p => p.slug === slug);
  const total = allProjects.length;
  return {
    prev: allProjects[(idx - 1 + total) % total],
    next: allProjects[(idx + 1) % total],
  };
}
