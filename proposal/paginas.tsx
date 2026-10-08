import React, { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CONTACT_MAIL, heeftWhatsApp, mailLink, whatsappLink } from "./aanvragen";
import {
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { miloPoster } from "./motion";
import ProjectCase from "./ProjectCase";
import ShowcaseFilms from "./ShowcaseFilms";
import { translate, useLanguage } from "./i18n/context";
import { Bento, Tegel } from "./Bento";
import { AuditTeaser } from "./AuditPage";
import FeaturedWork from "./FeaturedWork";
import LiveWebsites from "./LiveWebsites";
import { VideoSlider, ImageSliders } from "./MediaSliders";
import OsEntry, { GRATIS_OS_URL } from "./os-entry";
import { agents, people, projects, services } from "./content";
import Pricing from "./Pricing";
import TeamTrust from "./TeamTrust";
import OsPeople from "./OsPeople";
import { ProductOffer, ProductRoute } from "./ProductStart";
import { allPosts } from "../data/posts";
import socialPosts from "../public/data/socialposts.json";
import PartnerMichelle from "./PartnerMichelle";
import PartnerIntro from "./PartnerIntro";
import AdvisoryPartner from "./AdvisoryPartner";
import { Bedrijfsreferenties } from "./TeamTrust";
import {
  Action,
  AgentCards,
  ConversionBridge,
  Heading,
  PageHeading,
  ProjectCard,
  Questions,
  TeamGrid,
  TextLink,
  VideoBlock,
} from "./ui";

// 30 september 2026 (Marinus: "WIL ECHT INSTANT LOADING"): de pagina's buiten de homepage stonden in pages.tsx en
// gingen zo allemaal mee in het eerste script. Ze staan hier ongewijzigd en laden pas als iemand zo'n pagina opent
// (proposal/WebsiteProposal.tsx, proposal/later.tsx). De homepage en de hero blijven in pages.tsx.

// Al het contact loopt eerst via Steef (Marinus, 28 september 2026).
const contactPersoon = people.find((p) => p.name === "Steef Komen") ?? people[0];

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
export function OsPage() {
  // 28 september 2026 (Marinus, het verhaal): alle data in één OS, Odoo als laatste sleutel, gratis te gebruiken.
  return (
    <>
      <PageHeading
        label="SocialNow OS / Mensen en AI"
        title={
          <>
            Jouw ideeën. Onze mensen.
            <br />
            <span>Samen met AI.</span>
          </>
        }
        text="Je wilt iets opbouwen met je bedrijf. Wij brengen je ideeën, de juiste mensen en AI samen. Werk aan je website en content in je eigen OS. Voor richting, creativiteit en maatwerk werk je persoonlijk samen met ons team."
      />
      <div className="h-wrap sn-os-start">
        <TeamTrust />
        <div className="sn-os-start-links"><TextLink to="/contact?onderwerp=Samen%20werken%20met%20mensen%20en%20AI">Vertel ons wat je wilt bereiken</TextLink></div>
        <ProductRoute />
        <ProductOffer />
        <OsEntry />
      </div>
      <Bento label="Zo begin je">
        <Tegel kop="01 · WEBSITE" breed={4} id="route-website" className="sn-product-step">
          <h2 className="sn-tegel-titel">Begin met je website.</h2>
          <p className="sn-tegel-tekst">Je website vertelt wie je bent. Begin met een gratis demowebsite en bespreek met ons team hoe jouw merk en verhaal tot hun recht komen.</p>
          <TextLink to="/gratis-website">Gratis demowebsite aanvragen</TextLink>
        </Tegel>
        <Tegel kop="02 · CONTENT" breed={4} id="route-content" className="sn-product-step">
          <h2 className="sn-tegel-titel">Verzamel je content.</h2>
          <p className="sn-tegel-tekst">Verzamel je teksten, beelden en ideeën in je OS. Onze makers helpen je bij de creatieve richting en content die bij jou past.</p>
          <a className="h-text-link" href={GRATIS_OS_URL}>Probeer het OS gratis<ArrowUpRight size={16} aria-hidden="true" /></a>
        </Tegel>
        <Tegel kop="03 · STUDIO" breed={4} id="route-studio" className="sn-product-step">
          <h2 className="sn-tegel-titel">Maak samen met AI.</h2>
          <p className="sn-tegel-tekst">Gebruik AI in Studio om je ideeën uit te werken in je merkstijl. Jij kiest het resultaat. Wil je verder, dan werk je samen met onze creatieve specialisten.</p>
          <a className="h-text-link" href={GRATIS_OS_URL}>Open je OS<ArrowUpRight size={16} aria-hidden="true" /></a>
        </Tegel>
        <Tegel kop="Persoonlijk samenwerken" breed={12}>
          <h2 className="sn-tegel-titel">Het begint met jouw verhaal.</h2>
          <p className="sn-tegel-tekst">Vertel Steef wat je wilt bereiken. Samen kijken we welke makers, adviseurs en AI bij je vraag passen. Bij maatwerk heb je één aanspreekpunt dat de samenwerking en kwaliteit bewaakt.</p>
          <TeamTrust />
          <div className="sn-tegel-onder"><TextLink to="/contact?onderwerp=Samen%20werken%20met%20mensen%20en%20AI">Maak kennis met Steef</TextLink></div>
        </Tegel>
        <Tegel kop="Optionele koppelingen" breed={12}>
          <p className="sn-tegel-tekst">Odoo is een optionele koppeling voor klanten en verkoop. Je kunt beginnen met WEBSITE → CONTENT → STUDIO.</p>
          <TextLink to="/contact?onderwerp=Koppelingen">Bespreek je koppelingen</TextLink>
        </Tegel>
      </Bento>
      <section className="h-section h-wrap">
        <AgentCards />
        <ConversionBridge />
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
              <OsPeople role={agent.id} />
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
      <FeaturedWork />
      <LiveWebsites />
      <VideoSlider />
      <ImageSliders />
      <ShowcaseFilms />
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
  const vind = (namen: string[]) => namen
    .map(name => people.find(person => person.name === name))
    .filter((person): person is NonNullable<typeof person> => Boolean(person));
  // 1 oktober 2026 (Marinus): "de eerste laag mij en Steef met daarnaast Attesso, Sid en Douwe" en "Het punt moet zijn dat
  // Sid en ik spreken en de sterke teams ik en Steef samen met Sid en Douwe samen zijn."
  const socialnow = vind(["Marinus Bergsma", "Steef Komen"]);
  const attesso = vind(["Sid van Kalken", "Douwe Kramer"]);
  const fincer = vind(["Steven Goudsblom"]);
  const inTeams = [...socialnow, ...attesso, ...fincer, ...vind(["Albert Deltour"])].map(person => person.name);
  // Michelle staat vooraan bij de zelfstandige partners.
  const specialists = [
    ...vind(["Michelle Yang"]),
    ...people.filter(person => !inTeams.includes(person.name) && person.name !== "Michelle Yang"),
  ];

  return (
    <>
      <PageHeading
        label="Het team"
        title={
          <>
            Human Connection.
            <br />
            <span translate="no">Powered by AI Technology.</span>
          </>
        }
        text="SocialNow begon in november 2021. Sindsdien groeiden we uit tot een team van specialisten in creatie, marketing, data en techniek. Samen bouwen we één OS dat je bedrijf ontzorgt, en het persoonlijke contact blijft."
      />
      <section className="h-section h-wrap h-sterke-teams">
        <Heading
          label="SocialNow × Attesso × Fincer"
          title={
            <>
              Sterke partners.
              <br />
              <span>Samen bouwen we het.</span>
            </>
          }
        />
        <PartnerIntro />
        <div className="h-teams-duo">
          <div className="h-team-duo is-socialnow">
            <p className="h-team-duo-label" translate="no"><Link to="/" aria-label="SocialNow"><img src="/images/klein/SocialNow-Logo-2026-400.webp" alt="SocialNow" width="200" height="31" loading="lazy" /></Link></p>
            <TeamGrid members={socialnow} />
          </div>
          <div className="h-team-duo is-attesso">
            <p className="h-team-duo-label" translate="no"><a href="https://www.attesso.com/" target="_blank" rel="noopener noreferrer"><code>~/attesso</code></a></p>
            <TeamGrid members={attesso} />
          </div>
          <div className="h-team-duo is-fincer">
            <p className="h-team-duo-label" translate="no"><a href="https://www.linkedin.com/in/steven-goudsblom-bb3ab0197/" target="_blank" rel="noopener noreferrer" aria-label="Fincer, Steven Goudsblom on LinkedIn"><img src="/images/merken/fincer.png" alt="Fincer" width="150" height="38" loading="lazy" /></a></p>
            <TeamGrid members={fincer} />
          </div>
        </div>
        <p className="h-footnote">
          Marinus en Steef bouwen het OS en maken het schaalbaar. Sid en Douwe van Attesso werken aan veilige agentic payments. Steven van Fincer is onze partner voor vermogensbeheer. Marinus en Sid spreken samen: live demo&apos;s, talks en workshops, overal ter wereld.
        </p>
        <Bedrijfsreferenties />
      </section>
      <section className="h-wrap" aria-label="Extern advies aan SocialNow">
        <AdvisoryPartner />
      </section>
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
            <b translate="no"><a href="https://www.komenconsultancy.com/" target="_blank" rel="noopener noreferrer">Komen Consultancy</a></b>
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
      <section className="h-section h-wrap">
        <Heading
          label="Zelfstandige partners"
          title={
            <>
              Ieder een eigen vak.
              <br />
              <span>Persoonlijk voor je klaar.</span>
            </>
          }
        />
        {/* Zelfstandige partners brengen hun eigen expertise mee; SocialNow verbindt en bewaakt de kwaliteit. */}
        <p className="h-partners-tekst">
          Iedere partner brengt eigen expertise mee: van creatie en marketing tot data en techniek. SocialNow verbindt die expertise met jouw vraag en bewaakt de kwaliteit.
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
