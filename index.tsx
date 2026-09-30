import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./proposal/WebsiteProposal";
import { isLanguage, type Language } from "./proposal/i18n/context";
import "./proposal/website.css";
import "./proposal/experience.css";
import { detectVisitorLanguage } from "./proposal/i18n/detect";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
async function start() {
  await detectVisitorLanguage();
  const match = window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  const language: Language = match && isLanguage(match[1]) ? match[1] : "en";
  root.render(
    <React.StrictMode>
      <BrowserRouter basename={language === "en" ? "/" : `/${language}`}>
        <App language={language} />
      </BrowserRouter>
    </React.StrictMode>,
  );
}
void start();
