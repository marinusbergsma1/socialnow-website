import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
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
import { StyleOverview, StylePicker, StyleProvider, useStyle } from "./styles";
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
    <StyleProvider>
      <MotionProvider>
        <ProposalShell />
      </MotionProvider>
    </StyleProvider>
  );
}
function ProposalShell() {
  const { style } = useStyle();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    setMenuOpen(false);
    const title =
      nav.find(([path]) => path === location.pathname)?.[1] || "SocialNow";
    document.title = `${title} — SocialNow websitevoorstel`;
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
    <div className="sn-site" data-style={style}>
      <LogoIntro />
      <a className="h-skip" href="#inhoud">
        Ga naar inhoud
      </a>
      <aside className="h-preview">
        <StylePicker />
        <a href="/">
          Huidige website
          <ArrowUpRight size={12} />
        </a>
      </aside>
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
            Claim jouw OS
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
          <Route path="/stijlen" element={<StyleOverview />} />
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
