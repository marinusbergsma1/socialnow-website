import React, { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { HeroTitle } from "./styles";
import { miloPoster } from "./motion";
import CharacterAccent from "./CharacterAccent";
import ProjectCase from "./ProjectCase";
import ShowcaseFilms from "./ShowcaseFilms";
import { LanguageContext, translate, useLanguage } from "./i18n/context";
import TeamTrust from "./TeamTrust";
import { AuditTeaser } from "./AuditPage";
import CustomerReviews from "./CustomerReviews";
import FeaturedWork from "./FeaturedWork";
import LiveWebsites from "./LiveWebsites";
import TrustStories from "./TrustStories";
import { VideoSlider, ImageSliders } from "./MediaSliders";
import BrandGlobe from "./BrandGlobe";
import OsEntry, { CLAIM_URL, REVIEWS_URL } from "./os-entry";
import { agents, people, projects, services } from "./content";
import Pricing from "./Pricing";
import { allPosts } from "../data/posts";
import socialPosts from "../public/data/socialposts.json";
import {
  Action,
  AgentCards,
  ClientLogos,
  ConversionBridge,
  HeroMilos,
  Heading,
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
          src="/images/Marinus-Bergsma-V2.webp"
          alt="Marinus Bergsma, oprichter van SocialNow"
          width="640"
          height="680"
          loading="lazy"
        />
        <figcaption>
          Marinus Bergsma<span>Founder & Creative Art Director</span>
        </figcaption>
      </div>
      <div>
        <p className="h-eyebrow">De ambitie achter SocialNow</p>
        <h2>
          Software moet
          <br />
          <span>voor mensen werken.</span>
        </h2>
        <p className="h-founder-mission">
          Ons doel: je bedrijf kunnen aansturen zonder eerst software te moeten
          leren. Daarom bouwen we Custom OS-systemen die eenvoudig werken, bij
          jouw bedrijf passen en mensen achter zich hebben.
        </p>
        <TextLink to="/team">De mensen achter het OS</TextLink>
      </div>
    </figure>
  );
}
// 26 september 2026 (Marinus): "een thank you video" en "ik mis de explainer video van het os". Rechts de
// OS-explainer, met de staande bedankfilm uit Brussel ervoor. Beide spelen stil in een lus met een eigen
// geluidsknop; zet je het geluid van de ene aan, dan gaat de andere op stil.
function Film({ src, poster, label, klasse, geluid, zetGeluid }: { src: string; poster: string; label: string; klasse: string; geluid: boolean; zetGeluid: (aan: boolean) => void }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => { if (ref.current) ref.current.muted = !geluid; }, [geluid]);
  const wissel = () => {
    const film = ref.current;
    if (film && !geluid) { film.currentTime = 0; void film.play().catch(() => {}); }
    zetGeluid(!geluid);
  };
  return (
    <div className={klasse}>
      <video ref={ref} src={src} poster={poster} autoPlay muted loop playsInline preload="auto" aria-label={label} />
      <button type="button" className="h-hero-film-geluid" onClick={wissel} aria-pressed={geluid}>
        {geluid ? "Geluid uit" : "Geluid aan"}
      </button>
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
        geluid={geluid === "os"}
        zetGeluid={(aan) => setGeluid(aan ? "os" : "")}
      />
      <Film
        klasse="h-film-bedankt"
        src="/video/bedankt/bedankt-brussel.mp4"
        poster="/video/bedankt/bedankt-brussel.jpg"
        label="Bedankt vanuit Brussel, van het SocialNow-team"
        geluid={geluid === "bedankt"}
        zetGeluid={(aan) => setGeluid(aan ? "bedankt" : "")}
      />
    </div>
  );
}

// 26 september 2026 (Marinus): de logo-animatie van de website en het OS bovenaan de hero. Speelt één keer
// en blijft staan op het complete logo.
function HeroLogo() {
  const ref = React.useRef<HTMLVideoElement>(null);
  const stop = () => {
    const film = ref.current;
    if (film && film.currentTime >= 3.4) film.pause();
  };
  return (
    <video
      ref={ref}
      className="h-hero-logo"
      src="/video/bedankt/logo-animatie.mp4"
      autoPlay
      muted
      playsInline
      preload="auto"
      onTimeUpdate={stop}
      onEnded={stop}
      aria-label="SocialNow OS"
    />
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
          <HeroLogo />
          <HeroTitle />
          {/* 26 september 2026 (Marinus): versie A, "de brief". Het bedankje als briefje met foto en naam. */}
          <div className="h-brief">
            <p className="h-hero-description">
              Door de vele aanmeldingen voor onze actie reageren we volgende week persoonlijk op iedereen. De winnaar
              maken we bekend op LinkedIn en Instagram.
            </p>
            <div className="h-brief-onder">
              <img src="/images/Marinus-Bergsma-V2.webp" alt="" width="56" height="56" />
              <p><strong>Marinus Bergsma</strong><span>en het SocialNow-team</span></p>
            </div>
          </div>
          <div className="os-entry">
            <div className="os-actions">
              <a className="h-login-knop" href="https://app.socialnow.nl/login/">
                {translate("Log in op je gratis OS", getoond)}
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            </div>
            <p className="h-login-uitleg">Nog geen account? Met dezelfde knop start je gratis, in één minuut.</p>
            <p className="h-volg">
              <a href="https://www.linkedin.com/company/socialnow-nl/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/socialnow.nl/" target="_blank" rel="noreferrer">Instagram</a>
            </p>
          </div>
          </div>
          <HeroFilm />
          {/* 26 september 2026 (Marinus): "de 4 Milo's terugzien", als strook onder kop en films. */}
          <HeroMilos />
          <div className="h-hero-rij">
            <TeamTrust />
            <ClientLogos kort />
          </div>
        </div>
      </section>
      </LanguageContext.Provider>
      <ShowcaseFilms />
      <section className="h-section h-wrap" id="het-os">
        <Heading
          label="Vier onderdelen / Eén verbonden bedrijf"
          title={
            <>
              Vier gezichten.
              <br />
              <span>Eén geheel.</span>
            </>
          }
          text="Website, CRM, Studio en Advertenties. Dezelfde vier specialisten als in het dashboard, met één doel: meer samenhang in het werk van je bedrijf."
        >
          <TextLink to="/het-os">Zo werkt het OS</TextLink>
        </Heading>
        <AgentCards />
        <p className="h-footnote">
          Je eerste ervaring is het vertrekpunt. Welke functies en koppelingen
          beschikbaar zijn, stemmen we af op jouw situatie.
        </p>
        <div className="h-video-pair">
          <VideoBlock
            file="os-odoo"
            title="Bekijk de gedachte achter het OS"
            note="Productuitleg met voorbeeldgegevens. Bespreek met ons wat voor jouw inrichting beschikbaar is."
          />
          <VideoBlock
            file="os-kwh-case"
            title="Van klantwerk naar een verbonden bedrijf"
            note="Een bestaande uitlegvideo rond kWh Garant. De getoonde productomgeving bevat ook voorbeeldgegevens."
          />
        </div>
        <ConversionBridge />
      </section>
      <FeaturedWork />
      <LiveWebsites />
      <CustomerReviews />
      <section className="h-section h-wrap h-services-with-character">
        <CharacterAccent kind="coder" />
        <Heading
          label="Ook dit is SocialNow"
          title={
            <>
              Van merk tot techniek.
              <br />
              <span>Alles sluit op elkaar aan.</span>
            </>
          }
          text="Een sterk OS begint bij begrijpen hoe een bedrijf werkt. Onze specialisten brengen ontwerp, content, marketing en development samen."
        >
          <TextLink to="/diensten">Alle diensten</TextLink>
        </Heading>
        <div className="h-service-summary">
          {services.map((service, index) => (
            <Link
              to={`/diensten#${service.id}`}
              key={service.id}
              style={{ "--accent": service.color } as React.CSSProperties}
            >
              <small>0{index + 1}</small>
              <h3>{service.title}</h3>
              <ArrowUpRight size={22} />
            </Link>
          ))}
        </div>
      </section>
      <VideoSlider />
      <TrustStories />
      <section className="h-section h-wrap h-team-with-character">
        <Founder />
      </section>
      <ImageSliders />
      <section className="h-section h-wrap">
        <Heading
          label="Gemaakt door ons team"
          title={
            <>
              Human creativity.
              <br />
              <span>Powered by AI technology.</span>
            </>
          }
          text="Campagnes, social content en merkwerk uit onze eigen collectie."
        >
          <a
            className="h-text-link"
            href={socialPosts.profiel}
            target="_blank"
            rel="noopener noreferrer"
          >
            Volg ons op Instagram
            <ArrowUpRight size={17} />
          </a>
        </Heading>
        <div
          className="h-social-gallery"
          tabIndex={0}
          role="region"
          aria-label="Contentcollectie; horizontaal te scrollen"
        >
          {socialPosts.posts.map((post) => (
            <figure key={post.beeld}>
              <img
                src={`/images/social/${post.beeld}`}
                alt={post.titel}
                width={post.breed}
                height={post.hoog}
                loading="lazy"
              />
              <figcaption>{post.titel}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="h-section h-wrap h-faq-layout">
        <Heading
          label="Goed om te weten"
          title={
            <>
              Eerst helderheid.
              <br />
              <span>Dan aan de slag.</span>
            </>
          }
        />
        <Questions />
      </section>

    </>
  );
}
export function OsPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageHeading
        label="Probeer SocialNow OS / Ontdek hoe het werkt"
        title={
          <>
            Eerst zelf ervaren.
            <br />
            <span>Dan samen verder.</span>
          </>
        }
        text="Probeer het systeem en ervaar het overzicht. Daarna bespreken we hoe we het op jouw bedrijf afstemmen."
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
            <h3>{t("Vraag een OS-demo aan.")}</h3>
            <p>
              {t("Stuur ons je naam en e-mailadres via WhatsApp. We bespreken daarna de demo.")}
            </p>
            <a className="h-text-link" href={CLAIM_URL}>
              {t("Vraag gratis OS-demo aan")}
              <ArrowUpRight size={16} />
            </a>
          </li>
          <li>
            <span>02</span>
            <h3>Verbind je gegevens.</h3>
            <p>
              Met een geschikte Odoo-omgeving en de juiste Meta-rechten begin je
              met inzicht in klanten, verkoop en marketing.
            </p>
          </li>
          <li>
            <span>03</span>
            <h3>Maak het van jou.</h3>
            <p>
              We bepalen samen welke schermen, processen en koppelingen je nodig
              hebt. Met duidelijke afspraken over uitvoering en kosten.
            </p>
            <TextLink to="/contact?onderwerp=Custom%20OS">
              Bespreek jouw inrichting
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
                  <li>
                    In de testomgeving: contactmodule voor persoonlijke
                    inrichting
                  </li>
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
                title={`De productrichting voor ${agent.title.toLowerCase().replace(".", "")}`}
                note="Conceptvideo: deze laat de productrichting zien. Getoonde automatisering is geen garantie voor beschikbare functies in de testomgeving."
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
        text="Van websites en platforms tot merkidentiteiten, campagnes en content. Ontdek het werk achter SocialNow."
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
        text="Ontwerp, techniek en marketing horen bij elkaar. We helpen met één gerichte opdracht of als betrokken team naast je bedrijf."
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
          text="Probeer het OS en bespreek jouw Custom OS. Voor een losse opdracht maken we een gericht voorstel met een duidelijke scope."
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
              Je team, processen en prioriteiten bepalen waar een Custom OS het
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
          text="Onze creatieve en technische diensten blijven beschikbaar. We maken een voorstel voor je project of nemen ze mee in de samenwerking rond je Custom OS."
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
        text="SocialNow ontstond in 2021 vanuit ons werk voor klanten. Vandaag brengen we creatie, marketing en techniek samen in merken, websites en Custom OS-systemen."
      />
      <section className="h-wrap">
        <Founder />
      </section>
      <section className="h-section h-wrap">
        <Heading
          label="Wie je tegenkomt"
          title={
            <>
              Ieder een eigen vak.
              <br />
              <span>Samen SocialNow.</span>
            </>
          }
        />
        <TeamGrid />
        <p className="h-footnote">
          Steef Komen werkt vanuit Komen Consultancy mee aan accountancy en
          data.
        </p>
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
    const href = `mailto:info@socialnow.nl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDraft(href);
    setPrepared(true);
    window.location.href = href;
  };
  return (
    <>
      <PageHeading
        label="Jouw Custom OS begint met een gesprek"
        title={
          <>
            Wat kan het OS
            <br />
            <span>voor jou betekenen?</span>
          </>
        }
        text="Vertel ons hoe je bedrijf werkt. Samen bepalen we hoe het OS en ons team je kunnen helpen."
      />
      <section className="h-wrap h-contact-layout">
        <div>
          <div className="h-contact-person">
            <img
              src={`/images/${people[0].image}`}
              alt={people[0].name}
              width="180"
              height="180"
            />
            <div>
              <h2>Begin bij Marinus.</h2>
              <p>Founder & Creative Art Director</p>
            </div>
          </div>
          <div className="h-contact-methods">
            <a href="mailto:info@socialnow.nl">
              <Mail size={21} />
              <span>
                <small>E-mail</small>info@socialnow.nl
              </span>
              <ArrowUpRight size={19} />
            </a>
            <a
              href="https://wa.me/31637404577"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={21} />
              <span>
                <small>WhatsApp</small>Stuur ons een bericht
              </span>
              <ArrowUpRight size={19} />
            </a>
            <a href="tel:+31637404577">
              <Phone size={21} />
              <span>
                <small>Telefoon</small>+31 6 3740 4577
              </span>
              <ArrowUpRight size={19} />
            </a>
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
              placeholder="Bijvoorbeeld: Custom OS of een nieuwe website"
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
                Geen e-mailapp ingesteld? Mail naar info@socialnow.nl of stuur
                een WhatsApp.
              </p>
            </div>
          )}
        </form>
      </section>
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
