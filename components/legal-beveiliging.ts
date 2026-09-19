// Het beveiligingsbeleid en het beleid voor aanvaardbaar gebruik — 19 september 2026.
//
// WAAROM DEZE TWEE HIER STAAN
//
// De beveiligingsmaatregelen staan als bijlage B in de verwerkersovereenkomst, want daar eist
// artikel 32 AVG ze. Maar een verwerkersovereenkomst lees je pas als je klant wordt, en de
// vragen over beveiliging komen daarvóór: in een inkoopvragenlijst, in een gesprek met de ICT'er
// van een klant, of van iemand die een kwetsbaarheid gevonden heeft en niet weet waar hij moet
// zijn. Daarom staat het hier ook als eigen, publiek document, met daarin het stuk dat in de
// bijlage niet past: hoe je een lek meldt en wat je dan van ons mag verwachten.
//
// Het beleid voor aanvaardbaar gebruik is de andere kant van diezelfde medaille. De algemene
// voorwaarden zeggen in artikel 10 dat wij mogen opschorten bij misbruik, maar niet wat misbruik
// is. Dat hoort ergens te staan voordat het gebeurt, anders is elke opschorting willekeur.
import type { LegalDoc, Language } from "./legal";

export const beveiliging: Partial<Record<Language, LegalDoc>> & { nl: LegalDoc; en: LegalDoc } = {
  nl: {
    title: "Beveiliging",
    intro:
      "Hoe wij jouw gegevens beschermen, wat wij doen als er iets misgaat, en hoe je een kwetsbaarheid meldt. Dit document is bedoeld om vooraf te kunnen lezen: door jou, door je ICT'er, of door iemand die iets gevonden heeft.",
    updated: "Laatst bijgewerkt: 19 september 2026",
    sections: [
      {
        title: "De uitgangspunten",
        paragraphs: [
          "Zo min mogelijk bewaren. Wat er niet is, kan niet uitlekken. Wij vragen geen gegevens die wij niet nodig hebben en bewaren niets langer dan waarvoor wij het hebben.",
          "Eén werkruimte is een grens. Elk verzoek wordt per verzoek gecontroleerd op werkruimte en rol; er is geen scherm waarin per ongeluk de gegevens van een andere klant kunnen verschijnen.",
          "Een sleutel die je ons geeft is van jou. Sleutels voor Odoo, Meta, Google of je socialkanalen worden versleuteld opgeslagen, nooit teruggetoond, nooit in een logregel geschreven en nooit naar een AI-model gestuurd.",
          "Toegang van een beheerder is tijdelijk en laat een spoor na. Er is geen permanente beheerderssessie in een klantomgeving.",
        ],
      },
      {
        title: "Toegang",
        paragraphs: [
          "Inloggen op een account gaat via een identiteitsdienst met tweestapsverificatie. Beheerderstoegang bij SocialNow gaat via een passkey, met een tijdgebonden code als terugval bij een nieuw apparaat.",
          "Wil een beheerder een klantomgeving openen, dan gebeurt dat met een briefje dat twee minuten geldig is, dat alleen dat ene systeem opent en dat door dat systeem zelf wordt beoordeeld. Het briefje zelf komt nergens in een logboek; de uitgifte wel, met wie, welk systeem en wanneer.",
          "Rechten worden per werkruimte toegekend. Vertrekt iemand, dan wordt zijn toegang ingetrokken; in het OS doe je dat zelf onder Team.",
        ],
      },
      {
        title: "Versleuteling",
        paragraphs: [
          "Al het verkeer loopt over TLS. Wie op http binnenkomt wordt doorgestuurd naar https.",
          "Gegevens staan versleuteld op de opslag van onze leveranciers.",
          "Geheimen staan uitsluitend in de omgeving van de hostingleverancier. Ze staan niet in de broncode en niet in een configuratiebestand dat meegaat in versiebeheer.",
        ],
      },
      {
        title: "De software zelf",
        paragraphs: [
          "Alle code staat in versiebeheer. Elke publicatie is herleidbaar tot een commit en kan worden teruggedraaid.",
          "Voor elke publicatie draait een geautomatiseerde testsuite van meer dan tweeduizend tests. Een rode suite betekent niet publiceren.",
          "Een strikt Content Security Policy bepaalt welke scripts, stijlen en verbindingen een pagina mag gebruiken. Een script van een onbekende herkomst draait niet, ook niet als het er via een omweg in zou komen.",
          "Afhankelijkheden worden gecontroleerd op bekende kwetsbaarheden. Een kwetsbaarheid van niveau hoog of hoger blokkeert de publicatie tot hij verholpen is.",
        ],
      },
      {
        title: "Toezicht",
        paragraphs: [
          "Handelingen met gevolgen — toegang verlenen, een systeem openen, een sleutel wijzigen — komen in een auditspoor.",
          "Fouten en waarschuwingen worden centraal verzameld. Persoonsgegevens worden daar niet in meegeschreven.",
          "De bereikbaarheid en de inlogbeveiliging van elk klantsysteem worden doorlopend automatisch gecontroleerd. Serveert een systeem zijn startpagina zonder inlog, dan staat dat als alarm op het beheerscherm.",
        ],
      },
      {
        title: "Als er toch iets misgaat",
        paragraphs: [
          "Wij melden een inbreuk in verband met persoonsgegevens binnen 24 uur na ontdekking bij de betrokken klant, met wat er is gebeurd, wat het vermoedelijk raakt, wat wij hebben gedaan en bij wie je terechtkunt. Dat is korter dan de 72 uur die de AVG jou geeft, zodat jij je eigen afweging kunt maken met tijd over.",
          "Wij houden een register bij van inbreuken, ook van die welke niet gemeld hoefden te worden.",
          "Wij melden niet namens jou bij de toezichthouder, tenzij je ons daar schriftelijk om vraagt. Jij bent de verwerkingsverantwoordelijke; die melding is jouw beslissing.",
        ],
      },
      {
        title: "Een kwetsbaarheid melden",
        paragraphs: [
          "Vind je iets, meld het dan op security@socialnow.nl. Beschrijf wat je vond, waar, en hoe je het kunt laten zien. Een schermafbeelding of een kort stappenplan helpt.",
          "Wat je van ons mag verwachten: binnen drie werkdagen een reactie van een mens, een inschatting van de ernst binnen tien werkdagen, en bericht wanneer het verholpen is. Meld je verantwoord en misbruik je niet wat je gevonden hebt, dan doen wij geen aangifte en stellen wij je niet aansprakelijk. Wil je genoemd worden bij de oplossing, dan doen wij dat graag.",
          "Wat wij van jou vragen: geen gegevens van anderen inzien, kopiëren, wijzigen of verwijderen; geen dienst platleggen; geen social engineering, phishing of fysieke toegang; geen geautomatiseerd scannen dat het systeem belast; en het lek niet delen voordat het verholpen is. Kom je onbedoeld bij gegevens van anderen, stop dan en meld dat erbij.",
          "Wij betalen geen beloning. Wat wij wel doen is snel antwoorden en snel oplossen.",
        ],
      },
      {
        title: "Wat wij niet doen",
        paragraphs: [
          "Wij hebben geen ISO 27001- of SOC 2-certificering. SocialNow is een klein bedrijf; zo'n certificering zegt op dit moment meer over het budget voor auditors dan over de beveiliging zelf. Wat wij wel doen is hierboven te lezen, en in bijlage B van de verwerkersovereenkomst staat het als lijst waar je langs kunt lopen.",
          "Wij maken geen schermopnames van gebruikers. Dat kan technisch wel en wij hebben het bewust uitgezet.",
          "Wij hebben geen achterdeur in een klantsysteem. Toegang loopt altijd via het kortlevende briefje dat het klantsysteem zelf beoordeelt.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "Kwetsbaarheden: security@socialnow.nl. Privacy en gegevens: privacy@socialnow.nl. Alles daarbuiten: hello@socialnow.nl.",
        ],
      },
    ],
  },
  en: {
    title: "Security",
    intro:
      "How we protect your data, what we do when something goes wrong, and how to report a vulnerability. This document is meant to be read in advance: by you, by your IT person, or by someone who found something. The Dutch version is the binding one.",
    updated: "Last updated: 19 September 2026",
    sections: [
      {
        title: "The principles",
        paragraphs: [
          "Keep as little as possible. What is not there cannot leak. We do not ask for data we do not need and keep nothing longer than the purpose we hold it for.",
          "A workspace is a boundary. Every request is checked against workspace and role; there is no screen where another client's data could appear by accident.",
          "A key you give us is yours. Keys for Odoo, Meta, Google or your social channels are stored encrypted, never shown back, never written to a log line and never sent to an AI model.",
          "Administrator access is temporary and leaves a trail. There is no permanent administrator session in a client environment.",
        ],
      },
      {
        title: "Access",
        paragraphs: [
          "Signing in to an account runs through an identity provider with two-step verification. Administrator access at SocialNow runs through a passkey, with a time-based code as fallback on a new device.",
          "When an administrator opens a client environment, it happens with a token valid for two minutes that opens that one system only and that is judged by that system itself. The token never appears in a log; its issuance does, with who, which system and when.",
          "Rights are granted per workspace. When someone leaves, their access is withdrawn; in the OS you do that yourself under Team.",
        ],
      },
      {
        title: "Encryption",
        paragraphs: [
          "All traffic runs over TLS. Anyone arriving over http is redirected to https.",
          "Data is stored encrypted at our providers.",
          "Secrets live only in the hosting provider's environment. They are not in the source code and not in a configuration file that travels in version control.",
        ],
      },
      {
        title: "The software itself",
        paragraphs: [
          "All code is under version control. Every deployment traces back to a commit and can be rolled back.",
          "An automated test suite of more than two thousand tests runs before every deployment. A failing suite means no deployment.",
          "A strict Content Security Policy determines which scripts, styles and connections a page may use. A script of unknown origin does not run, even if it found its way in.",
          "Dependencies are checked for known vulnerabilities. A vulnerability of high severity or above blocks deployment until it is resolved.",
        ],
      },
      {
        title: "Monitoring",
        paragraphs: [
          "Consequential actions — granting access, opening a system, changing a key — are recorded in an audit trail.",
          "Errors and warnings are collected centrally. Personal data is not written into them.",
          "The reachability and login protection of every client system is checked automatically and continuously. If a system serves its home page without a login, that appears as an alarm on the administration screen.",
        ],
      },
      {
        title: "If something does go wrong",
        paragraphs: [
          "We notify the client concerned of a personal data breach within 24 hours of discovery, with what happened, what it likely affects, what we have done and where to reach us. That is shorter than the 72 hours the GDPR gives you, so you can make your own assessment with time to spare.",
          "We keep a register of breaches, including those that did not have to be notified.",
          "We do not notify the supervisory authority on your behalf unless you ask us in writing. You are the controller; that notification is your decision.",
        ],
      },
      {
        title: "Reporting a vulnerability",
        paragraphs: [
          "If you find something, report it to security@socialnow.nl. Describe what you found, where, and how it can be demonstrated. A screenshot or a short set of steps helps.",
          "What you may expect from us: a reply from a person within three working days, an assessment of severity within ten working days, and word when it is fixed. If you report responsibly and do not abuse what you found, we will not report you to the police and will not hold you liable. If you want to be credited in the fix, we are happy to.",
          "What we ask of you: do not view, copy, alter or delete other people's data; do not take a service down; no social engineering, phishing or physical access; no automated scanning that loads the system; and do not share the flaw before it is fixed. If you unintentionally reach other people's data, stop and say so in your report.",
          "We do not pay a bounty. What we do is answer fast and fix fast.",
        ],
      },
      {
        title: "What we do not do",
        paragraphs: [
          "We hold no ISO 27001 or SOC 2 certification. SocialNow is a small company; such a certification says more about the budget for auditors right now than about the security itself. What we do do is written above, and Annex B of the data processing agreement sets it out as a list you can walk through.",
          "We do not make session recordings of users. It is technically possible and we deliberately switched it off.",
          "We have no back door into a client system. Access always runs through the short-lived token that the client system judges itself.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "Vulnerabilities: security@socialnow.nl. Privacy and data: privacy@socialnow.nl. Everything else: hello@socialnow.nl.",
        ],
      },
    ],
  },
};

export const gebruik: Partial<Record<Language, LegalDoc>> & { nl: LegalDoc; en: LegalDoc } = {
  nl: {
    title: "Aanvaardbaar gebruik",
    intro:
      "Artikel 10 van de algemene voorwaarden zegt dat wij een dienst mogen opschorten bij misbruik. Dit document zegt wat misbruik is, zodat dat niet pas achteraf blijkt. Het geldt voor SocialNow OS, voor de websites die wij hosten en voor de e-mail die wij leveren.",
    updated: "Laatst bijgewerkt: 19 september 2026",
    sections: [
      {
        title: "Wat niet mag",
        paragraphs: [
          "Tegen de wet:",
          "Tegen anderen:",
          "Tegen het systeem:",
          "Tegen de platformen die je koppelt:",
        ],
        bullets: [
          [
            "inhoud die aanzet tot haat, geweld of discriminatie, of die strafbaar is",
            "inbreuk maken op het auteursrecht, merkrecht of portretrecht van een ander, ook wanneer een AI-model het beeld heeft gemaakt",
            "iemand nadoen: een bestaand merk, een bestaand persoon of een bestaande organisatie voorstellen als jezelf",
            "bijzondere persoonsgegevens verwerken zoals gezondheid, geloof, politieke voorkeur, vakbondslidmaatschap, seksuele gerichtheid of biometrie; daar is het OS niet voor gebouwd en daar rekenen wij niet op",
            "gegevens van kinderen onder de zestien verwerken zonder de toestemming die de wet daarvoor vraagt",
          ],
          [
            "ongevraagde bulkmail versturen, of mailen naar adressen die je niet zelf hebt verzameld met een grondslag",
            "een afmeldmogelijkheid weglaten of negeren",
            "misleiden: onjuiste prijzen, verzonnen reviews, claims die je niet kunt onderbouwen",
            "kopen van volgers, likes of reacties, of het simuleren van betrokkenheid",
          ],
          [
            "het OS of een gekoppelde dienst geautomatiseerd afgraven of belasten buiten normaal gebruik",
            "beveiliging omzeilen, of proberen bij een andere werkruimte te komen; vind je een gat, meld het op security@socialnow.nl",
            "je account of je werkruimte delen met of doorverkopen aan iemand buiten je organisatie",
            "malware, phishingpagina's of gestolen gegevens opslaan of verspreiden",
          ],
          [
            "de voorwaarden van Meta, Google, TikTok, LinkedIn of een ander gekoppeld platform overtreden; die voorwaarden gelden naast de onze",
            "een AI-label weglaten waar dat platform het verplicht stelt",
            "meer accounts koppelen dan waar je toestemming voor hebt van de eigenaar van die accounts",
          ],
        ],
      },
      {
        title: "Wat wij doen als het misgaat",
        paragraphs: [
          "Bij een vermoeden nemen wij eerst contact op en vragen wij je het recht te zetten, met een redelijke termijn. Wij gaan ervan uit dat de meeste gevallen een misverstand zijn.",
          "Bij iets ernstigs — strafbare inhoud, een actief lek, misbruik dat anderen raakt, een verzoek van een bevoegde autoriteit — schorten wij direct op en lichten wij je daarna in. Dat is de uitzondering, geen gewoonte.",
          "Houdt het aan, dan mogen wij de overeenkomst ontbinden volgens artikel 10 van de algemene voorwaarden. De betalingsverplichting over de geleverde periode blijft staan.",
          "Wij verwijderen geen inhoud van je zonder je dat te zeggen, tenzij de wet ons daartoe verplicht.",
        ],
      },
      {
        title: "Een melding doen over inhoud",
        paragraphs: [
          "Zie je op een website die wij hosten of in een uiting van een klant iets dat hier tegen ingaat, meld het op hello@socialnow.nl met de link en een korte beschrijving.",
          "Wij beoordelen elke melding, nemen contact op met de klant, en laten je weten wat wij ermee gedaan hebben. Ben je het niet eens met onze beoordeling, dan kun je daarop reageren; is het een kwestie van onrechtmatige inhoud, dan staat de weg naar de rechter altijd open.",
        ],
      },
    ],
  },
  en: {
    title: "Acceptable use",
    intro:
      "Clause 10 of the terms of service says we may suspend a service in case of misuse. This document says what misuse is, so it does not only become clear afterwards. It applies to SocialNow OS, to the websites we host and to the e-mail we provide. The Dutch version is the binding one.",
    updated: "Last updated: 19 September 2026",
    sections: [
      {
        title: "What is not allowed",
        paragraphs: [
          "Against the law:",
          "Against other people:",
          "Against the system:",
          "Against the platforms you connect:",
        ],
        bullets: [
          [
            "content that incites hatred, violence or discrimination, or that is a criminal offence",
            "infringing another party's copyright, trade mark or image rights, including where an AI model produced the image",
            "impersonation: presenting an existing brand, person or organisation as yourself",
            "processing special categories of personal data such as health, religion, political opinion, trade union membership, sexual orientation or biometrics; the OS is not built for it and we do not expect it",
            "processing data of children under sixteen without the consent the law requires for it",
          ],
          [
            "sending unsolicited bulk mail, or mailing addresses you did not collect yourself on a lawful basis",
            "omitting or ignoring an unsubscribe option",
            "misleading: incorrect prices, invented reviews, claims you cannot substantiate",
            "buying followers, likes or comments, or simulating engagement",
          ],
          [
            "scraping or loading the OS or a connected service beyond normal use",
            "circumventing security, or attempting to reach another workspace; if you find a gap, report it to security@socialnow.nl",
            "sharing or reselling your account or workspace to anyone outside your organisation",
            "storing or distributing malware, phishing pages or stolen data",
          ],
          [
            "breaching the terms of Meta, Google, TikTok, LinkedIn or any other connected platform; those terms apply alongside ours",
            "omitting an AI label where that platform requires one",
            "connecting more accounts than you have permission for from the owner of those accounts",
          ],
        ],
      },
      {
        title: "What we do when it goes wrong",
        paragraphs: [
          "On suspicion we contact you first and ask you to put it right, with a reasonable period. We assume most cases are a misunderstanding.",
          "For something serious — criminal content, an active leak, misuse affecting others, a request from a competent authority — we suspend immediately and inform you afterwards. That is the exception, not the habit.",
          "If it persists, we may terminate the agreement under clause 10 of the terms of service. Payment for the period delivered remains due.",
          "We do not remove content of yours without telling you, unless the law requires us to.",
        ],
      },
      {
        title: "Reporting content",
        paragraphs: [
          "If you see something on a website we host, or in a client's post, that goes against this, report it to hello@socialnow.nl with the link and a short description.",
          "We assess every report, contact the client, and tell you what we did with it. If you disagree with our assessment you can respond; where unlawful content is concerned, the route to the courts is always open.",
        ],
      },
    ],
  },
};
