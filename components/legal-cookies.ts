// De cookieverklaring en de AI-verklaring — 20 september 2026.
//
// WAAROM EEN APARTE COOKIEVERKLARING
//
// Cookies vallen niet onder de AVG maar onder artikel 11.7a Telecommunicatiewet, de Nederlandse
// uitwerking van de ePrivacy-richtlijn. Die stelt een eigen eis: voor alles wat geen strikt
// noodzakelijke cookie of opslag is, moet er vooraf toestemming zijn, en moet er vooraf staan
// waarvoor. Dat staat los van de vraag of er een persoonsgegeven in zit. In het privacybeleid
// stond het als één artikel tussen negen andere; hier staat per cookie wat hij doet, hoe lang hij
// blijft en of er toestemming voor nodig is. Dat is wat een toezichthouder wil kunnen nalezen.
//
// WAAROM EEN AI-VERKLARING
//
// De AI-verordening (Verordening (EU) 2024/1689) legt in artikel 50 een transparantieplicht op:
// wie beeld, geluid of tekst laat maken of bewerken door AI, moet dat kenbaar maken wanneer het
// om synthetische inhoud gaat. Die plicht gaat in augustus 2026 in. Het OS maakt uitingen met
// modellen; dan hoort er te staan wat er gebeurt, welke modellen het zijn, wat er níet mee wordt
// gedaan, en wie verantwoordelijk is voor wat er gepubliceerd wordt.
import type { LegalDoc, Language } from "./legal";

export const cookies: Partial<Record<Language, LegalDoc>> & { nl: LegalDoc; en: LegalDoc } = {
  nl: {
    title: "Cookieverklaring",
    intro:
      "Wat wij in je browser bewaren, waarom, hoe lang, en waar je het weer uitzet. Socialnow.nl plaatst geen trackingcookies en gebruikt geen advertentienetwerken. In SocialNow OS meten wij alleen als jij daar zelf toestemming voor geeft.",
    updated: "Laatst bijgewerkt: 20 september 2026",
    sections: [
      {
        title: "Kort",
        paragraphs: [
          "Op socialnow.nl staan alleen dingen die nodig zijn om de site te laten werken en om te onthouden wat jij koos. Daar is volgens artikel 11.7a lid 3 Telecommunicatiewet geen toestemming voor nodig, want zonder die dingen werkt de site niet of vergeet hij jouw keuze bij elke klik.",
          "In SocialNow OS staat daarnaast vrijwillige gebruiksmeting met PostHog die toestemming vraagt. Dat staat standaard uit. Geef je geen toestemming, dan wordt PostHog niet geladen; er staat dan geen script van die partij op de pagina en er gaat niets naartoe.",
          "Gemaskeerde schermopnames staan voor jou standaard uit en vragen afzonderlijke toestemming. Tekst, invoervelden en media worden afgeschermd; account-, CRM-, betaal- en beheerschermen zijn uitgesloten. Nieuwe opnames blijven 30 dagen bewaard. Er wordt geen geluid of camera opgenomen.",
        ],
      },
      {
        title: "Wat is een cookie, en wat valt er verder onder",
        paragraphs: [
          "Een cookie is een klein tekstbestand dat een website in je browser zet en bij een volgend bezoek weer kan lezen. Onder dezelfde regels vallen localStorage en sessionStorage: andere technieken, dezelfde vraag, namelijk of er iets op jouw apparaat wordt gezet of uitgelezen.",
          "Daarom staan ze hieronder door elkaar, met erbij welke techniek het is.",
        ],
      },
      {
        title: "Op socialnow.nl",
        paragraphs: [
          "Noodzakelijk, geen toestemming nodig:",
          "Er staat op socialnow.nl geen Google Analytics, geen Meta-pixel, geen LinkedIn Insight Tag en geen advertentiecookie. Als dat ooit verandert, verschijnt hier eerst een toestemmingsvraag en wordt deze verklaring bijgewerkt voordat er iets geladen wordt.",
        ],
        bullets: [
          [
            "sn-akkoord (localStorage, blijft tot je je browseropslag leegmaakt): onthoudt dat je het welkomstscherm met de voorwaarden hebt gezien, per versie van die tekst. Een nieuwe versie vraagt opnieuw.",
            "sn-taal (cookie op .socialnow.nl, één jaar): de taal die je koos, zodat de site en het OS in dezelfde taal staan.",
            "sn-land (cookie op .socialnow.nl, één jaar): het land dat je koos, waarmee wij de taal en de juiste contactgegevens bepalen.",
            "sn-meten (cookie op .socialnow.nl, 180 dagen vanuit de app; een jaar vanuit de website) en sn-replay-v1 (180 dagen vanuit de app): afzonderlijke keuzes over meten en opnemen, ja of nee. Deze cookie is zelf noodzakelijk, want zonder hem weten wij niet dat je nee hebt gezegd.",
          ],
          [],
        ],
      },
      {
        title: "In SocialNow OS",
        paragraphs: [
          "Noodzakelijk, geen toestemming nodig:",
          "Alleen met jouw toestemming:",
          "Je verandert je keuze op elk moment: in het OS onder Account, of via de vraag onderin het scherm. Zet je hem op nee, dan stopt het versturen direct eerdere gegevens bij PostHog worden daarmee niet automatisch gewist; daarvoor kun je ons benaderen.",
        ],
        bullets: [
          [
            "de sessiecookie van je inlog: houdt je ingelogd. Zonder deze cookie kun je het OS niet gebruiken.",
            "voorkeuren in localStorage: welk tabblad je open had, welke kolom je koos, een concept dat je nog niet verstuurd hebt. Deze blijven in jouw browser en komen nooit bij ons terecht.",
            "de service worker en zijn cache: houdt het OS snel en laat het werken bij een haperende verbinding.",
          ],
          [
            "PostHog (EU-datacentrum Frankfurt): vooraf bepaalde gebruiksgebeurtenissen en schermroutes, gekoppeld aan een pseudoniem en werkruimtekenmerk. De nieuwe appconfiguratie bewaart de analyticsidentiteit alleen in het geheugen. Oudere versies konden ph_*-cookies bewaren. Zonder toestemming wordt PostHog niet geladen. Met afzonderlijke toestemming zijn gemaskeerde schermopnames mogelijk; zie het privacybeleid.",
          ],
          [],
        ],
      },
      {
        title: "Cookies van derden die wij niet zelf plaatsen",
        paragraphs: [
          "Koppel je in het OS je eigen kanalen — Meta, Google, je socialaccounts — dan gaat dat via de inlogschermen van die partijen. Op zo'n scherm gelden hun eigen cookies en hun eigen verklaring. Wij hebben daar geen invloed op en zetten daar zelf niets.",
          "Staat er op een website die wij voor jou bouwen wél een pixel of een analyticsscript, dan ben jij daarvoor de verantwoordelijke en hoort op die website een eigen cookieverklaring en een eigen toestemmingsvraag. Wij helpen je die in te richten; de keuze om zo'n script te plaatsen is de jouwe.",
        ],
      },
      {
        title: "Zelf uitzetten in je browser",
        paragraphs: [
          "Naast onze eigen knop kun je cookies altijd in je browser blokkeren of verwijderen. Dat staat bij Chrome, Safari, Firefox en Edge onder instellingen bij privacy. Blokkeer je alles, dan werkt het inloggen in het OS niet meer, want dat leunt op de sessiecookie.",
          "Een Do Not Track- of Global Privacy Control-signaal van je browser behandelen wij als een nee op de vraag over meten.",
        ],
      },
      {
        title: "Vragen",
        paragraphs: [
          "Klopt er iets niet in deze lijst, of zie je in je browser iets staan dat er volgens ons niet hoort te zijn: privacy@socialnow.nl. Dat willen wij weten, want een cookieverklaring die niet klopt is erger dan geen.",
        ],
      },
    ],
  },
  en: {
    title: "Cookie statement",
    intro:
      "What we store in your browser, why, for how long, and where you switch it off. Socialnow.nl sets no tracking cookies and uses no ad networks. In SocialNow OS we measure only if you allow it yourself.",
    updated: "Last updated: 20 September 2026",
    sections: [
      {
        title: "In short",
        paragraphs: [
          "Socialnow.nl only holds what is needed to make the site work and to remember what you chose. Under Article 11.7a(3) of the Dutch Telecommunications Act no consent is required for that, because without it the site does not work or forgets your choice on every click.",
          "In SocialNow OS optional usage measurement with PostHog requires consent. It is off by default. If you do not consent, PostHog is not loaded; no script from that party is on the page and nothing is sent to it.",
          "Masked session recordings are off for you by default and require separate consent. Text, inputs and media are masked; account, CRM, payment and administration screens are excluded. New recordings are retained for 30 days. No audio or camera is recorded.",
        ],
      },
      {
        title: "What is a cookie, and what else counts",
        paragraphs: [
          "A cookie is a small text file a website places in your browser and can read again on a later visit. The same rules cover localStorage and sessionStorage: different techniques, the same question, namely whether something is placed on or read from your device.",
          "That is why they are listed together below, with the technique named.",
        ],
      },
      {
        title: "On socialnow.nl",
        paragraphs: [
          "Necessary, no consent required:",
          "There is no Google Analytics, no Meta pixel, no LinkedIn Insight Tag and no advertising cookie on socialnow.nl. Should that ever change, a consent request appears here first and this statement is updated before anything loads.",
        ],
        bullets: [
          [
            "sn-akkoord (localStorage, stays until you clear your browser storage): remembers that you have seen the welcome screen with the terms, per version of that text. A new version asks again.",
            "sn-taal (cookie on .socialnow.nl, one year): the language you chose, so the site and the OS are in the same language.",
            "sn-land (cookie on .socialnow.nl, one year): the country you chose, from which we derive the language and the right contact details.",
            "sn-meten (cookie on .socialnow.nl, 180 days from the app; one year from the website) and sn-replay-v1 (180 days from the app): separate choices about measurement and recording, yes or no. This cookie is itself necessary, because without it we do not know that you said no.",
          ],
          [],
        ],
      },
      {
        title: "In SocialNow OS",
        paragraphs: [
          "Necessary, no consent required:",
          "Only with your consent:",
          "You change your choice at any time: in the OS under Account, or through the question at the bottom of the screen. Set it to no and sending stops immediately, existing data at PostHog is not automatically erased; contact us for an erasure request.",
        ],
        bullets: [
          [
            "the session cookie of your sign-in: keeps you signed in. Without it you cannot use the OS.",
            "preferences in localStorage: which tab you had open, which column you chose, a draft you have not sent. These stay in your browser and never reach us.",
            "the service worker and its cache: keeps the OS fast and lets it work on a patchy connection.",
          ],
          [
            "PostHog (EU data centre Frankfurt): predefined usage events and screen routes linked to a pseudonym and workspace identifier. The new app configuration keeps the analytics identity in memory. Older versions could store ph_* cookies. Without consent PostHog is not loaded. Masked session recordings require separate consent; see the privacy policy.",
          ],
          [],
        ],
      },
      {
        title: "Third-party cookies we do not set ourselves",
        paragraphs: [
          "If you connect your own channels in the OS — Meta, Google, your social accounts — that runs through those parties' own sign-in screens. On such a screen their cookies and their statement apply. We have no influence there and set nothing of our own.",
          "If a website we build for you does carry a pixel or an analytics script, you are the controller for it and that website needs its own cookie statement and its own consent request. We help you set that up; the choice to place such a script is yours.",
        ],
      },
      {
        title: "Switching off in your browser",
        paragraphs: [
          "Besides our own control, you can always block or delete cookies in your browser. In Chrome, Safari, Firefox and Edge this sits under settings, privacy. If you block everything, signing in to the OS no longer works, because it relies on the session cookie.",
          "We treat a Do Not Track or Global Privacy Control signal from your browser as a no to the question about measurement.",
        ],
      },
      {
        title: "Questions",
        paragraphs: [
          "If something in this list is wrong, or you see something in your browser that by our own account should not be there: privacy@socialnow.nl. We want to know, because a cookie statement that is wrong is worse than none.",
        ],
      },
    ],
  },
};

export const ai: Partial<Record<Language, LegalDoc>> & { nl: LegalDoc; en: LegalDoc } = {
  nl: {
    title: "AI-verklaring",
    intro:
      "SocialNow OS maakt teksten, beelden en films met AI-modellen. Deze verklaring zegt waar dat gebeurt, welke modellen wij gebruiken, wat er met jouw invoer wel en niet gebeurt, en wie verantwoordelijk is voor wat er uiteindelijk gepubliceerd wordt.",
    updated: "Laatst bijgewerkt: 20 september 2026",
    sections: [
      {
        title: "Waar AI in het OS zit",
        paragraphs: [
          "Milo is de assistent in het OS. Hij leest wat er in jouw werkruimte staat en beantwoordt vragen, stelt taken voor en zet handelingen klaar.",
          "De Studio maakt uitingen: kopij, beeld en film, op basis van jouw merkpaspoort en de opdracht die je geeft.",
          "De merkscan leest een website en leidt daar kleuren, letters en toon uit af.",
          "Het CRM en de agenda gebruiken AI voor samenvattingen, conceptberichten en voorstellen voor het beste moment om te plaatsen.",
        ],
      },
      {
        title: "Welke modellen, en waar ze draaien",
        paragraphs: [
          "Wij gebruiken modellen van Google (Gemini), OpenAI, Anthropic en Higgsfield. Welk model een taak doet kan per functie en per moment verschillen; wij kiezen op kwaliteit, snelheid en kosten.",
          "De actuele lijst met leveranciers, met waar zij verwerken en op welke grondslag gegevens de EER verlaten, staat in bijlage C van de verwerkersovereenkomst.",
          "Wij bouwen zelf geen modellen en trainen geen modellen. Wij gebruiken bestaande modellen en geven ze context uit jouw werkruimte.",
        ],
      },
      {
        title: "Wat er met jouw invoer gebeurt",
        paragraphs: [
          "Wat jij invoert of wat uit jouw gekoppelde bronnen komt, gaat naar een model alleen om jouw opdracht uit te voeren, en alleen het deel dat daarvoor nodig is.",
          "Met alle modelleveranciers is contractueel uitgesloten dat jouw invoer wordt gebruikt om hun modellen te trainen. Wij gebruiken jouw gegevens ook zelf niet om een model te trainen of af te stemmen.",
          "Wij gebruiken wél een kennislaag: teksten en voorbeelden waarmee wij een model gronden, zodat het antwoord bij SocialNow past. Die laag bevat geen klantgegevens.",
          "Sleutels die je invoert voor Odoo, Meta, Google of je socialkanalen gaan nooit naar een model.",
        ],
      },
      {
        title: "Kenbaarheid van AI-inhoud",
        paragraphs: [
          "Artikel 50 van de AI-verordening (Verordening (EU) 2024/1689) verplicht wie synthetische inhoud maakt om dat kenbaar te maken. Wij vullen dat als volgt in.",
          "In het OS is altijd zichtbaar dat een uiting door een model is gemaakt: de Studio toont het bij het maken, en een uiting houdt die herkomst bij zich in je media.",
          "Beeld en film die met een model gemaakt zijn, dragen de herkomstgegevens die de leverancier meegeeft, waaronder C2PA-gegevens waar het model die levert. Wij halen die niet weg.",
          "Publiceer je een uiting op een kanaal dat een eigen AI-label kent, zoals Meta of TikTok, dan is het aan jou om dat label te zetten. Wij kunnen dat niet voor je afdwingen, en wij zetten het niet stilletjes uit.",
        ],
      },
      {
        title: "Wat AI in het OS niet doet",
        paragraphs: [
          "Er wordt niets namens jou gepubliceerd zonder dat jij of een teamlid met schrijfrechten daarop klikt. Een model stelt voor; een mens besluit.",
          "Er wordt geen besluit over een persoon genomen dat rechtsgevolgen heeft of iemand in aanmerkelijke mate treft. Er is geen geautomatiseerde besluitvorming in de zin van artikel 22 AVG.",
          "Er wordt niet gescoord, gerangschikt of geprofileerd op eigenschappen van personen buiten wat jij zelf in je CRM vastlegt.",
          "Er wordt niet met gegevens van de ene klant een antwoord voor een andere klant gemaakt. Een werkruimte is een grens, ook voor het model.",
        ],
      },
      {
        title: "Wat een model fout kan doen",
        paragraphs: [
          "Modellen verzinnen soms iets dat klopt lijkt te zijn. Ze halen namen en getallen door elkaar, ze vullen een lege plek op, en ze zijn even stellig als ze het mis hebben.",
          "Daarom: controleer elke tekst en elk cijfer voordat je publiceert, zeker bij prijzen, claims, namen en afspraken. Het OS zet geen bedrag of belofte in een uiting die het niet uit jouw bron heeft, maar een model dat om een tekst gevraagd wordt kan er alsnog een zin bij bedenken.",
          "De verantwoordelijkheid voor wat er uiteindelijk onder jouw naam naar buiten gaat ligt bij jou. Dat staat ook in de algemene voorwaarden.",
        ],
      },
      {
        title: "Auteursrecht en portretrecht",
        paragraphs: [
          "Beeld dat met een model is gemaakt op basis van jouw opdracht mag je gebruiken zoals afgesproken in de algemene voorwaarden. De rechtspositie van AI-beeld is in beweging; wij geven geen garantie dat op zulk beeld auteursrecht rust, en dus ook niet dat je anderen kunt verbieden iets vergelijkbaars te maken.",
          "Lever je eigen beeld aan, bijvoorbeeld foto's van je team of je producten, dan verklaar je dat je die mag gebruiken en dat de mensen erop toestemming hebben gegeven. Wij gebruiken jouw beeld alleen voor jouw uitingen.",
          "Vraag een model niet om het werk of het gezicht van een bestaande persoon of een bestaand merk na te maken. Dat is een inbreuk, ook als een model het gewoon doet.",
        ],
      },
      {
        title: "Vragen en bezwaar",
        paragraphs: [
          "Wil je weten welk model een bepaalde uiting heeft gemaakt, of wil je dat een bepaald soort verwerking niet meer gebeurt: privacy@socialnow.nl. Wij kunnen per werkruimte functies uitzetten.",
        ],
      },
    ],
  },
  en: {
    title: "AI statement",
    intro:
      "SocialNow OS creates text, images and film with AI models. This statement says where that happens, which models we use, what does and does not happen to your input, and who is responsible for what finally gets published. The Dutch version is the binding one.",
    updated: "Last updated: 20 September 2026",
    sections: [
      {
        title: "Where AI sits in the OS",
        paragraphs: [
          "Milo is the assistant in the OS. It reads what is in your workspace and answers questions, proposes tasks and prepares actions.",
          "The Studio creates posts: copy, image and film, based on your brand passport and the brief you give.",
          "The brand scan reads a website and derives colours, typefaces and tone from it.",
          "The CRM and the calendar use AI for summaries, draft messages and suggestions for the best moment to post.",
        ],
      },
      {
        title: "Which models, and where they run",
        paragraphs: [
          "We use models from Google (Gemini), OpenAI, Anthropic and Higgsfield. Which model performs a task can differ per feature and per moment; we choose on quality, speed and cost.",
          "The current list of providers, with where they process and on what basis data leaves the EEA, is in Annex C of the data processing agreement.",
          "We do not build models and we do not train models. We use existing models and give them context from your workspace.",
        ],
      },
      {
        title: "What happens to your input",
        paragraphs: [
          "What you enter, or what comes from your connected sources, goes to a model only to carry out your instruction, and only the part needed for it.",
          "With every model provider it is contractually excluded that your input is used to train their models. We do not use your data to train or fine-tune a model either.",
          "We do use a knowledge layer: texts and examples with which we ground a model so the answer fits SocialNow. That layer contains no customer data.",
          "Keys you enter for Odoo, Meta, Google or your social channels never go to a model.",
        ],
      },
      {
        title: "Disclosure of AI content",
        paragraphs: [
          "Article 50 of the AI Act (Regulation (EU) 2024/1689) requires those who create synthetic content to disclose it. We implement that as follows.",
          "In the OS it is always visible that a post was created by a model: the Studio shows it while creating, and a post carries that origin with it in your media.",
          "Images and film created with a model carry the provenance data the provider attaches, including C2PA data where the model supplies it. We do not strip it.",
          "If you publish a post on a channel with its own AI label, such as Meta or TikTok, setting that label is up to you. We cannot enforce it for you, and we do not quietly switch it off.",
        ],
      },
      {
        title: "What AI in the OS does not do",
        paragraphs: [
          "Nothing is published on your behalf without you or a team member with write rights clicking on it. A model proposes; a person decides.",
          "No decision is taken about a person that produces legal effects or similarly significantly affects them. There is no automated decision-making within the meaning of Article 22 GDPR.",
          "There is no scoring, ranking or profiling on characteristics of people beyond what you record in your own CRM.",
          "One client's data is never used to produce an answer for another client. A workspace is a boundary, for the model too.",
        ],
      },
      {
        title: "What a model can get wrong",
        paragraphs: [
          "Models sometimes invent something that looks right. They mix up names and numbers, they fill an empty space, and they are just as confident when they are wrong.",
          "So: check every text and every figure before you publish, certainly for prices, claims, names and commitments. The OS does not put an amount or a promise into a post that it did not take from your source, but a model asked for a text may still add a sentence.",
          "Responsibility for what finally goes out under your name lies with you. That is also stated in the terms of service.",
        ],
      },
      {
        title: "Copyright and image rights",
        paragraphs: [
          "Images created with a model on your brief may be used as agreed in the terms of service. The legal position of AI imagery is in motion; we give no guarantee that copyright subsists in such imagery, and therefore none that you can stop others from making something similar.",
          "If you supply your own images, for example photos of your team or products, you declare that you are allowed to use them and that the people shown have consented. We use your images only for your own posts.",
          "Do not ask a model to reproduce the work or the face of an existing person or brand. That is an infringement, even when a model simply does it.",
        ],
      },
      {
        title: "Questions and objection",
        paragraphs: [
          "If you want to know which model produced a particular post, or you want a certain kind of processing to stop: privacy@socialnow.nl. We can switch features off per workspace.",
        ],
      },
    ],
  },
};
