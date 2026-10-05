// 5 oktober 2026: bovenaan het privacybeleid, in alle zes talen, kort en zonder juridische lap:
// waar je gegevens staan (Vercel Blob en Neon in Frankfurt), hoe lang wij ze bewaren en dat
// meten met PostHog alleen met toestemming gebeurt. Moet live staan voordat de app met
// DB_SCHADUW=1 naar Neon gaat schrijven (docs/SCHAAL-100/10-livegang.md in socialnow-app).
// De volledige tekst in artikel 5 en 8 zegt hetzelfde; wijzig je hier iets, wijzig het daar ook.
import type { Language, Section } from "./legal";

export const privacyKort: Record<Language, Section> = {
  nl: {
    title: "In het kort: waar je gegevens staan en hoe lang",
    paragraphs: [
      "Bestanden (foto's, renders, documenten) staan bij Vercel Blob. Gegevens over werkruimten, leden, opdrachten, verbruik en het auditlogboek staan in een database van Neon in Frankfurt (Duitsland). Beide partijen werken alleen in opdracht van SocialNow, onder een verwerkersovereenkomst, met opslag in de EU.",
      "Hoe lang wij bewaren:",
      "Meten: wat SocialNow zelf telt voor de bedrijfsvoering (verbruik, renders, inloggen) komt uit de eigen database en gaat niet naar derden. Gebruiksmeting met PostHog gebeurt alleen als je daar toestemming voor gaf.",
    ],
    table: {
      afterParagraph: 1,
      head: ["Gegeven", "Bewaartermijn"],
      rows: [
        ["Afgeronde opdrachten van de assistent", "30 dagen zichtbaar, daarna gearchiveerd"],
        ["Auditlogboek", "12 maanden"],
        ["Werkruimte, leden, merkprofiel, verbruik", "Zolang de werkruimte bestaat; na verwijderen gewist volgens artikel 8"],
        ["Facturen en betalingen", "7 jaar (fiscale bewaarplicht)"],
      ],
    },
  },
  en: {
    title: "In short: where your data is and for how long",
    paragraphs: [
      "Files (photos, renders, documents) are stored with Vercel Blob. Data about workspaces, members, assistant tasks, usage and the audit log is stored in a Neon database in Frankfurt (Germany). Both parties work only on behalf of SocialNow, under a data processing agreement, with storage in the EU.",
      "How long we keep it:",
      "Measurement: what SocialNow counts itself to run the business (usage, renders, sign-ins) comes from our own database and is not shared with third parties. Usage measurement with PostHog only happens if you gave consent.",
    ],
    table: {
      afterParagraph: 1,
      head: ["Data", "Retention"],
      rows: [
        ["Completed assistant tasks", "Visible for 30 days, then archived"],
        ["Audit log", "12 months"],
        ["Workspace, members, brand profile, usage", "As long as the workspace exists; after deletion erased as described in section 8"],
        ["Invoices and payments", "7 years (tax retention duty)"],
      ],
    },
  },
  de: {
    title: "Kurz gesagt: wo deine Daten liegen und wie lange",
    paragraphs: [
      "Dateien (Fotos, Renders, Dokumente) liegen bei Vercel Blob. Daten zu Arbeitsbereichen, Mitgliedern, Aufgaben des KI-Assistenten, Nutzung und dem Auditprotokoll liegen in einer Neon-Datenbank in Frankfurt (Deutschland). Beide Anbieter arbeiten nur im Auftrag von SocialNow, auf Grundlage eines Auftragsverarbeitungsvertrags und mit Speicherung in der EU.",
      "So lange speichern wir:",
      "Messung: Was SocialNow selbst für den Betrieb zählt (Nutzung, Renders, Anmeldungen), stammt aus unserer eigenen Datenbank und geht nicht an Dritte. Die Nutzungsmessung mit PostHog findet nur statt, wenn du eingewilligt hast.",
    ],
    table: {
      afterParagraph: 1,
      head: ["Daten", "Aufbewahrungsfrist"],
      rows: [
        ["Abgeschlossene Aufgaben des Assistenten", "30 Tage sichtbar, danach archiviert"],
        ["Auditprotokoll", "12 Monate"],
        ["Arbeitsbereich, Mitglieder, Markenprofil, Nutzung", "Solange der Arbeitsbereich besteht; nach dem Löschen entfernt gemäß Artikel 8"],
        ["Rechnungen und Zahlungen", "7 Jahre (steuerliche Aufbewahrungspflicht)"],
      ],
    },
  },
  fr: {
    title: "En bref : où se trouvent vos données et pour combien de temps",
    paragraphs: [
      "Les fichiers (photos, rendus, documents) sont stockés chez Vercel Blob. Les données sur les espaces de travail, les membres, les tâches de l'assistant IA, l'utilisation et le journal d'audit sont stockées dans une base de données Neon à Francfort (Allemagne). Ces deux prestataires travaillent uniquement pour le compte de SocialNow, dans le cadre d'un contrat de sous-traitance des données, avec un stockage dans l'UE.",
      "Combien de temps nous conservons les données :",
      "Mesure : ce que SocialNow compte lui-même pour piloter son activité (utilisation, rendus, connexions) provient de notre propre base de données et n'est pas transmis à des tiers. La mesure d'utilisation avec PostHog n'a lieu que si vous avez donné votre consentement.",
    ],
    table: {
      afterParagraph: 1,
      head: ["Donnée", "Durée de conservation"],
      rows: [
        ["Tâches terminées de l'assistant", "Visibles 30 jours, puis archivées"],
        ["Journal d'audit", "12 mois"],
        ["Espace de travail, membres, profil de marque, utilisation", "Tant que l'espace de travail existe ; après suppression, effacées conformément à l'article 8"],
        ["Factures et paiements", "7 ans (obligation légale de conservation fiscale)"],
      ],
    },
  },
  it: {
    title: "In breve: dove si trovano i tuoi dati e per quanto tempo",
    paragraphs: [
      "I file (foto, render, documenti) sono archiviati presso Vercel Blob. I dati su spazi di lavoro, membri, attività dell'assistente IA, utilizzo e registro di audit sono archiviati in un database Neon a Francoforte (Germania). Entrambi i fornitori lavorano solo per conto di SocialNow, con un accordo di trattamento dei dati e con archiviazione nell'UE.",
      "Per quanto tempo conserviamo i dati:",
      "Misurazione: ciò che SocialNow conta da sé per gestire l'attività (utilizzo, render, accessi) proviene dal nostro database e non viene condiviso con terzi. La misurazione dell'utilizzo con PostHog avviene solo se hai dato il consenso.",
    ],
    table: {
      afterParagraph: 1,
      head: ["Dato", "Periodo di conservazione"],
      rows: [
        ["Attività completate dell'assistente", "Visibili per 30 giorni, poi archiviate"],
        ["Registro di audit", "12 mesi"],
        ["Spazio di lavoro, membri, profilo del marchio, utilizzo", "Finché lo spazio di lavoro esiste; dopo l'eliminazione cancellati come descritto nell'articolo 8"],
        ["Fatture e pagamenti", "7 anni (obbligo fiscale di conservazione)"],
      ],
    },
  },
  es: {
    title: "En breve: dónde están tus datos y durante cuánto tiempo",
    paragraphs: [
      "Los archivos (fotos, renders, documentos) se almacenan en Vercel Blob. Los datos sobre espacios de trabajo, miembros, tareas del asistente de IA, uso y el registro de auditoría se almacenan en una base de datos de Neon en Fráncfort (Alemania). Ambos proveedores trabajan solo por encargo de SocialNow, con un contrato de encargado del tratamiento y con almacenamiento en la UE.",
      "Durante cuánto tiempo los conservamos:",
      "Medición: lo que SocialNow cuenta por sí misma para gestionar el negocio (uso, renders, inicios de sesión) sale de nuestra propia base de datos y no se comparte con terceros. La medición de uso con PostHog solo se realiza si has dado tu consentimiento.",
    ],
    table: {
      afterParagraph: 1,
      head: ["Dato", "Plazo de conservación"],
      rows: [
        ["Tareas completadas del asistente", "Visibles 30 días, después archivadas"],
        ["Registro de auditoría", "12 meses"],
        ["Espacio de trabajo, miembros, perfil de marca, uso", "Mientras exista el espacio de trabajo; tras eliminarlo, borrados según el artículo 8"],
        ["Facturas y pagos", "7 años (obligación fiscal de conservación)"],
      ],
    },
  },
};
