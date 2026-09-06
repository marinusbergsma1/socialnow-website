import React, { createContext, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { agents } from "./content";
export const styleOptions = [
  {
    id: "signature",
    name: "Signature",
    label: "Verfijnd & vertrouwd",
    description:
      "Het herkenbare SocialNow, volwassen uitgewerkt. Zwart, glazen details, glanzende knoppen en de vier Milo’s als gezicht.",
    site: "Een duidelijke belofte, met product, merk en mensen in balans.",
    os: "Dezelfde kaarten, typografie, Milo’s en acties in het dagelijkse werk.",
    recommend: true,
  },
  {
    id: "studio",
    name: "Studio",
    label: "Ruim & uitgesproken",
    description:
      "Meer ruimte voor het merk. Grote typografie, een centrale compositie en ruim baan voor echt beeld en motion.",
    site: "Een visuele merkervaring met een rustige, duidelijke route naar contact.",
    os: "Ruime modules en een visueel startscherm met duidelijke prioriteiten.",
  },
  {
    id: "focus",
    name: "Focus",
    label: "Compact & productgericht",
    description:
      "Een precieze indeling met compacte kaarten, heldere kaders en snelle routes. De Milo’s blijven de herkenbare specialisten.",
    site: "Sneller van de belofte naar het OS en het persoonlijke gesprek.",
    os: "Compacte bediening, consistente acties en overzichtelijke werkruimtes.",
  },
];
const StyleContext = createContext({
  style: "signature",
  choose: (_style: string) => {},
});
export function StyleProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("stijl");
  const [saved, setSaved] = useState("signature");
  const style = styleOptions.some((option) => option.id === query)
    ? query!
    : saved;
  useEffect(() => {
    if (query && styleOptions.some((option) => option.id === query)) {
      setSaved(query);
      try {
        sessionStorage.setItem("sn-preview-style", query);
      } catch {
        /* Private mode */
      }
    } else {
      try {
        const previous = sessionStorage.getItem("sn-preview-style");
        if (styleOptions.some((option) => option.id === previous))
          setSaved(previous!);
      } catch {
        /* Private mode */
      }
    }
  }, [query]);
  const choose = (value: string) => {
    if (!styleOptions.some((option) => option.id === value)) return;
    const search = new URLSearchParams(location.search);
    search.set("stijl", value);
    navigate(
      {
        pathname: location.pathname,
        search: search.toString(),
        hash: location.hash,
      },
      { replace: true },
    );
  };
  return (
    <StyleContext.Provider value={{ style, choose }}>
      {children}
    </StyleContext.Provider>
  );
}
export const useStyle = () => useContext(StyleContext);
export function StylePicker() {
  const { style, choose } = useStyle();
  return (
    <div className="h-style-picker">
      <Link to="/stijlen">3 stijlopties</Link>
      <div role="group" aria-label="Kies een stijl">
        {styleOptions.map((option) => (
          <button
            type="button"
            key={option.id}
            aria-pressed={style === option.id}
            onClick={() => choose(option.id)}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}
export function StyleOverview() {
  return (
    <section className="h-wrap h-style-overview">
      <p className="h-eyebrow">SocialNow / Eén geheel, drie richtingen</p>
      <h1>
        Welk SocialNow
        <br />
        <span>past bij jou?</span>
      </h1>
      <p className="h-intro">
        Dezelfde inhoud, vier Milo’s en functies. Drie manieren om de website en
        het OS als één herkenbaar geheel vorm te geven.
      </p>
      <div className="h-style-options">
        {styleOptions.map((option, index) => (
          <article key={option.id} data-option={option.id}>
            <div className="h-style-card-top">
              <span>0{index + 1}</span>
              {option.recommend && (
                <span>
                  <Check size={12} />
                  Aanbevolen
                </span>
              )}
            </div>
            <h2>{option.name}</h2>
            <p className="h-style-label">{option.label}</p>
            <div
              className="h-style-mini"
              aria-label={`Visuele richting ${option.name} voor website en OS`}
            >
              <div className="h-mini-site">
                <span>SocialNow</span>
                <strong>
                  Eén OS.
                  <br />
                  Echt van jou.
                </strong>
                <div>
                  {agents.map((agent) => (
                    <img
                      key={agent.id}
                      src={`/proposal/milo/${agent.id}.webp`}
                      alt={agent.name}
                      width="60"
                      height="60"
                      loading="lazy"
                    />
                  ))}
                </div>
                <b>
                  Ontdek het OS <ArrowUpRight size={10} />
                </b>
              </div>
              <div className="h-mini-os">
                <span>
                  Jouw OS <small>Website · CRM · Studio · Advertenties</small>
                </span>
                <div>
                  {agents.map((agent) => (
                    <div key={agent.id}>
                      <img
                        src={`/proposal/milo/${agent.id}.webp`}
                        alt=""
                        width="38"
                        height="38"
                        loading="lazy"
                      />
                      <strong>{agent.title}</strong>
                      <i />
                      <i />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p>{option.description}</p>
            <dl>
              <dt>Website</dt>
              <dd>{option.site}</dd>
              <dt>OS</dt>
              <dd>{option.os}</dd>
            </dl>
            <Link className="sn-btn3d h-button" to={`/?stijl=${option.id}`}>
              <span className="sn-btn3d-sheen" />
              <span>Bekijk {option.name}</span>
              <ArrowUpRight size={16} />
            </Link>
          </article>
        ))}
      </div>
      <p className="h-style-footnote">
        De OS-miniaturen tonen de visuele toepassing per richting. De live POC
        is hiermee nog niet gewijzigd. Alle drie gebruiken dezelfde content en
        techniek; het snelheidsverschil tussen de stijlen is niet gemeten.
      </p>
    </section>
  );
}

export function HeroTitle() {
  const { style } = useStyle();
  if (style === "studio")
    return (
      <h1>
        Jouw bedrijf.
        <br />
        <span>In één OS.</span>
      </h1>
    );
  if (style === "focus")
    return (
      <h1>
        Eén OS.
        <br />
        Vier Milo’s.
        <br />
        <span>Jouw bedrijf.</span>
      </h1>
    );
  return (
    <h1>
      Eén OS voor
      <br />
      je bedrijf.
      <br />
      <span>Echt van jou.</span>
    </h1>
  );
}
