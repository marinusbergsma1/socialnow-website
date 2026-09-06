import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./proposal/WebsiteProposal";
import "./proposal/website.css";
import "./proposal/experience.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const dutch = /^\/nl(?:\/|$)/.test(window.location.pathname);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={dutch ? "/nl" : "/"}>
      <App language={dutch ? "nl" : "en"} />
    </BrowserRouter>
  </React.StrictMode>,
);
