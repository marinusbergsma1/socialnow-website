// 30 september 2026: de JavaScript van secties en pagina's laadt later (proposal/later.tsx), hun opmaak niet. Die blijft
// in het ene css-bestand op precies dezelfde plek in de volgorde als voorheen, zodat er niets anders valt.
import "./milo-vragen.css";
import React, { useState } from "react";
import "./hero-c.css";
// 30 september 2026: secties onder de vouw en onderdelen van andere pagina's laden later (proposal/later.tsx).
import { OnderDeVouw, later } from "./later";
const MiloVragen = later(() => import("./MiloVragen").then((m) => m.default));
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CONTACT_MAIL, heeftWhatsApp, mailLink, whatsappLink } from "./aanvragen";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { HeroTitle } from "./styles";
import { MiloMotion, miloPoster } from "./motion";
import { klein, useDichtbij, useNaBeeld } from "./licht";
import CharacterAccent from "./CharacterAccent";
import { LanguageContext, translate, useLanguage } from "./i18n/context";
import TeamTrust, { INTEGRATIES, TeamJoin } from "./TeamTrust";
const Verhaal = later(() => import("./Verhaal").then((m) => m.default));
import { Bento, Tegel } from "./Bento";
import "./bereikt.css";
import "./mens-en-ai.css";
import "./vacatures-bento.css";
import "./veiligheid.css";
import "./audit.css";
import "./cases.css";
import "./media-bento.css";
import "./pricing.css";
import "./site-visie.css";
const Deuren = later(() => import("./Deuren").then((m) => m.default));
import { FILMS as VEILIGHEIDSFILMS, filmPad as veiligheidFilm, filmPosterPad as veiligheidPoster } from "./veiligheid-beloftes";
const Bereikt = later(() => import("./Bereikt").then((m) => m.default));
const NulNaarBedrijf = later(() => import("./NulNaarBedrijf").then((m) => m.default));
const MensEnAI = later(() => import("./MensEnAI").then((m) => m.default));
const VacaturesBento = later(() => import("./VacaturesBento").then((m) => m.default));
const VeiligheidBlok = later(() => import("./Veiligheid").then((m) => m.default));
const TrustStories = later(() => import("./TrustStories").then((m) => m.default));
import BrandGlobe from "./BrandGlobe";
import WereldKaart from "./WereldKaart";
import OsEntry, { CLAIM_URL, OsDock, REVIEWS_URL } from "./os-entry";
import { agents, people, projects, services } from "./content";
import {
  Action,
  AgentCards,
  ConversionBridge,
  HeroMilos,
  Heading,
  MiloPortrait,
  PageHeading,
  ProjectCard,
  Questions,
  TeamGrid,
  TextLink,
  VideoBlock,
} from "./ui";

function Film({ src, poster, label, titel, klasse, geluid, zetGeluid, boven }: { src: string; poster: string; label: string; titel: string; klasse: string; geluid: boolean; zetGeluid: (aan: boolean) => void; boven?: React.ReactNode }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => { if (ref.current) ref.current.muted = !geluid; }, [geluid]);
  // 30 september 2026 (Marinus): "WIL ECHT INSTANT LOADING". De film laadt en start pas als de poster (het eerste beeld) staat.
  const klaar = useNaBeeld(poster);
  React.useEffect(() => { if (klaar && ref.current) void ref.current.play().catch(() => {}); }, [klaar]);
  const wissel = () => {
    const film = ref.current;
    if (film && !geluid) { film.currentTime = 0; void film.play().catch(() => {}); }
    zetGeluid(!geluid);
  };
  return (
    <div className={klasse}>
      {/* 26 september 2026 (Marinus): "video's iets groter met titels erboven". */}
      {boven}
      <p className="h-film-titel">{titel}</p>
      <div className="h-film-vak">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} />
      <button type="button" className="h-hero-film-geluid" onClick={wissel} aria-pressed={geluid}>
        {geluid ? "Geluid uit" : "Geluid aan"}
      </button>
      </div>
    </div>
  );
}

function VeiligheidSpeler({ geluid, zetGeluid }: { geluid: boolean; zetGeluid: (aan: boolean) => void }) {
  const { language } = useLanguage();
  const taal = language === "nl" ? "nl" : "en";
  const [nummer, setNummer] = useState(0);
  const ref = React.useRef<HTMLVideoElement>(null);
  const film = VEILIGHEIDSFILMS[nummer];
  React.useEffect(() => { if (ref.current) ref.current.muted = !geluid; }, [geluid, nummer, taal]);
  // 30 september 2026 (Marinus): "WIL ECHT INSTANT LOADING". Onder de vouw: poster en film laden pas als het blok dichtbij komt
  // (preload="none" zonder autoPlay haalt niets op tot play()).
  const { ref: vak, dichtbij } = useDichtbij<HTMLDivElement>();
  React.useEffect(() => { if (dichtbij && ref.current) void ref.current.play().catch(() => {}); }, [dichtbij, nummer, taal]);
  // Een nieuw nummer geeft een nieuw videovak (key), dat het effect hierboven start.
  const kies = (index: number) => setNummer(index);
  const wissel = () => {
    const video = ref.current;
    if (video && !geluid) { video.currentTime = 0; void video.play().catch(() => {}); }
    zetGeluid(!geluid);
  };
  return (
    <div className="h-film-veilig">
      <p className="h-film-titel">Veiligheid en databescherming</p>
      <div className="h-film-vak" ref={vak}>
        <video
          ref={ref}
          key={`${film.slug}-${taal}`}
          src={veiligheidFilm(film.slug, taal)}
          poster={dichtbij ? veiligheidPoster(film.slug, taal) : undefined}
          muted
          playsInline
          preload="none"
          onEnded={() => kies((nummer + 1) % VEILIGHEIDSFILMS.length)}
          aria-label={film.kop}
        />
        <button type="button" className="h-hero-film-geluid" onClick={wissel} aria-pressed={geluid}>
          {geluid ? "Geluid uit" : "Geluid aan"}
        </button>
      </div>
      <ol className="h-veilig-nummers">
        {VEILIGHEIDSFILMS.map((item, index) => (
          <li key={item.slug}>
            <button type="button" onClick={() => kies(index)} aria-current={index === nummer ? "true" : undefined}>
              <b>{index + 1}</b>
              <span>{item.kop}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

// 30 september 2026 (Marinus): "wel veel", "iets zakelijker en meer rust". Rechts alleen de OS-film; de
// veiligheidsfilms staan onder de vouw (HeroVeilig). Home houdt bij welke film geluid heeft, één tegelijk.
type HeroGeluid = "" | "os" | "veilig";
// 30 september 2026: de poster is het eerste beeld van de hero; 1280 px WebP van 27 KB in plaats van een JPEG van 125 KB.
const HERO_POSTER = "/video/os/os-booth-en-poster.webp";
function HeroFilm({ geluid, setGeluid, children }: { geluid: HeroGeluid; setGeluid: (g: HeroGeluid) => void; children?: React.ReactNode }) {
  const klaar = useNaBeeld(HERO_POSTER);
  return (
    <div className="h-hero-film h-hero-films is-os-veilig">
      <Film
        klasse="h-film-os"
        src="/video/os/os-booth-en.mp4"
        poster={HERO_POSTER}
        label="SocialNow OS explainer"
        titel="Zo werkt SocialNow OS"
        boven={
          // 26 september 2026 (Marinus): "Milo's klein boven How SocialNow OS works".
          // 30 september 2026 (Marinus): header 4C, de vier Milo's als pillen met hun naam.
          <div className="h-milo-pillen" translate="no">
            {agents.slice(0, 4).map((agent) => (
              <span key={agent.id} className="h-milo-pil"><MiloMotion role={agent.id} name={agent.name} maat={128} wacht={!klaar} /><b>{agent.name}</b></span>
            ))}
          </div>
        }
        geluid={geluid === "os"}
        zetGeluid={(aan) => setGeluid(aan ? "os" : "")}
      />
      {children}
    </div>
  );
}

// 30 september 2026 (Marinus): "DEZE MOET JUIST LIGGEND ZIJN, IK EEN BLOK EN SID EEN BLOK ALS SPREKERS PLUS DEZE FOTO VAN
// HEM, met de achtergrondkleur van Attesso" en "Deze nog groot maken en Attesso een belangrijk onderdeel, dat we dit echt samen
// doen, lezingen geven". Liggend blok over de hele breedte: links de uitnodiging, rechts twee sprekers. Sid in Attesso-roze.
// Het vierkante portret vult een staande kaart: de getoonde maat is de hoogte van de kaart (ongeveer 30vw op de pc).
const SPREKER_MAAT = "(max-width: 900px) 55vw, 30vw";
function HeroSprekers() {
  return (
    <section className="h-sprekers" aria-labelledby="h-sprekers-kop" translate="no">
      <div className="h-sprekers-tekst">
        <p className="h-sprekers-label">SocialNow <span aria-hidden="true">&times;</span> <code>~/attesso</code></p>
        <h2 id="h-sprekers-kop">Book a free live demo</h2>
        <p>SocialNow and Attesso build this together. The OS runs your business, Attesso makes every payment safe and approved. Together we give live demos, talks and workshops, anywhere in the world.</p>
        {/* 30 september 2026 (Marinus): "WE ARE BORN TO INSPIRE! ... BELIEVE IN HUMAN CREATIVITY POWERED BY AI TECHNOLOGY!", met genoeg enters. */}
        <div className="h-sprekers-manifest">
          <p className="is-kop">We are born to inspire!</p>
          <p>Not by the limitations of <b>big tech</b>,<br />but by the possibilities.</p>
          <p>Currently open to talk with everybody about telling our story,</p>
          <p>because we believe in <strong>human connection powered by AI technology!</strong></p>
        </div>
        <div className="h-sprekers-knoppen">
          <a className="h-sprekers-knop" href={mailLink("Free end to end demo with Marinus and Sid")}>Book a free live demo <span aria-hidden="true">&#8599;</span></a>
          <a className="h-sprekers-link" href={mailLink("Talk or workshop with Marinus and Sid")}>Book us for a talk</a>
        </div>
      </div>
      <figure className="h-spreker is-socialnow">
        <img {...klein("marinus-profiel-blauw.webp", SPREKER_MAAT, [480, 800])} alt="Marinus Bergsma" width="520" height="520" loading="lazy" decoding="async" />
        <figcaption><b>Marinus Bergsma</b><span>Founder, SocialNow</span></figcaption>
      </figure>
      <figure className="h-spreker is-attesso">
        <img {...klein("sid-attesso.webp", SPREKER_MAAT, [480, 800])} alt="Sid van Kalken" width="520" height="520" loading="lazy" decoding="async" />
        <figcaption><b>Sid van Kalken</b><span><code>~/attesso</code></span></figcaption>
      </figure>
    </section>
  );
}

function HeroVeilig({ geluid, setGeluid }: { geluid: HeroGeluid; setGeluid: (g: HeroGeluid) => void }) {
  return (
    <div className="h-hero-veilig">
      <VeiligheidSpeler geluid={geluid === "veilig"} zetGeluid={(aan) => setGeluid(aan ? "veilig" : "")} />
    </div>
  );
}

// 26 september 2026 (Marinus): "die andere taal en terug naar Engels om de 5 seconden, maar dan in het
// gehele headervlak". De hele hero krijgt de getoonde taal; de echte taal van de pagina blijft staan.
// Bij elke wissel faden de teksten zacht opnieuw in (h-taalfase a/b, zodat de animatie opnieuw start).
function useTaalfase(getoond: string) {
  const fase = React.useRef({ taal: getoond, n: 0 });
  if (fase.current.taal !== getoond) fase.current = { taal: getoond, n: fase.current.n + 1 };
  return fase.current.n === 0 ? undefined : fase.current.n % 2 ? "a" : "b";
}

// 5 oktober 2026 (Marinus): "Even goeie Linkbuilding opzetten ook naar Rabobank en ADYEN etc." Elk merk linkt naar de eigen
// site, met rel="noopener" zonder noreferrer, zodat de partner socialnow.nl als verwijzer ziet.
// 5 oktober 2026: wie uit het team achter elk onderdeel van het OS staat (zie ook FUNCTIES in TeamTrust.tsx).
const OS_MENSEN: Record<string, string[]> = {
  website: ["Sid van Kalken", "Antony Soosaipillaj"],
  crm: ["Steef Komen", "Michelle Yang"],
  content: ["Carmel Boon", "Sam van der Sluis", "Emma Peperkamp"],
  ads: ["Jos Hollenberg", "Sergio Jovovic", "Nick van Keulen"],
};

const TALKING_TO: [naam: string, url: string, logo: string, breed: number, hoog: number][] = [
  ["Visa", "https://www.visa.nl", "/images/partners/betalen/visa.svg", 24, 8],
  ["Mastercard", "https://www.mastercard.nl", "/images/partners/betalen/mastercard.svg", 152, 94],
  ["Airwallex", "https://www.airwallex.com", "/images/partners/betalen/airwallex.webp", 960, 132],
  ["Adyen", "https://www.adyen.com", "/images/partners/betalen/adyen.svg", 24, 8],
  ["Rabobank", "https://www.rabobank.nl", "/images/partners/betalen/rabobank.svg", 54, 10],
];

export function Home() {
  const { language, t } = useLanguage();
  // 26 september 2026 (Marinus): "ik wil niet dat de taal meer wijzigt". De hero toont de paginataal.
  const getoond = language;
  const taalfase = useTaalfase(getoond);
  const [heroGeluid, setHeroGeluid] = useState<HeroGeluid>("");
  return (
    <>
      <LanguageContext.Provider value={getoond}>
      <section className="h-hero" id="home" data-taalfase={taalfase}>
        <div className="h-hero-background">
          <BrandGlobe />
        </div>
        <div className="h-wrap h-hero-content">
          <div className="h-hero-tekst">
          {/* 26 september 2026 (Marinus): "op mijn header mag alle reclame weg". Geen stand, geen actie, geen
              tellers meer; een persoonlijk bedankje en één duidelijke login voor het gratis OS. */}
          {/* 26 september 2026 (Marinus): "SocialNow OS logo hoeft er niet bij, team er wel bij". */}
          {/* 1 oktober 2026 (Marinus): "SocialNowOS mag gwn boven hier weg." Geen logo-animatie meer boven het team; het
              SocialNow-logo staat al in de menubalk. */}
          <TeamTrust />
          <HeroTitle />
          {/* 30 september 2026 (Marinus): "na de Let's get SocialNow ... die inlog daar en daaronder de rest van de merken
              en logo's". De login staat direct onder de kop; Odoo, Salesforce, Attesso, statement en demo volgen. */}
          <div className="h-knoppen">
            <div className="os-entry">
              <OsDock held />
            </div>
          </div>
          {/* 30 september 2026 (Marinus): header 4C, overzichtelijker. Odoo, Salesforce en de betaalpartner op twee regels. */}
          <div className="h-integratie" translate="no">
            <p className="h-integratie-rij">
              {/* 5 oktober 2026 (Marinus): "Even goeie Linkbuilding opzetten ook naar Rabobank en ADYEN etc." Elk merk in de hero linkt
                  naar de eigen site. rel="noopener" zonder noreferrer, zodat de partner socialnow.nl als verwijzer ziet. */}
              <a className="h-integratie-odoo" href="https://www.odoo.com" target="_blank" rel="noopener" aria-label="Odoo"><svg viewBox="140 146 640 250" role="img" aria-label="Odoo">
                  <path fill="#8f8f8f" d="M695,346a75,75,0,1,1,75-75A75,75,0,0,1,695,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,695,315ZM538,346a75,75,0,1,1,75-75A75,75,0,0,1,538,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,538,315Zm-82-45c0,41.9-33.6,76-75,76s-75-34-75-75.9S336.5,196,381,196c16.4,0,31.6,3.5,44,12.6V165.1c0-8.3,7.3-15.1,15.5-15.1s15.5,6.8,15.5,15.1Zm-75,45a44,44,0,1,0-44-44A44,44,0,0,0,381,315Z" />
                  <path fill="#714b67" d="M224,346a75,75,0,1,1,75-75A75,75,0,0,1,224,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,224,315Z" />
                </svg></a>
              <b>INTEGRATED IN ODOO&rsquo;S ERP SYSTEM</b>
              {/* 30 september 2026 (Marinus): "hier nog iets van watch the aftermovie". */}
              <a className="h-aftermovie" href="/video/odoo-experience/odoo-experience.mp4" target="_blank" rel="noopener">&#9654; Watch the aftermovie</a>
            </p>
            <p className="h-integratie-rij is-klein">
              <span className="h-attesso">PAYMENT PARTNER <a href="https://attesso.com" target="_blank" rel="noopener"><code>~/attesso</code></a></span>
              {/* 5 oktober 2026 (Marinus): "Hier moet ook nog het bedrijf van Steven bij." Fincer heeft geen eigen website, dus de
                  naam linkt naar Steven op LinkedIn. Als tekst, net als ~/attesso: het Fincer-logo klopt volgens Marinus nog niet. */}
              <i aria-hidden="true" />
              <span className="h-fincer">WEALTH PARTNER <a href="https://www.linkedin.com/in/steven-goudsblom-bb3ab0197/" target="_blank" rel="noopener" aria-label="Fincer, Steven Goudsblom on LinkedIn"><code>Fincer</code></a></span>
            </p>
            {/* 5 oktober 2026 (Marinus): "Next step en dan alle ERP's en Next talks wil ik graag en dan die logobalk." NEXT STEP
                toont de vijf ERP- en CRM-systemen uit Currently building (niet alleen Salesforce), als kleine witte chips met
                een link; daaronder heet de witte logobalk NEXT TALKS. */}
            <p className="h-integratie-rij is-klein h-next-step">
              <span className="h-next-label">NEXT STEP</span>
              <span className="h-next-erps">
                {INTEGRATIES.map((systeem) => (
                  <a key={systeem.naam} href={systeem.url} target="_blank" rel="noopener"><img src={systeem.zwart ?? systeem.src} alt={systeem.naam} style={{ height: Math.round(systeem.hoog * 0.85) }} /></a>
                ))}
              </span>
            </p>
            {/* 1 oktober 2026 (Marinus): "Vanuit de video staan de logo's waar mijn partners van Attesso mee in gesprek gaan.
                Die mogen ook op de site.", "laat deze balk Primefone, DIVEINE, KWH weg" en "Dan kunnen er meer logo's onder
                Attesso met talking to." Dezelfde rij als in OUR STORY (partnership), direct onder de betaalpartner. */}
            {/* 5 oktober 2026 (Marinus): "Graag ook bewegend en balk wit aangezien het een positieve menselijke balk is met dus
                groene line erboven en eronder." Witte balk met een groene lijn boven en onder; de logo's lopen door. De rij staat
                er twee keer in en de lus schuift precies één rij op, dus de naad is niet te zien. De kopie is voor schermlezers
                en toetsenbord verborgen. */}
            <div className="h-talking">
              <span className="h-talking-label">NEXT TALKS</span>
              <div className="h-talking-strook">
                <div className="h-talking-lus">
                  {[false, true].map(kopie => (
                    <ul key={String(kopie)} className="h-attesso-logos" aria-hidden={kopie || undefined}>
                      {TALKING_TO.map(([naam, url, logo, breed, hoog]) => (
                        <li key={naam}><a href={url} target="_blank" rel="noopener" tabIndex={kopie ? -1 : undefined}><img src={logo} alt={kopie ? "" : naam} width={breed} height={hoog} /></a></li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
          <HeroFilm geluid={heroGeluid} setGeluid={setHeroGeluid} />
          {/* 1 oktober 2026 (Marinus): "Die tekst moet mooi met die afbeeldingen uitgelijnd zijn." Statement en gezichtenmuur
              staan in één rij over beide kolommen; de eerste regel begint op de bovenkant van de portretten en de laatste
              eindigt op de onderkant. */}
          <div className="h-team-rij">
            {/* 30 september 2026 (Marinus): header optie C. Het statement als één zin onder de kop, klein de SaaS-regel, en
                twee knoppen: inloggen en een gratis live demo met de founder. Overal Engels (translate="no"). */}
            {/* 4 oktober 2026 (Marinus): "links moet er even wat meer tekst", "En tie tekst die ik zet echt ook weer in een eigen
                sectie'tje". Statement en het verhaal van Marinus staan samen links; het verhaal in een eigen vak. */}
            <div className="h-team-links">
            <div className="h-statement is-r1" translate="no">
              {/* 30 september 2026 (Marinus): "Dit is helemaal niet in deze stijl, LOS DAT OP", met versie R1 als voorbeeld:
                  alle regels even groot, per regel eerst dun en dan dik, het groene deel dik, de punt wit. */}
              <p className="h-sr"><span className="d">Proven, branded,</span> <b>fully automated!</b></p>
              <p className="h-sr"><span className="d">Everyone can automate a business.</span> <b className="g">No one can automate people who care</b><b>.</b></p>
              <p className="h-sr"><span className="d">Software is a tool.</span> <b>We are SocialNow!</b></p>
            </div>
            <div className="h-team-verhaal" translate="no">
              <p className="h-team-verhaal-kop">Why I started</p>
              <p>I grew up in a <strong>family of makers</strong>. My father is an artist who worked <strong>from early morning until late at night</strong>. My mother is a teacher and therapist.</p>
              <p>What they taught me: <strong>you can become anything you want, as long as you work hard for it.</strong></p>
              <p><strong>For over 5 years</strong>, we have connected the <strong>biggest brands</strong> with the right <strong>creatives and consultants</strong>. AI makes this <strong>scalable, worldwide</strong>.</p>
              <p>Our goal: changing Big Tech and Big Corp, and creating a <strong>free, fair and social economy</strong>.</p>
              <div className="h-team-verhaal-naam"><img {...klein("marinus-profiel-blauw.webp", 40)} alt="" width="40" height="40" loading="lazy" /><span><strong>Marinus Bergsma</strong><i>Founder &amp; CEO</i></span></div>
            </div>
            </div>
            <TeamJoin />
          </div>
          {/* 5 oktober 2026 (Marinus): de witte Talking to-balk (René van der Zel, XXL Nutrition, logoslider) "mag weg". */}
          <HeroSprekers />
          <HeroVeilig geluid={heroGeluid} setGeluid={setHeroGeluid} />
          {/* 30 september 2026 (Marinus): "Deze video mag weg want daaronder doe ik al mijn verhaal." My story staat niet meer
              in de header; het verhaal volgt in Verhaal onder de hero. */}
        </div>
      </section>
      </LanguageContext.Provider>
      <OnderDeVouw>
      {/* 28 september 2026 (Marinus): "de homepage moet een upgrade gaan krijgen met storytelling". De volgorde vertelt
          het verhaal: wie we zijn, wat je kunt doen, het bewijs, het vertrouwen, en dan pas het product in detail. */}
      {/* 29 september 2026 (Marinus): "zet vooral wat ze hebben bereikt met mooie animaties aanwezig op mijn homepage".
          Eerst wat er bereikt is, dan hoe jij in een uur je bedrijf neerzet, dan het verhaal. */}
      <Bereikt />
      <NulNaarBedrijf />
      <Verhaal />
      <WereldKaart />
      <Deuren />
      {/* 28 september 2026 (Marinus): "alle onderdelen als kleine bentogrids, net zoals de homepage wanneer je daarop landt". */}
      <Bento id="het-os" label="Vier onderdelen / Eén verbonden bedrijf" titel={<>Vier gezichten.<br /><span>Eén geheel.</span></>} swipe>
        {agents.map((agent) => (
          <Tegel key={agent.id} kop={agent.title} breed={3} className="h-os-agent">
            <MiloPortrait role={agent.id} name={agent.name} maat={256} />
            <strong className="h-os-belofte" style={{ color: agent.color }}>{agent.promise}</strong>
            <p className="sn-tegel-tekst">{agent.text}</p>
            {/* 5 oktober 2026 (Marinus): "Hier mis ik de menselijke factor terwijl juist die combi zo sterk is." Bij elk
                onderdeel de mensen uit het team die het doen, met hun naam. */}
            <div className="h-os-mensen" translate="no">
              <span className="h-os-mensen-fotos" aria-hidden="true">
                {(OS_MENSEN[agent.id] ?? []).map((naam) => {
                  const persoon = people.find((p) => p.name === naam);
                  return persoon ? <img key={naam} {...klein(persoon.image, 32)} alt="" width="32" height="32" loading="lazy" /> : null;
                })}
              </span>
              <span className="h-os-mensen-namen">Met {(OS_MENSEN[agent.id] ?? []).map((naam) => naam.split(" ")[0]).join(", ")}</span>
            </div>
            <div className="sn-tegel-onder"><TextLink to={`/het-os#${agent.id}`}>Ontdek dit onderdeel</TextLink></div>
          </Tegel>
        ))}
      </Bento>
      {/* 28 september 2026 (Marinus): AI wordt verkeerd begrepen; mensen zijn de verbindende laag. Met vacature. */}
      <MensEnAI />
      <VacaturesBento />
      {/* Veiligheidsblok met video en sleutelbelofte-PDF (proposal/Veiligheid.tsx, van de veiligheidschat). */}
      <VeiligheidBlok />
      <Bento id="diensten" label="Ook dit is SocialNow" titel={<>Van merk tot techniek.<br /><span>Alles sluit op elkaar aan.</span></>} swipe>
        {services.map((service) => (
          <Tegel key={service.id} kop={service.title} breed={4} className="h-dienst-tegel">
            <span className="h-dienst-streep" style={{ background: service.color }} aria-hidden="true" />
            <p className="sn-tegel-tekst">{service.intro}</p>
            <ul className="h-dienst-items">
              {service.items.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className="sn-tegel-onder"><TextLink to={`/diensten#${service.id}`}>Bekijk deze dienst</TextLink></div>
          </Tegel>
        ))}
      </Bento>
      <TrustStories />
      <Bento id="vragen" label="Goed om te weten" titel={<>Eerst helderheid.<br /><span>Dan aan de slag.</span></>}>
        {/* 30 september 2026 (Marinus): "Ik vind dit niet passen in de stijl", "desnoods dat het een AI-chat is". Het vragenblok
            is een gesprek met Milo (MiloVragen); ernaast Steef als mens voor wie liever mailt of appt. */}
        <Tegel kop="Vraag het Milo" breed={8} className="h-faq-tegel h-mv-tegel">
          <MiloVragen />
        </Tegel>
        <Tegel kop="Liever een mens?" breed={4} soort="groen" className="h-faq-contact">
          <figure className="h-mv-steef">
            <img src="/images/Steef-Komen.webp" alt="Steef Komen" width="480" height="360" loading="lazy" decoding="async" />
            <figcaption><b>Steef Komen</b><span>Partner, SocialNow</span></figcaption>
          </figure>
          <p className="sn-tegel-titel">Stuur ons gewoon een bericht.</p>
          <p className="sn-tegel-tekst">Je krijgt antwoord van een mens uit ons team.</p>
          <div className="sn-tegel-onder">
            {heeftWhatsApp && (
              <a className="os-claim sn-btn3d h-button" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <span className="sn-btn3d-sheen" />
                <MessageCircle size={17} aria-hidden="true" />
                <span>Stuur een WhatsApp</span>
              </a>
            )}
            <a className="os-claim sn-btn3d h-button" href={mailLink()}>
              <span className="sn-btn3d-sheen" />
              <Mail size={17} aria-hidden="true" />
              <span translate="no">{CONTACT_MAIL}</span>
            </a>
          </div>
        </Tegel>
      </Bento>
      </OnderDeVouw>
    </>
  );
}
