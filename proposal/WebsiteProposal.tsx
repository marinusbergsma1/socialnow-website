import React, { useEffect, useRef, useState } from "react";
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
import { Action, MiloGuide } from "./ui";
import {
  BlogPage,
  BlogPostPage,
  ContactPage,
  Home,
  NotFound,
  OsPage,
  PricesPage,
  ProjectPage,
  ProjectsPage,
  ServicesPage,
  TeamPage,
} from "./pages";
import LogoIntro from "./LogoIntro";
import BrandFooter from "./BrandFooter";
import { MotionProvider } from "./motion";
import { projects } from "./content";
import { allPosts } from "../data/posts";
import PrivacyPage from "../components/PrivacyPage";

const nav = [
  ["/het-os", "Het OS"],
  ["/projecten", "Ons werk"],
  ["/diensten", "Diensten"],
  ["/prijzen", "Aanbod"],
  ["/team", "Team"],
  ["/blog", "Blog"],
  ["/contact", "Contact"],
];
export default function WebsiteProposal() {
  return (
    <MotionProvider>
      <ProposalShell />
    </MotionProvider>
  );
}
function ProposalShell() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    setMenuOpen(false);
    const project = projects.find(
      (item) => location.pathname === `/project/${item.slug}`,
    );
    const post = allPosts.find(
      (item) => location.pathname === `/blog/${item.slug}`,
    );
    const title =
      project?.title ||
      post?.title ||
      nav.find(([path]) => path === location.pathname)?.[1] ||
      "Probeer SocialNow OS";
    const description =
      project?.description ||
      post?.excerpt ||
      "Probeer SocialNow OS en ontdek hoe het werkt. Vier Milo’s, één overzichtelijke omgeving. Ervaar eerst het gemak; daarna bouwen we samen jouw Custom OS.";
    document.title = `${title} | SocialNow`;
    for (const [selector, content] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', document.title],
      ['meta[property="og:description"]', description],
      ['meta[property="og:url"]', `https://socialnow.nl${location.pathname}`],
      ['meta[name="twitter:title"]', document.title],
      ['meta[name="twitter:description"]', description],
    ])
      document.querySelector(selector)?.setAttribute("content", content);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `https://socialnow.nl${location.pathname}`);
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
  }, [location.pathname, location.hash]);
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
  return (
    <div className="sn-site" data-style="signature">
      <LogoIntro />
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
              src="/images/SocialNow-Logo-2026.webp"
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
          <a className="h-header-claim" href={CLAIM_URL}>
            Probeer het OS
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stijlen" element={<Navigate to="/" replace />} />
          <Route path="/het-os" element={<OsPage />} />
          <Route path="/projecten" element={<ProjectsPage />} />
          <Route path="/project/:slug" element={<ProjectPage />} />
          <Route path="/diensten" element={<ServicesPage />} />
          <Route path="/prijzen" element={<PricesPage />} />
          <Route path="/team" element={<TeamPage />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BrandFooter />
      <MiloGuide />
    </div>
  );
}
