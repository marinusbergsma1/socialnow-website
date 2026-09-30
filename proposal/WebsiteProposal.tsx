import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { CLAIM_URL } from "./os-entry";
import { Action } from "./ui";
import { Home } from "./pages";
// 30 september 2026 (Marinus: "WIL ECHT INSTANT LOADING"): elke pagina buiten de homepage is een eigen bestand dat pas
// laadt als iemand die pagina opent (proposal/later.tsx). Het eerste script draagt alleen de header en de hero.
import { OnderDeVouw, later } from "./later";
const BlogPage = later(() => import("./paginas").then((m) => m.BlogPage));
const BlogPostPage = later(() => import("./paginas").then((m) => m.BlogPostPage));
const ContactPage = later(() => import("./paginas").then((m) => m.ContactPage));
const NotFound = later(() => import("./paginas").then((m) => m.NotFound));
const OsPage = later(() => import("./paginas").then((m) => m.OsPage));
const PricesPage = later(() => import("./paginas").then((m) => m.PricesPage));
const ProjectPage = later(() => import("./paginas").then((m) => m.ProjectPage));
const ProjectsPage = later(() => import("./paginas").then((m) => m.ProjectsPage));
const ServicesPage = later(() => import("./paginas").then((m) => m.ServicesPage));
const TeamPage = later(() => import("./paginas").then((m) => m.TeamPage));
const AuditPage = later(() => import("./AuditPage").then((m) => m.AuditPage));
const VacaturesPage = later(() => import("./VacaturesPage").then((m) => m.VacaturesPage));
const InvesteerdersPage = later(() => import("./InvesteerdersPage").then((m) => m.InvesteerdersPage));
// Opmaak blijft statisch, op de plek van voorheen (zie pages.tsx).
import "./gratis-website.css";
import "./antwoord-pagina.css";
const GratisWebsite = later(() => import("./GratisWebsite").then((m) => m.default));
const GratisOsDemo = later(() => import("./GratisOsDemo").then((m) => m.default));
const AntwoordPagina = later(() => import("./AntwoordPagina").then((m) => m.default));
const VeiligheidPagina = later(() => import("./Veiligheid").then((m) => m.VeiligheidPagina));
// De welkomstdialoog hoort alleen bij een bezoek via de QR-code (?qr=os); alleen dan laadt hij.
const QrOsWelcome = later(() => import("./QrOsWelcome").then((m) => m.default));
const BrandFooter = later(() => import("./BrandFooter").then((m) => m.default));
import { MotionProvider } from "./motion";
import { projects } from "./content";
import { allPosts } from "../data/posts";
import LanguageSwitch from "./LanguageSwitch";
import { LanguageProvider, LANGUAGES, languagePrefix, type Language, useLanguage } from "./i18n/context";
const PrivacyPage = later(() => import("../components/PrivacyPage").then((m) => m.default));
const TermsPage = later(() => import("../components/TermsPage").then((m) => m.default));
// 19 september 2026: de juridische laag is van twee naar zeven documenten gegaan. DocumentPage
// dient ze alle zeven; JuridischPage is de hub waar ze bij elkaar staan.
const DocumentPage = later(() => import("../components/DocumentPage").then((m) => m.default));
const JuridischPage = later(() => import("../components/JuridischPage").then((m) => m.default));
// Staat uit tot er een script op de site komt dat toestemming nodig heeft; de afweging staat
// in het bestand zelf.
import Cookiebot from "./Cookiebot";
// 30 september 2026: geen toestemmingsvraag maar een eerlijke melding: er zijn geen trackingcookies.
import MiloKoekje from "./MiloKoekje";

const nav = [
  ["/het-os", "Het OS"],
  ["/projecten", "Ons werk"],
  ["/diensten", "Diensten"],
  ["/prijzen", "Aanbod"],
  ["/team", "Team"],
  ["/blog", "Blog"],
  ["/contact", "Contact"],
];
// Pagina's buiten het menu houden hun eigen titel, ook als je ze rechtstreeks opent.
const paginaTitels: Record<string, string> = {
  "/audit": "Gratis Google Ads audit",
  "/gratis-website": "Gratis website aanvragen",
  "/gratis-os-demo": "Gratis OS-demo",
  "/antwoord-aanvragen": "Antwoord op aanvragen",
  "/juridisch": "Juridisch en compliance",
  "/privacy": "Privacybeleid",
  "/voorwaarden": "Algemene voorwaarden",
  "/verwerkersovereenkomst": "Verwerkersovereenkomst",
  "/beveiliging": "Beveiliging",
  "/cookies": "Cookieverklaring",
  "/ai": "AI-verklaring",
  "/gebruik": "Aanvaardbaar gebruik",
  "/veiligheid": "Veiligheid en sleutelbelofte",
  "/investeerders": "Investeerders",
};
export default function WebsiteProposal({language="en"}:{language?:Language}) {
  return (
    <LanguageProvider language={language}><MotionProvider>
      <ProposalShell />
    </MotionProvider></LanguageProvider>
  );
}
function ProposalShell() {
  const {language,t}=useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  // 30 september 2026 (Marinus): "video aan het begin weglaten", "met os logo animatie gewoon beginnen". Geen introvideo meer.
  const introDone = true;
  // Pas na het monteren, zodat de voorgerenderde HTML (zonder dialoog) en de eerste weergave gelijk blijven.
  const [qrBezoek, zetQrBezoek] = useState(false);
  useEffect(() => { if (new URLSearchParams(window.location.search).get("qr") === "os") zetQrBezoek(true); }, []);
  const menuButton = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const mounted = useRef(false);
  // 30 september 2026: een pagina die later laadt (proposal/later.tsx) zet via useSEO eerst haar eigen titel en canonical;
  // zetMeta loopt daarna nog een keer (NaLaden hieronder), zodat de uitkomst per taal gelijk blijft aan voorheen.
  const zetMeta = () => {
    const project = projects.find(
      (item) => location.pathname === `/project/${item.slug}`,
    );
    const post = allPosts.find(
      (item) => location.pathname === `/blog/${item.slug}`,
    );
    // 28 september 2026: GitHub Pages opent een route ook met een slash erachter (/team/); zonder deze regel
    // viel de titel dan terug op "Probeer SocialNow OS" in plaats van de naam van de pagina.
    const pad = location.pathname.replace(/\/+$/, "") || "/";
    const title =
      project?.title ||
      post?.title ||
      nav.find(([path]) => path === pad)?.[1] ||
      paginaTitels[pad] ||
      "Van nul naar een draaiend bedrijf in één uur";
    const description =
      project?.description ||
      post?.excerpt ||
      "Van nul naar een draaiend bedrijf in één uur. Beantwoord tien vragen en je boekhouding, merk, website en socials staan klaar in één OS. Gratis te gebruiken; een OS op maat bouwen we vanaf €10.000.";
    // 30 september 2026: postbuild.mjs en localize-build.mjs zetten per route en per taal al de eigen title,
    // description en canonical in de html; alleen localize-build zet daarbij hreflang x-default. Daarna zette
    // deze regel op elke route de algemene zin en het menulabel terug, en Google (dat JavaScript uitvoert) zag
    // op 32 route-taalcombinaties de algemene zin. Wijst de canonical al naar deze pagina in deze taal, dan
    // blijft de meta uit de build staan; anders (404-terugval, taal via cookie omgezet, route buiten de
    // sitemap, navigeren binnen de app) zet de app hem zelf. Proef: scripts/check-meta-na-laden.py.
    const hier = `https://socialnow.nl${languagePrefix(language)}${pad}`.replace(/\/+$/, "");
    const vanBuild =
      document.querySelector('link[hreflang="x-default"]') !== null &&
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.replace(/\/+$/, "") === hier;
    if (!vanBuild) document.title = `${t(title)} | SocialNow`;
    if (!vanBuild) for (const [selector, content] of [
      ['meta[name="description"]', t(description)],
      ['meta[property="og:title"]', document.title],
      ['meta[property="og:description"]', t(description)],
      ['meta[property="og:url"]', `https://socialnow.nl${languagePrefix(language)}${location.pathname}`],
      ['meta[name="twitter:title"]', document.title],
      ['meta[name="twitter:description"]', t(description)],
    ])
      document.querySelector(selector)?.setAttribute("content", content);
    if (!vanBuild) document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `https://socialnow.nl${languagePrefix(language)}${location.pathname}`);
    if (!vanBuild) for (const lang of [...LANGUAGES, "x-default"]) document.querySelector(`link[hreflang="${lang}"]`)?.setAttribute("href", `https://socialnow.nl${lang === "x-default" ? "" : languagePrefix(lang as Language)}${location.pathname}`);
  };
  useEffect(() => {
    setMenuOpen(false);
    zetMeta();
    const id = window.requestAnimationFrame(() => {
      if (location.hash)
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView({ block: "start" });
      else {
        window.scrollTo({ top: 0, behavior: "instant" });
        if (mounted.current) main.current?.focus({ preventScroll: true });
      }
      mounted.current = true;
    });
    return () => window.cancelAnimationFrame(id);
  }, [location.pathname, location.hash, language]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);
  if (location.pathname.replace(/\/+$/, "") === "/antwoord-aanvragen") return <div className="sn-site" data-style="signature"><main id="inhoud"><Suspense fallback={null}><AntwoordPagina /></Suspense></main></div>;
  return (
    <div className="sn-site" data-style="signature">
      {qrBezoek && <Suspense fallback={null}><QrOsWelcome ready={introDone} /></Suspense>}
      <a className="h-skip" href="#inhoud">
        Ga naar inhoud
      </a>
      <header className="h-header">
        <div className="h-wrap h-nav">
          <Link
            className="h-brand"
            to="/"
            aria-label="SocialNow, naar de homepage"
          >
            <img
              src="/images/klein/SocialNow-Logo-2026-400.webp"
              srcSet="/images/klein/SocialNow-Logo-2026-400.webp 400w, /images/klein/SocialNow-Logo-2026-600.webp 600w"
              sizes="200px"
              alt="SocialNow"
              width="200"
              height="38"
            />
          </Link>
          <nav className="h-desktop-nav" aria-label="Hoofdnavigatie">
            {nav.map(([path, title]) => (
              <NavLink key={path} to={path}>
                {title}
              </NavLink>
            ))}
          </nav>
          <LanguageSwitch />
          {/* 26 september 2026 (Marinus): geen reclame in de header, rechtsboven de login voor het gratis OS. */}
          <a className="h-header-claim" href="https://app.socialnow.nl/login/">
            Inloggen gratis OS
            <ArrowUpRight size={15} />
          </a>
          <button
            className="h-menu-toggle"
            type="button"
            ref={menuButton}
            aria-controls="mobile-nav"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
        <nav
          id="mobile-nav"
          className="h-mobile-nav h-wrap"
          aria-label="Mobiele navigatie"
          hidden={!menuOpen}
        >
          {[["/", "Home"], ...nav].map(([path, title]) => (
            <NavLink
              key={path}
              end={path === "/"}
              to={path}
              onClick={() => setMenuOpen(false)}
            >
              {title}
              <ArrowUpRight size={17} />
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="inhoud" ref={main} tabIndex={-1}>
        <Suspense fallback={<div aria-hidden="true" style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stijlen" element={<Navigate to="/" replace />} />
          <Route path="/het-os" element={<OsPage />} />
          <Route path="/projecten" element={<ProjectsPage />} />
          <Route path="/project/:slug" element={<ProjectPage />} />
          <Route path="/diensten" element={<ServicesPage />} />
          <Route path="/prijzen" element={<PricesPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/vacatures" element={<VacaturesPage />} />
          {/* 28 september 2026 (Marinus): investeerders doen een aanvraag naar invest@. /investors is een alias. */}
          <Route path="/investeerders" element={<InvesteerdersPage />} />
          <Route path="/investors" element={<Navigate to="/investeerders" replace />} />
          <Route path="/gratis-website" element={<GratisWebsite />} />
          <Route path="/gratis-os-demo" element={<GratisOsDemo />} />
          <Route path="/antwoord-aanvragen" element={<AntwoordPagina />} />
          {/* 28 september 2026: veiligheidsvideo en sleutelbelofte. /security is een alias. */}
          <Route path="/veiligheid" element={<VeiligheidPagina />} />
          <Route path="/security" element={<Navigate to="/veiligheid" replace />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route
            path="/contact"
            element={
              <ContactPage
                key={
                  new URLSearchParams(location.search).get("onderwerp") ||
                  "Custom OS"
                }
              />
            }
          />
          <Route
            path="/privacy"
            element={
              <div className="h-privacy">
                <PrivacyPage />
              </div>
            }
          />
          <Route
            path="/voorwaarden"
            element={
              <div className="h-privacy">
                <TermsPage />
              </div>
            }
          />
          <Route path="/juridisch" element={<div className="h-privacy"><JuridischPage /></div>} />
          {["verwerkersovereenkomst", "beveiliging", "cookies", "ai", "gebruik"].map((slug) => (
            <Route key={slug} path={`/${slug}`} element={<div className="h-privacy"><DocumentPage slug={slug} /></div>} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <NaLaden key={location.pathname} klaar={() => {
          zetMeta();
          if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ block: "start" });
        }} />
        </Suspense>
      </main>
      <OnderDeVouw ruimte={false}><BrandFooter /></OnderDeVouw>
      {/* 27 september 2026: de onboarding-popup (ConsentPopup) is op verzoek van Marinus van de site gehaald. */}
      <Cookiebot />
      <MiloKoekje />
    </div>
  );
}

// Loopt zodra de pagina van deze route echt op het scherm staat, ook als die later laadde.
function NaLaden({ klaar }: { klaar: () => void }) {
  useEffect(() => { klaar(); }, []);
  return null;
}
