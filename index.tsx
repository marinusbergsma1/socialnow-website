import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./proposal/WebsiteProposal";
import { isLanguage, type Language } from "./proposal/i18n/context";
import "./proposal/website.css";
import "./proposal/experience.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 16 september 2026: zes talen, elk onder een eigen voorvoegsel (/nl, /de, /fr, /it, /es); Engels
// zonder voorvoegsel.
const root = ReactDOM.createRoot(rootElement);
const match = window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/);
const language: Language = match && isLanguage(match[1]) ? match[1] : "en";
root.render(
  <React.StrictMode>
    <BrowserRouter basename={language === "en" ? "/" : `/${language}`}>
      <App language={language} />
    </BrowserRouter>
  </React.StrictMode>,
);
