import React, { useState } from "react";
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
import CharacterAccent from "./CharacterAccent";
import ProjectCase from "./ProjectCase";
import ShowcaseFilms from "./ShowcaseFilms";
import { LanguageContext, translate, useLanguage } from "./i18n/context";
import TeamTrust from "./TeamTrust";
import Verhaal from "./Verhaal";
import { Bento, BentoFilm, Tegel } from "./Bento";
import Deuren from "./Deuren";
import MensEnAI from "./MensEnAI";
import VacaturesBento from "./VacaturesBento";
import VeiligheidBlok from "./Veiligheid";
import { AuditTeaser } from "./AuditPage";
import FeaturedWork from "./FeaturedWork";
import LiveWebsites from "./LiveWebsites";
import TrustStories from "./TrustStories";
import { VideoSlider, ImageSliders } from "./MediaSliders";
import BrandGlobe from "./BrandGlobe";
import OsEntry, { CLAIM_URL, InstallKnop, REVIEWS_URL } from "./os-entry";
import { agents, people, projects, services } from "./content";
// Al het contact loopt eerst via Steef (Marinus, 28 september 2026).
const contactPersoon = people.find((p) => p.name === "Steef Komen") ?? people[0];
import Pricing from "./Pricing";
import { allPosts } from "../data/posts";
import socialPosts from "../public/data/socialposts.json";
import { GRATIS_OS_URL } from "./os-entry";
import PartnerMichelle from "./PartnerMichelle";
import {
  Action,
  AgentCards,
  ClientLogos,
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

function Founder() {
  return (
    <figure className="h-founder">
      <div className="h-founder-image">
        <img
          src="/images/marinus-profiel-blauw.webp"
          alt="Marinus Bergsma, oprichter van SocialNow"
          width="640"
          height="680"
          loading="lazy"
        />
        <figcaption>
          Marinus Bergsma<span>Founder & CEO</span>
        </figcaption>
      </div>
      {/* 28 september 2026 (Marinus, VERHAAL.md): van grafisch vormgever tot oprichter, en waarom hij doet wat hij doet. */}
      <div>
        <p className="h-eyebrow">De oprichter</p>
        <h2>
          Van grafisch vormgever
          <br />
          <span>tot oprichter.</span>
        </h2>
        <p className="h-founder-bio">
          Marinus Bergsma studeerde in 2019 af als grafisch vormgever. Hij werkte voor mooie merken als Amsterdam Light Festival, Day & Nite, AZ en Supperclub. Na succes met freelance opdrachten begon hij in november 2021 SocialNow en bouwde hij een team van specialisten.
        </p>
        <p className="h-founder-bio">
          Toen het eerste AI-model beelden kon maken, gooide hij zijn ondernemingsplan om en verdiepte hij zich in AI en development. Branding en advertenties gingen draaien op zelflerende systemen. Daarna volgde één OS waarin je alle data van je bedrijf koppelt, met Odoo als laatste sleutel. Met Steef Komen maakte hij het schaalbaar.
        </p>
        <blockquote>
          "Ik wil ondernemers helemaal ontzorgen met de nieuwste technologie, zonder dat het persoonlijke verdwijnt."
        </blockquote>
        <p className="h-founder-motto" translate="no">
          Human creativity. <span>Powered by AI technology.</span>
        </p>
        <ul className="h-founder-feiten">
          <li><b>2019</b>Afgestudeerd</li>
          <li><b>Nov 2021</b>SocialNow</li>
          <li><b>Nov 2026</b>Vijf jaar</li>
        </ul>
      </div>
    </figure>
  );
}
// 26 september 2026 (Marinus): "een thank you video" en "ik mis de explainer video van het os". Rechts de
// OS-explainer, met de staande bedankfilm uit Brussel ervoor. Beide spelen stil in een lus met een eigen
// geluidsknop; zet je het geluid van de ene aan, dan gaat de andere op stil.
function Film({ src, poster, label, titel, klasse, geluid, zetGeluid, boven }: { src: string; poster: string; label: string; titel: string; klasse: string; geluid: boolean; zetGeluid: (aan: boolean) => void; boven?: React.ReactNode }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => { if (ref.current) ref.current.muted = !geluid; }, [geluid]);
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
      <video ref={ref} src={src} poster={poster} autoPlay muted loop playsInline preload="auto" aria-label={label} />
      <button type="button" className="h-hero-film-geluid" onClick={wissel} aria-pressed={geluid}>
        {geluid ? "Geluid uit" : "Geluid aan"}
      </button>
      </div>
    </div>
  );
}

function HeroFilm() {
  const [geluid, setGeluid] = useState<"" | "os" | "bedankt">("");
  return (
    <div className="h-hero-film h-hero-films">
      <Film
        klasse="h-film-os"
        src="/video/os/os-booth-en.mp4"
        poster="/video/os/os-booth-en.jpg"
        label="SocialNow OS explainer"
        titel="Zo werkt SocialNow OS"
        boven={
          // 26 september 2026 (Marinus): "Milo's klein boven How SocialNow OS works".
          <div className="h-film-milos" aria-hidden="true">
            {agents.slice(0, 4).map((agent) => <MiloMotion key={agent.id} role={agent.id} name={agent.name} />)}
          </div>
        }
        geluid={geluid === "os"}
        zetGeluid={(aan) => setGeluid(aan ? "os" : "")}
      />
      <Film
        klasse="h-film-bedankt"
        src="/video/bedankt/bedankt-brussel.mp4"
        poster="/video/bedankt/bedankt-brussel.jpg"
        label="Bedankt vanuit Brussel, van het SocialNow-team"
        titel="Bedankt uit Brussel"
        geluid={geluid === "bedankt"}
        zetGeluid={(aan) => setGeluid(aan ? "bedankt" : "")}
      />
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

export function Home() {
  const { language, t } = useLanguage();
  // 26 september 2026 (Marinus): "ik wil niet dat de taal meer wijzigt". De hero toont de paginataal.
  const getoond = language;
  const taalfase = useTaalfase(getoond);
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
          <TeamTrust />
          <HeroTitle />
          {/* 26 september 2026 (Marinus): "onder de titel het Odoo-logo". */}
          <p className="h-hero-odoo" translate="no">
            <svg viewBox="140 146 640 250" role="img" aria-label="Odoo">
              <path fill="#8f8f8f" d="M695,346a75,75,0,1,1,75-75A75,75,0,0,1,695,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,695,315ZM538,346a75,75,0,1,1,75-75A75,75,0,0,1,538,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,538,315Zm-82-45c0,41.9-33.6,76-75,76s-75-34-75-75.9S336.5,196,381,196c16.4,0,31.6,3.5,44,12.6V165.1c0-8.3,7.3-15.1,15.5-15.1s15.5,6.8,15.5,15.1Zm-75,45a44,44,0,1,0-44-44A44,44,0,0,0,381,315Z" />
              <path fill="#714b67" d="M224,346a75,75,0,1,1,75-75A75,75,0,0,1,224,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,224,315Z" />
            </svg>
          </p>
          {/* 28 september 2026 (Marinus): "ODOO PRODUCT · IMPLEMENTATION POSSIBLE", daaronder klein de volgende stap. */}
          <p className="h-hero-odoo-regel" translate="no">
            <b>ODOO PRODUCT · IMPLEMENTATION POSSIBLE</b>
            <small>NEXT STEP SALESFORCE</small>
          </p>
          {/* 26 september 2026 (Marinus): versie A, "de brief". Het bedankje als briefje met foto en naam. */}
          <div className="h-brief">
            <p className="h-hero-description">
              Door de vele aanmeldingen voor onze actie reageren we volgende week persoonlijk op iedereen. De winnaar
              maken we bekend op LinkedIn en Instagram.
            </p>
            <div className="h-brief-onder">
              <img src="/images/marinus-profiel-blauw.webp" alt="" width="56" height="56" />
              <p><strong>Marinus Bergsma</strong><span>en het SocialNow-team</span></p>
            </div>
          </div>
          <div className="os-entry">
            <div className="os-actions">
              {/* 26 september 2026 (Marinus): "groene vulling zoals eerst Try the OS, meer rond en niet zo lang". */}
              <a className="os-claim sn-btn3d h-button h-login-rond" href="https://app.socialnow.nl/login/">
                <span className="sn-btn3d-sheen" />
                <span>{translate("Log in op je gratis OS", getoond)}</span>
                <span className="h-button-icon"><ArrowUpRight size={16} aria-hidden="true" /></span>
              </a>
              <InstallKnop />
            </div>
          </div>
          </div>
          <HeroFilm />
          <div className="h-hero-rij">
            <ClientLogos kort />
          </div>
        </div>
      </section>
      </LanguageContext.Provider>
      {/* 28 september 2026 (Marinus): "de homepage moet een upgrade gaan krijgen met storytelling". De volgorde vertelt
          het verhaal: wie we zijn, wat je kunt doen, het bewijs, het vertrouwen, en dan pas het product in detail. */}
      <Verhaal />
      <Deuren />
      <FeaturedWork />
      {/* 28 september 2026 (Marinus): "What our clients say" mag weg van de homepage. */}
      <LiveWebsites />
      {/* 28 september 2026 (Marinus): AI wordt verkeerd begrepen; mensen zijn de verbindende laag. Met vacature. */}
      <MensEnAI />
      <VacaturesBento />
      {/* Veiligheidsblok met video en sleutelbelofte-PDF (proposal/Veiligheid.tsx, van de veiligheidschat). */}
      <VeiligheidBlok />
      {/* 28 september 2026 (Marinus): "alle onderdelen als kleine bentogrids, net zoals de homepage wanneer je daarop landt". */}
      <Bento id="het-os" label="Vier onderdelen / Eén verbonden bedrijf" titel={<>Vier gezichten.<br /><span>Eén geheel.</span></>} swipe>
        {agents.map((agent) => (
          <Tegel key={agent.id} kop={agent.title} breed={3} className="h-os-agent">
            <MiloPortrait role={agent.id} name={agent.name} />
            <strong className="h-os-belofte" style={{ color: agent.color }}>{agent.promise}</strong>
            <p className="sn-tegel-tekst">{agent.text}</p>
            <div className="sn-tegel-onder"><TextLink to={`/het-os#${agent.id}`}>Ontdek dit onderdeel</TextLink></div>
          </Tegel>
        ))}
        <Tegel kop="Bekijk de gedachte achter het OS" breed={6} soort="film">
          <BentoFilm src="/video/os/os-odoo.mp4" poster="/video/os/os-odoo.webp" label="Bekijk de gedachte achter het OS" />
          <span className="sn-tegel-badge">Voorbeeldgegevens</span>
        </Tegel>
        <Tegel kop="Van klantwerk naar een verbonden bedrijf" breed={6} soort="film">
          <BentoFilm src="/video/os/os-kwh-case.mp4" poster="/video/os/os-kwh-case.webp" label="Van klantwerk naar een verbonden bedrijf" />
          <span className="sn-tegel-badge">Voorbeeldgegevens</span>
        </Tegel>
      </Bento>
      {/* 28 september 2026 (Marinus): "dit onderdeel is niet meer zo belangrijk nu". See it in motion staat lager. */}
      <ShowcaseFilms />
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
      <VideoSlider />
      <TrustStories />
      <ImageSliders />
      <Bento id="social" label="Gemaakt door ons team" titel={<>Human creativity.<br /><span>Powered by AI technology.</span></>} swipe>
        {socialPosts.posts.map((post) => (
          <Tegel key={post.beeld} kop={post.titel} breed={3} soort="foto" className="h-social-tegel">
            <img src={`/images/social/${post.beeld}`} alt={post.titel} width={post.breed} height={post.hoog} loading="lazy" />
          </Tegel>
        ))}
        <Tegel kop="Instagram" breed={3} soort="groen" className="h-social-volg">
          <p className="sn-tegel-tekst">Campagnes, social content en merkwerk uit onze eigen collectie.</p>
          <div className="sn-tegel-onder">
            <a className="sn-btn3d h-button h-button-secondary" href={socialPosts.profiel} target="_blank" rel="noopener noreferrer">
              <span className="sn-btn3d-sheen" />
              <span>Volg ons op Instagram</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </Tegel>
      </Bento>
      <Bento id="vragen" label="Goed om te weten" titel={<>Eerst helderheid.<br /><span>Dan aan de slag.</span></>}>
        <Tegel kop="Veelgestelde vragen" breed={8} className="h-faq-tegel">
          <Questions />
        </Tegel>
        <Tegel kop="Nog een vraag?" breed={4} soort="groen" className="h-faq-contact">
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

    </>
  );
}
export function OsPage() {
  // 28 september 2026 (Marinus, het verhaal): alle data in één OS, Odoo als laatste sleutel, gratis te gebruiken.
  return (
    <>
      <PageHeading
        label="SocialNow OS / Gratis te gebruiken"
        title={
          <>
            Alle data van je bedrijf.
            <br />
            <span>Eén OS.</span>
          </>
        }
        text="Koppel je website, social media en Odoo, en zie klanten, verkoop en marketing op één plek. Odoo is de laatste sleutel: totale ontzorging en volledig inzicht. Probeer het OS gratis; wil je het helemaal rond je bedrijf, dan bouwen we je OS op maat."
      />
      <div className="h-wrap">
        <OsEntry />
      </div>
      <section className="h-section h-wrap">
        <AgentCards />
        <ConversionBridge />
      </section>
      <section className="h-section h-wrap">
        <Heading
          label="Zo begin je"
          title={
            <>
              Van losse systemen
              <br />
              <span>naar samenhang.</span>
            </>
          }
        />
        <ol className="h-steps">
          <li>
            <span>01</span>
            <h3>Log in op je gratis OS.</h3>
            <p>
              Met je Google-account of je e-mailadres. Gratis, zonder creditcard.
            </p>
            <a className="h-text-link" href={GRATIS_OS_URL}>
              Probeer het OS gratis
              <ArrowUpRight size={16} />
            </a>
          </li>
          <li>
            <span>02</span>
            <h3>Koppel je data.</h3>
            <p>
              Je website, je social media en je Odoo. Met de juiste rechten zie
              je klanten, verkoop en marketing op één plek.
            </p>
          </li>
          <li>
            <span>03</span>
            <h3>Maak het van jou.</h3>
            <p>
              Wil je het OS rond je eigen processen? We bouwen je OS op maat,
              vanaf €10.000, met duidelijke afspraken over uitvoering en kosten.
            </p>
            <TextLink to="/contact?onderwerp=OS%20op%20maat">
              Bespreek je OS op maat
            </TextLink>
          </li>
        </ol>
      </section>
      <section className="h-wrap h-os-details">
        {agents.map((agent) => (
          <article
            key={agent.id}
            id={agent.id}
            style={{ "--accent": agent.color } as React.CSSProperties}
          >
            <div>
              <p className="h-eyebrow">
                {agent.name} / {agent.label}
              </p>
              <h2>{agent.title}</h2>
              <p>{agent.text}</p>
              {agent.id === "crm" ? (
                <ul>
                  <li>CRM-leads en fasen</li>
                  <li>Open pijplijn</li>
                  <li>Offertes en verkooporders</li>
                </ul>
              ) : agent.id === "content" ? (
                <ul>
                  <li>Recente berichten en media</li>
                  <li>Bereik en interacties</li>
                  <li>Beschikbaarheid afhankelijk van accounts en rechten</li>
                </ul>
              ) : agent.id === "ads" ? (
                <ul>
                  <li>Advertentie-uitgaven</li>
                  <li>Klikken en leads</li>
                  <li>Campagnebeheer vraagt aparte inrichting</li>
                </ul>
              ) : (
                <ul>
                  <li>Website en ontwikkeling in je eigen merkstijl</li>
                  <li>Koppelingen volgens de afgesproken scope</li>
                  <li>Persoonlijk contact met ons team, vanuit je OS</li>
                </ul>
              )}
              <TextLink
                to={`/contact?onderwerp=${encodeURIComponent(agent.name)}`}
              >
                Bespreek de mogelijkheden
              </TextLink>
            </div>
            <div className="h-os-video">
              <img
                src={miloPoster(agent.id)}
                alt={agent.name}
                width="168"
                height="168"
                loading="lazy"
              />
              <VideoBlock
                file={agent.video}
                title={`${agent.title} in beeld`}
                note="Conceptvideo over de richting van dit onderdeel. Welke automatisering je gebruikt, spreken we samen af."
              />
            </div>
          </article>
        ))}
      </section>
      <section className="h-section h-wrap h-faq-layout">
        <Heading label="Jouw vragen" title="Wat wil je weten?" />
        <Questions />
      </section>
    </>
  );
}
export function ProjectsPage() {
  const [filter, setFilter] = useState("alles");
  const filtered = projects.filter(
    (project) =>
      filter === "alles" ||
      (filter === "websites" ? project.url : !project.url),
  );
  return (
    <>
      <PageHeading
        label="Ons werk"
        title={
          <>
            Ideeën die
            <br />
            <span>vorm hebben gekregen.</span>
          </>
        }
        text="Van campagnes voor merken als AZ, Universal en Sony tot AI-websites en dataplatforms als VASTIQ. Ontdek het werk achter SocialNow."
      />
      <section className="h-wrap h-projects-list">
        <div className="h-filters" role="group" aria-label="Filter projecten">
          {[
            ["alles", "Alles"],
            ["websites", "Websites & platforms"],
            ["merken", "Merken & content"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="h-result-count" aria-live="polite">
          {filtered.length} projecten
        </p>
        <div className="h-project-grid">
          {filtered.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      </section>
    </>
  );
}
export function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <NotFound />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <ProjectCase key={project.slug} project={project} next={next} />;
}

export function ServicesPage() {
  return (
    <>
      <PageHeading
        label="Diensten"
        title={
          <>
            Goed bedacht.
            <br />
            <span>Volledig gemaakt.</span>
          </>
        }
        text="Hier begon SocialNow: ontwerp, beeld en campagnes. Vandaag werken we ook met AI en development, en het blijft persoonlijk. Voor één gerichte opdracht of als team naast je bedrijf."
      />
      <section className="h-wrap h-services">
        {services.map((service, index) => (
          <article
            id={service.id}
            key={service.id}
            style={{ "--accent": service.color } as React.CSSProperties}
          >
            <div>
              <p className="h-eyebrow">0{index + 1} / Expertise</p>
              <h2>{service.title}</h2>
              <p>{service.intro}</p>
            </div>
            <ul>
              {service.items.map((item) => (
                <li key={item}>
                  <Check size={15} />
                  {item}
                </li>
              ))}
            </ul>
            <TextLink
              to={`/contact?onderwerp=${encodeURIComponent(service.title)}`}
            >
              Bespreek je project
            </TextLink>
          </article>
        ))}
      </section>
      <section className="h-section h-wrap h-service-cta">
        <Heading
          label="Samen aan de slag"
          title={
            <>
              Een losse opdracht.
              <br />
              <span>Of verder bouwen.</span>
            </>
          }
          text="Probeer het OS gratis en bespreek je OS op maat. Voor een losse opdracht maken we een gericht voorstel met een duidelijke scope."
        />
        <Action to="/prijzen">Bekijk de prijzen</Action>
      </section>
    </>
  );
}
export function PricesPage() {
  return (
    <>
      <Pricing />
      <section className="h-section h-wrap">
        <Heading
          label="Wat bepaalt je investering?"
          title={
            <>
              De inrichting volgt
              <br />
              <span>jouw dagelijkse praktijk.</span>
            </>
          }
        />
        <ol className="h-steps">
          <li>
            <span>01 / Bedrijf</span>
            <h3>Hoe werk je?</h3>
            <p>
              Je team, processen en prioriteiten bepalen waar je OS op maat het
              verschil moet maken.
            </p>
          </li>
          <li>
            <span>02 / Inrichting</span>
            <h3>Wat verbinden we?</h3>
            <p>
              We spreken af welke systemen, gegevens, schermen en werkwijzen
              onderdeel worden van jouw OS.
            </p>
          </li>
          <li>
            <span>03 / Samenwerking</span>
            <h3>Waar helpen we bij?</h3>
            <p>
              Van uitleg en beheer tot content, campagnes of development. De
              inzet van het team stemmen we af op je behoefte.
            </p>
          </li>
        </ol>
        <ConversionBridge />
      </section>
      <section className="h-section h-wrap h-service-cta">
        <Heading
          label="Ook voor gerichte opdrachten"
          title={
            <>
              Een website. Een campagne.
              <br />
              <span>Een sterker merk.</span>
            </>
          }
          text="Onze creatieve en technische diensten blijven beschikbaar. We maken een voorstel voor je project of nemen ze mee in de samenwerking rond je OS op maat."
        />
        <Action to="/diensten" secondary>
          Bekijk onze diensten
        </Action>
      </section>
      <section className="h-section h-wrap h-faq-layout">
        <Heading label="Voor we beginnen" title="Duidelijke afspraken." />
        <Questions />
      </section>
    </>
  );
}
export function TeamPage() {
  const partners = ["Michelle Yang", "Steef Komen"]
    .map(name => people.find(person => person.name === name))
    .filter((person): person is NonNullable<typeof person> => Boolean(person));
  const specialists = people.filter(person =>
    person.name !== "Marinus Bergsma" &&
    person.name !== "Michelle Yang" &&
    person.name !== "Steef Komen"
  );

  return (
    <>
      <PageHeading
        label="Het team"
        title={
          <>
            Creatieve mensen.
            <br />
            <span>Betrokken specialisten.</span>
          </>
        }
        text="SocialNow begon in november 2021. Sindsdien groeiden we uit tot een team van specialisten in creatie, marketing, data en techniek. Samen bouwen we één OS dat je bedrijf ontzorgt, en het persoonlijke contact blijft."
      />
      <section className="h-wrap">
        <Founder />
      </section>
      {/* 28 september 2026 (Marinus): een groot en duidelijk bedankje aan alle bedrijven waarmee we samen
          de developers- en datakant van het OS hebben doorgevoerd. */}
      <section className="h-section h-wrap h-bedankt" aria-labelledby="h-bedankt-titel">
        <p className="h-eyebrow">Dank je wel</p>
        <h2 id="h-bedankt-titel">
          Gebouwd met sterke partners.
          <br />
          <span>Bedankt.</span>
        </h2>
        <p className="h-bedankt-tekst">
          Het OS bouwen we niet alleen. Samen met bedrijven met ervaren developers en dataspecialisten hebben we de techniek, de koppelingen en de data goed doorgevoerd. En Odoo-implementatiepartners brengen het OS nu naar hun klanten. Aan al die bedrijven en mensen: dank je wel.
        </p>
        <div className="h-bedankt-rij">
          <div className="h-bedankt-kaart">
            <b translate="no">Komen Consultancy</b>
            <span>Accountancy, Odoo en data, met Steef Komen en Michelle Yang. Samen maken we het OS schaalbaar.</span>
          </div>
          <div className="h-bedankt-kaart">
            <b>Onze developers</b>
            <span>Die de koppelingen met Odoo, Meta, Google en de website bouwden en testten</span>
          </div>
          <div className="h-bedankt-kaart">
            <b>Onze dataspecialisten</b>
            <span>Die zorgden dat je eigen data veilig en kloppend in het OS terechtkomt</span>
          </div>
        </div>
      </section>
      <section className="h-section h-wrap h-team-partners">
        <Heading
          label="SocialNow × Komen Consultancy"
          title={
            <>
              Michelle en Steef.
              <br />
              <span>Samen maken we het schaalbaar.</span>
            </>
          }
        />
        <TeamGrid members={partners} />
        <p className="h-footnote">
          Steef Komen is accountant, Odoo-expert en datascientist. Met hem maakten we het OS schaalbaar, en samen bouwen we VASTIQ, een dataplatform voor vastgoed. Michelle Yang werkt vanuit Komen Consultancy mee aan supply chain, operations en betalingen met AI.
        </p>
      </section>
      <section className="h-section h-wrap">
        <Heading
          label="Onze system experts"
          title={
            <>
              Ieder een eigen vak.
              <br />
              <span>Persoonlijk voor je klaar.</span>
            </>
          }
        />
        {/* 28 september 2026 (Marinus): het team zijn system experts die je persoonlijk helpen vanuit je Custom OS. */}
        <p className="h-system-experts">
          Iedereen in ons team is ook <b>system expert</b>. Ze kennen het OS van binnen en buiten en staan klaar om je persoonlijk te helpen, direct vanuit je OS.
        </p>
        <TeamGrid members={specialists} />
        <AuditTeaser />
      </section>
    </>
  );
}
export function BlogPage() {
  const {language}=useLanguage();
  return (
    <>
      <PageHeading
        label="Het SocialNow-blog"
        title={
          <>
            Vanuit de praktijk.
            <br />
            <span>Om verder te denken.</span>
          </>
        }
        text="Inzichten over websites, AI, content en vindbaarheid. Geschreven vanuit het werk dat we doen."
      />
      <section className="h-wrap h-blog-grid">
        {allPosts.map((post) => (
          <article key={post.slug}>
            <Link to={`/blog/${post.slug}`}>
              <img
                src={`/${post.coverImage}`}
                alt={post.title}
                width="900"
                height="600"
                loading="lazy"
              />
              <p className="h-eyebrow">
                {new Date(post.date).toLocaleDateString(language === "nl" ? "nl-NL" : "en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}{" "}
                · {post.readTime}
              </p>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span className="h-text-link">
                Lees het artikel
                <ArrowUpRight size={17} />
              </span>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
function ArticleBody({ body }: { body: string }) {
  return (
    <>
      {body
        .split(/\n\n+/)
        .filter(Boolean)
        .map((block, index) => {
          const lines = block.trim().split("\n");
          if (/^#{1,3} /.test(lines[0]))
            return <h2 key={index}>{lines[0].replace(/^#{1,3} /, "")}</h2>;
          if (lines.every((line) => line.startsWith("- ")))
            return (
              <ul key={index}>
                {lines.map((line, item) => (
                  <li key={item}>{line.slice(2)}</li>
                ))}
              </ul>
            );
          if (lines[0].startsWith("> "))
            return (
              <blockquote key={index}>
                {lines.map((line) => line.replace(/^>\s?/, "")).join(" ")}
              </blockquote>
            );
          return <p key={index}>{block}</p>;
        })}
    </>
  );
}
export function BlogPostPage() {
  const {language}=useLanguage();
  const { slug } = useParams();
  const post = allPosts.find((item) => item.slug === slug);
  if (!post) return <NotFound />;
  return (
    <>
      <header className="h-page-heading h-wrap">
        <TextLink to="/blog">Alle artikelen</TextLink>
        <p className="h-eyebrow">
          {new Date(post.date).toLocaleDateString(language === "nl" ? "nl-NL" : "en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          })}{" "}
          · {post.readTime}
        </p>
        <h1>{post.title}</h1>
        <p className="h-intro">{post.excerpt}</p>
      </header>
      <article className="h-article h-wrap">
        <img
          className="h-article-cover"
          src={`/${post.coverImage}`}
          alt={post.title}
          width="1440"
          height="900"
        />
        <div className="h-article-body">
          <ArticleBody body={post.body} />
          {post.faqs && (
            <div className="h-questions">
              {post.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  );
}
export function ContactPage() {
  const {t}=useLanguage();
  const [params] = useSearchParams();
  const [prepared, setPrepared] = useState(false);
  const [draft, setDraft] = useState("");
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `${t("Kennismaken")}: ${data.get("subject") || "SocialNow"}`;
    const body = `${t("Naam")}: ${data.get("name")}\n${t("E-mail")}: ${data.get("email")}\n${t("Bedrijf")}: ${data.get("company")}\n\n${data.get("message")}`;
    const href = `mailto:${CONTACT_MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDraft(href);
    setPrepared(true);
    window.location.href = href;
  };
  return (
    <>
      <PageHeading
        label="Het persoonlijke contact blijft"
        title={
          <>
            Wat kan het OS
            <br />
            <span>voor jou betekenen?</span>
          </>
        }
        text="Vertel ons hoe je bedrijf werkt. Samen bepalen we wat je gratis OS, een OS op maat of ons team voor je kunnen doen."
      />
      <section className="h-wrap h-contact-layout">
        <div>
          <div className="h-contact-person">
            <img
              src={`/images/${contactPersoon.image}`}
              alt={contactPersoon.name}
              width="180"
              height="180"
            />
            <div>
              <h2>Begin bij Steef.</h2>
              <p translate="no">{contactPersoon.role}</p>
            </div>
          </div>
          <div className="h-contact-methods">
            <a href={mailLink()}>
              <Mail size={21} />
              <span>
                <small>E-mail</small>{CONTACT_MAIL}
              </span>
              <ArrowUpRight size={19} />
            </a>
            {heeftWhatsApp && (
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={21} />
                <span>
                  <small>WhatsApp</small>Stuur ons een bericht
                </span>
                <ArrowUpRight size={19} />
              </a>
            )}
            <div>
              <MapPin size={21} />
              <span>
                <small>Amsterdam</small>Amstelstraat 43G
                <br />
                1017 DA Amsterdam
              </span>
            </div>
          </div>
          <p className="h-footnote">
            Een gesprek plannen? Stuur een paar momenten die je uitkomen, dan
            stemmen we samen af.
          </p>
        </div>
        <form
          className="h-contact-form"
          onSubmit={submit}
          onChange={() => setPrepared(false)}
        >
          <h2>Waar kunnen we je mee helpen?</h2>
          <div className="h-form-row">
            <label>
              Je naam
              <input name="name" autoComplete="name" required maxLength={100} />
            </label>
            <label>
              E-mailadres
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={200}
              />
            </label>
          </div>
          <label>
            Bedrijfsnaam
            <input name="company" autoComplete="organization" maxLength={150} />
          </label>
          <label>
            Onderwerp
            <input
              name="subject"
              defaultValue={t(params.get("onderwerp") || "Custom OS")}
              placeholder="Bijvoorbeeld: OS op maat of een nieuwe website"
              maxLength={150}
            />
          </label>
          <label>
            Waar wil je meer overzicht of minder handwerk?
            <textarea name="message" required rows={5} maxLength={3000} />
          </label>
          <p className="h-form-note">
            Met de knop open je een ingevuld concept in je eigen e-mailapp. Je
            verstuurt de e-mail daar zelf.{" "}
            <Link to="/privacy">Privacybeleid</Link>
          </p>
          <button type="submit" className="sn-btn3d h-button">
            <span className="sn-btn3d-sheen" />
            <span>Open e-mailconcept</span>
            <Mail size={17} />
          </button>
          {prepared && (
            <div className="h-form-result" role="status">
              <strong>Je e-mailconcept is voorbereid.</strong>
              <p>
                Controleer en verstuur het in je e-mailapp. Er is vanuit deze
                website nog niets verzonden.
              </p>
              <a href={draft}>Open het concept opnieuw</a>
              <p>
                Geen e-mailapp ingesteld? Mail naar steef@socialnow.nl.
              </p>
            </div>
          )}
        </form>
      </section>
      <PartnerMichelle />
      <section className="h-section h-wrap">
        <VideoBlock
          file="os-master-en"
          title="Maak kennis met SocialNow OS"
          note="Engelstalige conceptvideo over de productrichting. De beschikbare inrichting bespreken we persoonlijk."
        />
      </section>
    </>
  );
}
export function NotFound() {
  return (
    <>
      <PageHeading
        label="Pagina niet gevonden"
        title="Even terug naar het begin."
        text="Deze pagina bestaat niet. Je vindt de rest van SocialNow via het menu."
      />
      <div className="h-wrap h-not-found">
        <Action to="/">Naar de homepage</Action>
      </div>
    </>
  );
}
