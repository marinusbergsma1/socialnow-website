// Het enige configbestand van de boekingspagina. Pas hier werktijden, buffer en soorten calls aan;
// de server rekent alles vanaf deze waarden, de pagina krijgt ze via /api/slots.
export default {
  // Werktijden gelden in deze tijdzone. De bezoeker ziet alles in zijn eigen tijdzone.
  tijdzone: "Europe/Amsterdam",

  // Per weekdag de blokken waarin een call mag vallen (begin en eind, 24 uursklok).
  werktijden: {
    ma: [["10:00", "18:00"]],
    di: [["10:00", "18:00"]],
    wo: [["10:00", "18:00"]],
    do: [["10:00", "18:00"]],
    vr: [["10:00", "18:00"]],
    za: [],
    zo: [],
  },

  // Minuten vrij voor en na elke afspraak in de agenda, ook rond afspraken die er al staan.
  bufferMinuten: 15,

  // Zo veel uur van tevoren moet een call minimaal geboekt worden.
  minimaleVooruitboektijdUren: 4,

  // Zo veel dagen vooruit (vandaag telt als dag 0) kan iemand kiezen.
  maximaleDagenVooruit: 21,

  // Om de hoeveel minuten een begintijd wordt aangeboden.
  stapMinuten: 30,

  // Dagen zonder calls (in de tijdzone hierboven).
  vrijeDagen: [
    "2026-12-24", "2026-12-25", "2026-12-26", "2026-12-31",
    "2027-01-01", "2027-03-29", "2027-04-27", "2027-05-05",
    "2027-05-06", "2027-05-17",
  ],

  // De soorten calls. De sleutel is wat andere pagina's meegeven als ?type=...
  standaardSoort: "intro",
  soorten: {
    security: {
      minuten: 20,
      titel: { en: "Free security call", nl: "Gratis veiligheidscall" },
      uitleg: {
        en: "We go through your check result together and tell you what to fix first.",
        nl: "We lopen samen je checkuitslag door en zeggen wat je eerst moet oplossen.",
      },
      vraag: { en: "Which website should we look at?", nl: "Welke website moeten we bekijken?" },
    },
    "uitgebreide-check": {
      minuten: 30,
      titel: { en: "Extended website check", nl: "Uitgebreide websitecheck" },
      uitleg: {
        en: "We go through your website in depth together: security, speed and what to fix first.",
        nl: "We lopen samen je website grondig door: veiligheid, snelheid en wat je eerst moet oplossen.",
      },
      // Alleen naam, e-mail en het domein (komt ingevuld mee uit de link van socialnow.nl/check).
      velden: ["naam", "email", "domein"],
    },
    intro: {
      minuten: 30,
      titel: { en: "Intro call", nl: "Kennismakingscall" },
      uitleg: {
        en: "Get to know SocialNow and see what the OS can do for your business.",
        nl: "Maak kennis met SocialNow en zie wat het OS voor jouw bedrijf kan doen.",
      },
      vraag: { en: "What would you like to talk about?", nl: "Waar wil je het over hebben?" },
    },
  },

  // Titel van de afspraak in beide agenda's.
  organisatie: "SocialNow",
};
