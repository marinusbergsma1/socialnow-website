import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import WebsiteProposal from "./WebsiteProposal";
import "../index.css";
import "./website.css";
import "./experience.css";

// De oude directe dev-ingang blijft bruikbaar; alle echte previewroutes
// leven onder /voorstel en kunnen ook rechtstreeks worden geopend.
if (window.location.pathname === "/voorstel.html") {
  window.history.replaceState(
    null,
    "",
    `/voorstel/${window.location.search}${window.location.hash}`,
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/voorstel">
      <WebsiteProposal />
    </BrowserRouter>
  </React.StrictMode>,
);
