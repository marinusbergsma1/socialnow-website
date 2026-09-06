import React, { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Layers3, Menu, MessageCircle, X } from 'lucide-react';
import OsEntry, { CLAIM_URL, REVIEWS_URL } from './os-entry';

const SITE = 'https://socialnow.nl';
const CONTACT = 'mailto:info@socialnow.nl?subject=Kennismaken%20over%20Custom%20OS';

const productParts = [
  {
    id: 'odoo', name: 'Odoo', purpose: 'Klanten & verkoop', label: 'Inzicht vanuit je eigen Odoo',
    heading: 'Van eerste contact tot verkoop.',
    body: 'Bekijk je CRM-leads, hun fase in de pijplijn en je recente offertes en verkooporders. Zo begint je overzicht bij de informatie die je al bijhoudt.',
    items: ['CRM-leads en fasen', 'Open pijplijn', 'Offertes en verkooporders'],
    note: 'De beschikbare gegevens hangen af van je Odoo-omgeving en toegangsrechten.',
  },
  {
    id: 'meta', name: 'Meta', purpose: 'Content & advertenties', label: 'Inzicht vanuit je eigen Meta',
    heading: 'Zie wat je content en advertenties doen.',
    body: 'Breng bereik, interacties en recente berichten samen met advertentie-uitgaven, klikken en leads. Je verbonden accounts en rechten bepalen welke gegevens beschikbaar zijn.',
    items: ['Bereik en interacties', 'Recente berichten en media', 'Advertentie-uitgaven, klikken en leads'],
    note: 'De POC geeft inzicht. Zelfstandig publiceren en campagnes beheren zijn geen standaardbelofte.',
  },
  {
    id: 'custom', name: 'Custom OS', purpose: 'Persoonlijk ingericht', label: 'Samen met het SocialNow-team',
    heading: 'Een systeem dat past bij jouw werk.',
    body: 'We beginnen bij je dagelijkse processen. Daarna bepalen we samen welke koppelingen, schermen en werkwijzen jouw bedrijf nodig heeft.',
    items: ['Je processen en prioriteiten in kaart', 'Persoonlijke inrichting en koppelingen', 'Samen testen en in gebruik nemen'],
    note: 'Website, Bouw met AI en Projectruimtes zijn in de POC contactmodules voor persoonlijke inrichting.',
  },
];

const people = [
  { name: 'Jos Hollenberg', role: 'Marketeer', image: 'Jos-Hollenberg-1.webp' },
  { name: 'Sergio Jovovic', role: 'Meta Marketeer', image: 'Sergio-Jovovic.webp' },
  { name: 'Sid van Kalken', role: 'Webdeveloper', image: 'Sid-van-Kalken.webp' },
];

const cases = [
  {
    name: 'kWh Garant', label: 'Website & conversie', slug: 'kwh-garant-website', image: '/screenshots/kwhgarant-hero.webp',
    text: 'Een website voor thuisbatterijen, met uitleg, een opbrengstberekening en een contentsysteem.',
  },
  {
    name: 'RAVEG', label: 'Merk, website & content', slug: 'raveg-branding', image: '/screenshots/raveg-bounce-hero.webp',
    text: 'Een merkidentiteit, doorvertaald naar een website en video- en motioncontent.',
  },
  {
    name: 'Divine Machines', label: 'Website & development', slug: 'divine-machines-website', image: '/screenshots/divine-machines-hero.webp',
    text: 'Een website waarin merkpresentatie, ontwerp en techniek bij elkaar komen.',
  },
];

const faqs = [
  { question: 'Wat is een Custom OS?', answer: 'Een bedrijfsomgeving die we inrichten rond de manier waarop jij en je team werken. De POC is het vertrekpunt. Voor je Custom OS spreken we samen af welke processen, koppelingen en onderdelen nodig zijn.' },
  { question: 'Wat kan ik nu met de POC?', answer: 'Je kunt je OS claimen en de stappen Bedrijf, Odoo en Meta doorlopen. Met geschikte accounts en toegangsrechten kun je gegevens uit je eigen Odoo en Meta verbinden. Welke informatie zichtbaar wordt, hangt af van die koppelingen. Niet elke toekomstige OS-module is al zelfstandig beschikbaar.' },
  { question: 'Kan ik mijn eigen Odoo en Meta gebruiken?', answer: 'Ja, de inrichting is bedoeld voor je eigen accounts. Voor Odoo zijn een geschikte omgeving en API-toegang nodig. Bij Meta bepalen je accounts en toegangsrechten welke pagina-, Instagram- en advertentiegegevens je kunt ophalen. We kunnen je helpen vaststellen wat voor jouw situatie nodig is.' },
  { question: 'Worden mijn advertenties automatisch beheerd?', answer: 'Dat beloven we niet voor de POC. De huidige Meta-koppeling is bedoeld om gegevens uit te lezen. Publiceren, budgetten wijzigen en campagnes beheren vragen een aparte, geteste inrichting.' },
  { question: 'Hoe werken Website, Bouw met AI en Projectruimtes?', answer: 'Dit zijn in de POC contactmodules. Ze brengen je bij ons team om je wensen te bespreken en de inrichting van jouw Custom OS te bepalen.' },
  { question: 'Wat kost een persoonlijk ingericht OS?', answer: 'Dat hangt af van je processen, koppelingen en begeleiding. Na een kennismaking maken we een voorstel met de afgesproken scope en kosten. Zo weet je wat er wordt ingericht voordat het werk begint.' },
  { question: 'Moet ik het OS installeren?', answer: 'Je kunt het OS in je browser openen. Wil je het als app gebruiken, dan vind je bij Installeer OS een korte uitleg voor je apparaat. Of installatie beschikbaar is, hangt af van je browser en versie.' },
];

function ProductOverview() {
  const [selected, setSelected] = useState(0);

  const keyboard = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % productParts.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + productParts.length - 1) % productParts.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = productParts.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    document.getElementById(`product-tab-${productParts[next].id}`)?.focus();
  };

  return (
    <div className="product-overview">
      <div className="product-topline"><span>SocialNow <b>/ OS</b></span><span>Zo is je OS opgebouwd</span></div>
      <div className="product-layout">
        <div className="product-tabs" role="tablist" aria-label="Onderdelen van je OS" aria-orientation="vertical">
          {productParts.map((item, index) => (
            <button key={item.id} type="button" role="tab" id={`product-tab-${item.id}`} aria-selected={selected === index}
              aria-controls={`product-panel-${item.id}`} tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)} onKeyDown={event => keyboard(event, index)}>
              <span className="product-number">0{index + 1}</span>
              <span><strong>{item.name}</strong><small>{item.purpose}</small></span>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          ))}
        </div>
        {productParts.map((part, index) => <div key={part.id} className="product-panel" role="tabpanel" id={`product-panel-${part.id}`} aria-labelledby={`product-tab-${part.id}`} tabIndex={0} hidden={selected !== index}>
          <span className="eyebrow">{part.label}</span>
          <h3>{part.heading}</h3>
          <p>{part.body}</p>
          <ul>{part.items.map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
          <p className="product-note">{part.note}</p>
        </div>)}
      </div>
      <div className="product-human"><MessageCircle size={17} aria-hidden="true" /><span>De software verbindt. Ons team helpt je inrichten.</span><a href="#begeleiding">Ontmoet ons <ArrowRight size={15} aria-hidden="true" /></a></div>
    </div>
  );
}

export default function WebsiteProposal() {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [{ label: 'Het OS', href: '#het-os' }, { label: 'Custom OS', href: '#custom-os' }, { label: 'Onze ervaring', href: '#ervaring' }, { label: 'Het team', href: '#begeleiding' }];

  return (
    <div className="website-proposal" id="boven">
      <a className="skip-link" href="#inhoud">Ga naar inhoud</a>
      <aside className="proposal-notice"><span>Websitevoorstel · 6 september 2026</span><a href="/">Vergelijk met de huidige site <ArrowUpRight size={13} aria-hidden="true" /></a></aside>
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href="#boven" aria-label="SocialNow, naar boven"><img src="/images/SocialNow-Logo-2026.webp" alt="SocialNow" width="200" height="32" /></a>
          <nav className="desktop-nav" aria-label="Hoofdnavigatie">{nav.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
          <a className="header-claim" href={CLAIM_URL}>Claim jouw OS <ArrowUpRight size={15} aria-hidden="true" /></a>
          <button type="button" className="menu-toggle" aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}</button>
        </div>
        <nav id="mobile-nav" className="mobile-nav wrap" aria-label="Mobiele navigatie" hidden={!menuOpen}>{nav.map(link => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowRight size={16} aria-hidden="true" /></a>)}</nav>
      </header>

      <main id="inhoud">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="small-marker" /> SocialNow / Custom OS</p>
            <h1 id="hero-title">Eén OS voor<br />je bedrijf.<br /><span>Gebouwd vanuit<br className="desktop-break" /> de praktijk.</span></h1>
            <p className="hero-description">Je klantinformatie staat in Odoo. Je content en advertenties bij Meta. SocialNow brengt ze samen in een OS dat we met jou inrichten rond je dagelijkse werk.</p>
            <OsEntry />
            <a className="quiet-link hero-more" href="#het-os">Ontdek hoe het werkt <ArrowDown size={15} aria-hidden="true" /></a>
          </div>
          <div className="hero-story">
            <div className="hero-os-card">
              <div className="hero-card-heading"><Layers3 size={20} aria-hidden="true" /><span>Jouw bedrijf, verbonden.</span><span className="small-marker" /></div>
              <div className="hero-system"><span className="system-name">Jouw OS</span><span>Inzicht in je bedrijf.<br />Ingericht op jouw manier.</span></div>
              <div className="system-connections" aria-hidden="true"><span /><span /><span /></div>
              <div className="system-sources"><a href="#het-os"><strong>Odoo</strong><small>Klanten & verkoop</small></a><a href="#het-os"><strong>Meta</strong><small>Content & ads</small></a><a href="#custom-os"><strong>Jouw werk</strong><small>Custom ingericht</small></a></div>
              <p className="system-caption">Begin met de POC. Bouw samen verder.</p>
            </div>
            <a className="hero-person" href="#begeleiding">
              <img src="/images/Marinus-Bergsma-V2.webp" alt="Marinus Bergsma" width="76" height="76" />
              <span><strong>Software met mensen erachter.</strong><span>Ontstaan uit ons werk voor klanten sinds 2021.</span><b>Leer het team kennen <ArrowUpRight size={14} aria-hidden="true" /></b></span>
            </a>
          </div>
        </section>

        <div className="fair-line wrap"><p><span>24—26 september</span> We presenteren de POC op de Odoo-beurs.</p><a href={CONTACT}>Plan een kennismaking <ArrowUpRight size={16} aria-hidden="true" /></a></div>

        <section className="section wrap" id="het-os" aria-labelledby="os-title">
          <div className="section-heading"><p className="eyebrow">01 / De basis</p><div><h2 id="os-title">Je systemen bestaan al.<br /><span>Nu het overzicht nog.</span></h2><p>Begin bij je eigen Odoo en Meta. Ontdek de informatie in je OS en bepaal samen met ons wat jouw bedrijf verder nodig heeft.</p></div></div>
          <ProductOverview />
        </section>

        <section className="section wrap custom-section" id="custom-os" aria-labelledby="custom-title">
          <div className="section-heading"><p className="eyebrow">02 / Van POC naar jouw OS</p><div><h2 id="custom-title">De basis is software.<br /><span>Het verschil is de inrichting.</span></h2><p>Een bedrijf past niet in één standaard werkwijze. Daarom is de POC het begin van een gesprek over hoe jij wilt werken.</p></div></div>
          <ol className="journey">
            <li><span className="step-number">01</span><p className="step-label">Zelf beginnen</p><h3>Claim & verken.</h3><p>Maak je bedrijfsomgeving aan. Doorloop de stappen voor je bedrijf, Odoo en Meta en test je eigen koppelingen.</p><a href={CLAIM_URL}>Claim jouw OS <ArrowRight size={15} aria-hidden="true" /></a></li>
            <li><span className="step-number">02</span><p className="step-label">Samen scherpstellen</p><h3>Vertel hoe je werkt.</h3><p>Waar gaat informatie verloren? Wat kost je team telkens tijd? We bepalen samen welke processen en onderdelen voor jou tellen.</p><a href={CONTACT}>Bespreek je bedrijf <ArrowRight size={15} aria-hidden="true" /></a></li>
            <li><span className="step-number">03</span><p className="step-label">Persoonlijk ingericht</p><h3>Bouw je Custom OS.</h3><p>We richten de afgesproken onderdelen in, testen ze met je en helpen je team ze in gebruik te nemen. Met duidelijke afspraken over scope en kosten.</p><a href="#begeleiding">Met wie je samenwerkt <ArrowRight size={15} aria-hidden="true" /></a></li>
          </ol>
          <details className="scope-details"><summary>Wat vraagt in de POC nog persoonlijke inrichting?<ChevronDown size={17} aria-hidden="true" /></summary><p>Website, Bouw met AI en Projectruimtes zijn contactmodules: je bespreekt je wensen met ons. Ook de verdere inrichting van Studio, CRM, Team en Milo wordt per onderdeel ontwikkeld en getest. We stemmen af wat voor jouw bedrijf beschikbaar en passend is.</p></details>
        </section>

        <section className="section wrap" id="ervaring" aria-labelledby="experience-title">
          <div className="section-heading"><p className="eyebrow">03 / Gebouwd op ervaring</p><div><h2 id="experience-title">Dit OS begon<br /><span>bij echt klantwerk.</span></h2><p>Sinds 2021 werken we aan merken, websites en content. Die ervaring nemen we mee in hoe we Custom OS-systemen ontwerpen en inrichten.</p></div></div>
          <div className="case-grid">{cases.map(item => <article className="case" key={item.slug}><a href={`${SITE}/project/${item.slug}`} aria-label={`Bekijk de case ${item.name}`}><div className="case-image"><img src={item.image} alt={`Website voor ${item.name}`} width="640" height="400" loading="lazy" decoding="async" /></div><div className="case-heading"><h3>{item.name}</h3><ArrowUpRight size={20} aria-hidden="true" /></div></a><p className="case-label">{item.label}</p><p>{item.text}</p></article>)}</div>
          <div className="experience-foot"><p>Werk uit onze praktijk. De cases laten zien wat we voor deze merken maakten.</p><a className="quiet-link" href={`${SITE}/projecten`}>Meer klantwerk <ArrowUpRight size={16} aria-hidden="true" /></a></div>
          <figure className="client-quote"><img src="/images/Ellen-Sluijs.webp" alt="Ellen Sluijs" width="64" height="64" loading="lazy" /><div><blockquote>“Wij zijn heel erg blij met Marinus. Denkt goed mee en levert op tijd. Topper!”</blockquote><figcaption>Ellen Sluijs · kWh Garant <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer">Klantreactie op Google <ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only">(opent een nieuw tabblad)</span></a></figcaption></div></figure>
        </section>

        <section className="section wrap" id="begeleiding" aria-labelledby="team-title">
          <div className="section-heading"><p className="eyebrow">04 / De mensen erachter</p><div><h2 id="team-title">Je hoeft het niet<br /><span>alleen uit te zoeken.</span></h2><p>Je werkt met mensen die merken bouwen, campagnes maken en websites ontwikkelen. We helpen je de vertaalslag te maken van je dagelijkse praktijk naar een werkbaar OS.</p></div></div>
          <figure className="founder"><img className="founder-photo" src="/images/Marinus-Bergsma-V2.webp" alt="Marinus Bergsma, oprichter van SocialNow" width="640" height="680" loading="lazy" /><div className="founder-voice"><p className="eyebrow">Waarom we dit bouwen</p><blockquote>“Ik wil dat je als ondernemer je bedrijf kunt aansturen zonder eerst software te moeten leren. Daarom bouwen we Custom OS-systemen die eenvoudig werken, bij jouw bedrijf passen en mensen achter zich hebben.”</blockquote><figcaption>Marinus Bergsma · Oprichter SocialNow<small>Nieuwe concepttekst voor Marinus, ter beoordeling.</small></figcaption></div></figure>
          <div className="team-grid">{people.map(person => <figure key={person.name}><div className="portrait"><img src={`/images/${person.image}`} alt={person.name} width="640" height="680" loading="lazy" decoding="async" /></div><figcaption><strong>{person.name}</strong><span>{person.role}</span></figcaption></figure>)}</div>
          <div className="team-bottom"><a className="quiet-link" href={`${SITE}/team`}>Ontmoet het hele team <ArrowUpRight size={16} aria-hidden="true" /></a><a className="contact-link" href={CONTACT}>Bespreek jouw Custom OS <ArrowRight size={17} aria-hidden="true" /></a></div>
        </section>

        <section className="section wrap faq-section" aria-labelledby="faq-title"><div><p className="eyebrow">Goed om te weten</p><h2 id="faq-title">Heldere antwoorden.<br /><span>Voor je begint.</span></h2><a className="quiet-link" href={CONTACT}>Stel ons je vraag <ArrowUpRight size={16} aria-hidden="true" /></a></div><div className="faq-list">{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<ChevronDown size={17} aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div></section>

        <section className="closing wrap" aria-labelledby="closing-title"><p className="eyebrow">Jouw volgende stap</p><h2 id="closing-title">Begin met je OS.<br /><span>Maak het samen van jou.</span></h2><p>Claim je bedrijfsomgeving en verken de POC.<br />Wij helpen je verder met de persoonlijke inrichting.</p><OsEntry /><a className="quiet-link" href={CONTACT}>Liever eerst kennismaken <ArrowUpRight size={15} aria-hidden="true" /></a></section>
      </main>

      <footer className="site-footer wrap"><div className="footer-top"><a className="brand" href="#boven"><img src="/images/SocialNow-Logo-2026.webp" alt="SocialNow" width="200" height="32" loading="lazy" /></a><p>Custom OS.<br />Gebouwd vanuit de praktijk.</p><a href="mailto:info@socialnow.nl">info@socialnow.nl <ArrowUpRight size={16} aria-hidden="true" /></a></div><div className="footer-bottom"><p>© {new Date().getFullYear()} SocialNow · Amsterdam · KVK 90877179</p><nav aria-label="Footernavigatie"><a href={`${SITE}/projecten`}>Projecten</a><a href={`${SITE}/diensten`}>Diensten</a><a href={`${SITE}/privacy`}>Privacy</a><a href="https://storage.googleapis.com/video-slider/Algemene%20Voorwaarden%20SocialNow.pdf" target="_blank" rel="noopener noreferrer">Voorwaarden<span className="sr-only"> (PDF, opent een nieuw tabblad)</span></a></nav></div></footer>
    </div>
  );
}
