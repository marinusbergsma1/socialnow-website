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
    image: `${import.meta.env.BASE_URL}screenshots/vdz-brigade-hero.webp`,
    fullPageScreenshot: `${import.meta.env.BASE_URL}screenshots/vdz-brigade-full.webp`,
    align: 'right',
    url: "https://vdz-brigade.nl",
    gallery: [],
    metrics: [
      { label: "Laadtijd", value: "<1.5s", color: "#25D366" },
      { label: "Mobiele Score", value: "95+", color: "#00A3E0" },
      { label: "Doorlooptijd", value: "3 weken", color: "#F7E644" }
    ]
  },
  {
    id: 7,
    slug: "raveg-bounce-my-curls",
    title: "RAVEG Bounce My Curls",
    category: "AI Web Development",
    client: "RAVEG",
    year: "2025",
    services: ["AI Website Development", "UX/UI Design", "Full-Stack Development", "E-Commerce"],
    description: "Een AI-gebouwde product website voor RAVEG's Bounce My Curls haarverzorgingslijn. Modern, strak en conversion-gericht.",
    image: `${import.meta.env.BASE_URL}screenshots/raveg-bounce-hero.webp`,
    fullPageScreenshot: `${import.meta.env.BASE_URL}screenshots/raveg-bounce-full.webp`,
    align: 'left',
    url: "https://raveg-bounce-my-curls-21026081538.us-west1.run.app/",
    gallery: [],
    metrics: [
      { label: "Conversie Boost", value: "+180%", color: "#25D366" },
      { label: "Bounce Rate", value: "-35%", color: "#00A3E0" },
      { label: "Doorlooptijd", value: "2 weken", color: "#F7E644" }
    ]
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
    image: `${import.meta.env.BASE_URL}screenshots/vintage-watches-hero.webp`,
    fullPageScreenshot: `${import.meta.env.BASE_URL}screenshots/vintage-watches-full.webp`,
    align: 'right',
    url: "https://socialnow-vintagewatchesdemeesters.github.io/website/index.html",
    gallery: [],
    metrics: [
      { label: "Sessieduur", value: "+210%", color: "#F7E644" },
      { label: "Pagina's/Sessie", value: "4.2x", color: "#25D366" },
      { label: "Premium Look", value: "100%", color: "#F62961" }
    ]
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
    image: `${import.meta.env.BASE_URL}screenshots/newblack-hero.webp`,
    fullPageScreenshot: `${import.meta.env.BASE_URL}screenshots/newblack-full.webp`,
    align: 'left',
    url: "https://newblack.netlify.app/",
    gallery: [],
    metrics: [
      { label: "Brand Awareness", value: "+320%", color: "#00A3E0" },
      { label: "Mobiele Score", value: "98", color: "#25D366" },
      { label: "Doorlooptijd", value: "4 weken", color: "#F7E644" }
    ]
  },
  {
    id: 11,
    slug: "divine-machines-website",
    title: "Divine Machines",
    category: "Web Design & Development",
    client: "Divine Machines",
    year: "2024",
    services: ["Web Design", "Web Development", "UX/UI Design", "Responsive Design"],
    description: "Een krachtige, donkere website voor Divine Machines. High-end design met sterke visuele impact en naadloze gebruikerservaring.",
    image: `${import.meta.env.BASE_URL}screenshots/divine-machines-hero.webp`,
    fullPageScreenshot: `${import.meta.env.BASE_URL}screenshots/divine-machines-full.webp`,
    align: 'right',
    url: "https://divinemachines.nl",
    gallery: [],
    metrics: [
      { label: "Online Verkoop", value: "+150%", color: "#25D366" },
      { label: "Laadtijd", value: "<2s", color: "#00A3E0" },
      { label: "Klant Retentie", value: "+85%", color: "#F62961" }
    ]
  },
  {
    id: 10,
    slug: "socialnow-website",
    title: "SocialNow",
    category: "AI Web Development",
    client: "SocialNow",
    year: "2026",
    services: ["AI Website Development", "Full-Stack React", "3D Animation", "UX/UI Design"],
    description: "Onze eigen website — gebouwd met React, Vite, en AI-gestuurde development. 3D PixelGlobe beeldmerk, infinite video slider, live website previews en cutting-edge design.",
    image: `${import.meta.env.BASE_URL}screenshots/socialnow-hero.webp`,
    fullPageScreenshot: `${import.meta.env.BASE_URL}screenshots/socialnow-full.webp`,
    align: 'left',
    url: "https://marinusbergsma1.github.io/socialnow-website/",
    gallery: [],
    metrics: [
      { label: "Lighthouse Score", value: "95+", color: "#25D366" },
      { label: "AI-Powered", value: "100%", color: "#00A3E0" },
      { label: "Doorlooptijd", value: "5 dagen", color: "#F62961" }
    ]
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
    ],
    metrics: [
      { label: "Social Bereik", value: "2M+", color: "#00A3E0" },
      { label: "Engagement", value: "+340%", color: "#25D366" },
      { label: "Campagnes", value: "12+", color: "#F7E644" }
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
    ],
    metrics: [
      { label: "Volgers Groei", value: "+25K", color: "#F62961" },
      { label: "Impressies", value: "5M+", color: "#00A3E0" },
      { label: "Engagement Rate", value: "8.2%", color: "#25D366" }
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
      "https://storage.googleapis.com/video-slider/RAVEG%20DYADIUM%20STORY.mp4",
      "https://storage.googleapis.com/video-slider/RAVEG_HYPERPOWER_VID_EN_2_STORY.mp4",
      "https://storage.googleapis.com/video-slider/RAVEG_HYPERPOWER_VID_EN_4_STORY.mp4"
    ],
    metrics: [
      { label: "Merkherkenning", value: "+400%", color: "#25D366" },
      { label: "Social Groei", value: "10K+", color: "#F62961" },
      { label: "Video Views", value: "500K+", color: "#00A3E0" }
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
    ],
    metrics: [
      { label: "Bezoekers", value: "15K+", color: "#F7E644" },
      { label: "Social Bereik", value: "1.2M", color: "#00A3E0" },
      { label: "Edities", value: "4", color: "#25D366" }
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
    ],
    metrics: [
      { label: "Merkbeleving", value: "+250%", color: "#F62961" },
      { label: "Oppervlakte", value: "400m\u00B2", color: "#F7E644" },
      { label: "Materialen", value: "15+", color: "#00A3E0" }
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
