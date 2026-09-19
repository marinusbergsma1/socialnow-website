// De verwerkersovereenkomst — 19 september 2026.
//
// WAAROM DIT BESTAND ER IS
//
// SocialNow verwerkt persoonsgegevens namens zijn klanten: contacten en offertes uit Odoo,
// reacties en berichten uit Meta, bezoekcijfers uit Google, mensen in het CRM, teamleden in een
// werkruimte. Dat maakt SocialNow verwerker en de klant verwerkingsverantwoordelijke. Artikel 28
// lid 3 AVG zegt dan: er móet een overeenkomst zijn, schriftelijk, met een vaste lijst
// onderwerpen erin. Zonder die overeenkomst is de verwerking zelf onrechtmatig, ook als er
// technisch niets mis is. Die overeenkomst ontbrak.
//
// Dit document is die overeenkomst. Hij wordt onderdeel van de algemene voorwaarden zodra iemand
// een account aanmaakt, zodat er niet per klant een los papier getekend hoeft te worden — dat mag,
// mits de tekst vindbaar en ongewijzigd beschikbaar is, en dat is hij hier.
//
// DE ONDERWERPEN DIE ARTIKEL 28 LID 3 VERPLICHT STELT, EN WAAR ZE STAAN
//   onderwerp, duur, aard en doel                       artikel 1 en bijlage A
//   soort gegevens en categorieën betrokkenen           bijlage A
//   alleen op schriftelijke instructie                  artikel 2
//   geheimhouding van wie toegang heeft                 artikel 3
//   beveiliging (artikel 32)                            artikel 4 en bijlage B
//   subverwerkers                                       artikel 5 en bijlage C
//   bijstand bij rechten van betrokkenen                artikel 6
//   bijstand bij 32 tot en met 36 (datalek, DPIA)       artikel 7
//   wissen of teruggeven na afloop                      artikel 8
//   informatie en audit                                 artikel 9
//   doorgifte buiten de EER                             artikel 10
//
// De Nederlandse tekst is bindend. De Engelse staat eronder voor wie de Nederlandse niet leest.
import type { LegalDoc, Language } from "./legal";

export const dpa: Partial<Record<Language, LegalDoc>> & { nl: LegalDoc; en: LegalDoc } = {
  nl: {
    title: "Verwerkersovereenkomst",
    intro:
      "Deze verwerkersovereenkomst hoort bij de algemene voorwaarden en geldt zodra je SocialNow of SocialNow OS gebruikt voor gegevens over mensen. Hij legt vast wat wij met die gegevens mogen doen, wat wij juist niet doen, hoe wij ze beveiligen en wat er gebeurt als je stopt.",
    updated: "Laatst bijgewerkt: 19 september 2026",
    sections: [
      {
        title: "Partijen en werking",
        paragraphs: [
          "Verwerkingsverantwoordelijke: jij, de opdrachtgever, verder de klant. Jij bepaalt waarom en hoe de gegevens van jouw klanten, leads en medewerkers worden verwerkt.",
          "Verwerker: SocialNow, Amstelstraat 43G, 1017 DA Amsterdam, KVK 90877179, verder SocialNow. Wij verwerken die gegevens uitsluitend voor jou.",
          "Deze overeenkomst gaat in op het moment dat je een account aanmaakt in SocialNow OS of een opdracht geeft waarbij wij persoonsgegevens namens jou verwerken, en loopt zolang die verwerking duurt. Hij gaat vóór de algemene voorwaarden waar die elkaar tegenspreken op het punt van persoonsgegevens.",
          "Waar deze overeenkomst spreekt over de AVG bedoelen wij Verordening (EU) 2016/679, en waar zij spreekt over de toezichthouder bedoelen wij de Autoriteit Persoonsgegevens, of de toezichthouder van het land waar jij gevestigd bent.",
        ],
      },
      {
        title: "1. Onderwerp, aard, doel en duur",
        paragraphs: [
          "Het onderwerp van de verwerking is het leveren van SocialNow OS en de diensten daaromheen: een werkruimte waarin je je website, klanten, content en advertenties beheert, gekoppeld aan de bronnen die je zelf aansluit.",
          "De aard van de verwerking is het opslaan, ordenen, raadplegen, wijzigen, samenvoegen, tonen, versturen en wissen van gegevens, en het laten verwerken door de modellen en diensten in bijlage C, alles voor zover nodig om het OS voor jou te laten werken.",
          "Het doel is uitsluitend het uitvoeren van de overeenkomst met jou. Wij bepalen zelf geen doel voor jouw gegevens.",
          "De duur is gelijk aan de looptijd van jouw account of opdracht. Daarna geldt artikel 8.",
          "De soorten persoonsgegevens en de categorieën betrokkenen staan in bijlage A.",
        ],
      },
      {
        title: "2. Alleen op jouw instructie",
        paragraphs: [
          "Wij verwerken persoonsgegevens alleen op jouw gedocumenteerde instructie. Als instructie gelden: deze overeenkomst, de algemene voorwaarden, de handelingen die jij en je teamleden in het OS uitvoeren, en verzoeken die je ons per e-mail doet.",
          "Wij verwerken de gegevens niet voor eigen doeleinden, verkopen ze niet, delen ze niet met andere klanten, en gebruiken ze niet voor advertenties van derden of voor profilering buiten jouw werkruimte.",
          "Vinden wij dat een instructie in strijd is met de AVG of met andere wetgeving over gegevensbescherming, dan melden wij dat aan je voordat wij hem uitvoeren, en mogen wij de uitvoering opschorten tot je hem aanpast of bevestigt.",
          "Verplicht een wet van de Unie of van een lidstaat ons tot een verwerking buiten jouw instructie, dan informeren wij je daarover vóór de verwerking, tenzij die wet dat om redenen van algemeen belang verbiedt.",
          "Let op het onderscheid met artikel 17 van de algemene voorwaarden: daarin geef jij ons als klant toestemming om gegevens uit jouw werkruimte intern in te zien om het product te verbeteren. Die toestemming is een afspraak tussen jou en ons over jóuw gebruik. Voor persoonsgegevens van derden in jouw werkruimte geldt die toestemming alleen voor zover jij daar als verantwoordelijke zelf een grondslag voor hebt, en altijd binnen de grenzen van deze overeenkomst: intern, onder geheimhouding, zonder profilering en zonder verstrekking aan derden.",
        ],
      },
      {
        title: "3. Geheimhouding",
        paragraphs: [
          "Iedereen die bij ons toegang heeft tot jouw gegevens is tot geheimhouding verplicht, schriftelijk of op grond van de wet. Dat geldt voor medewerkers, voor ingeschakelde specialisten en voor de beheerders van onze systemen.",
          "Toegang wordt alleen gegeven aan wie hem voor zijn werk nodig heeft, en wordt ingetrokken zodra dat niet meer zo is. Beheerderstoegang tot een klantomgeving verloopt via een kortlevende, gelogde sessie; die toegang staat in een auditspoor dat wij bewaren.",
          "De geheimhouding blijft gelden na afloop van deze overeenkomst en na het einde van een dienstverband of opdracht.",
        ],
      },
      {
        title: "4. Beveiliging",
        paragraphs: [
          "Wij nemen passende technische en organisatorische maatregelen als bedoeld in artikel 32 AVG, rekening houdend met de stand van de techniek, de uitvoeringskosten en de aard, omvang, context en doeleinden van de verwerking, en met de risico's voor de betrokkenen.",
          "De maatregelen die wij op dit moment treffen staan beschreven in bijlage B. Die bijlage is een momentopname: wij mogen maatregelen vervangen door maatregelen die minstens zo beschermend zijn, en zullen het beschermingsniveau niet verlagen.",
          "Jij bent zelf verantwoordelijk voor de beveiliging aan jouw kant: sterke wachtwoorden of passkeys, tweestapsverificatie waar die beschikbaar is, het tijdig intrekken van toegang van vertrokken teamleden, en het zorgvuldig omgaan met de sleutels die je in het OS invoert.",
        ],
      },
      {
        title: "5. Subverwerkers",
        paragraphs: [
          "Je geeft ons algemene toestemming om subverwerkers in te schakelen. De subverwerkers die wij nu gebruiken staan in bijlage C, met per partij waarvoor wij hem gebruiken en waar de gegevens staan.",
          "Wij leggen elke subverwerker dezelfde verplichtingen op als wij tegenover jou hebben, in een schriftelijke overeenkomst. Komt een subverwerker die verplichtingen niet na, dan blijven wij tegenover jou volledig aansprakelijk.",
          "Willen wij een subverwerker toevoegen of vervangen, dan melden wij dat minstens dertig dagen van tevoren per e-mail en op socialnow.nl/verwerkersovereenkomst. Heb je binnen die termijn een redelijk bezwaar dat de bescherming van persoonsgegevens betreft, dan zoeken wij samen naar een oplossing; komen wij daar niet uit, dan mag je de betrokken dienst opzeggen zonder opzegkosten, tegen terugbetaling van het vooruitbetaalde deel.",
          "Partijen die jij zelf koppelt — je eigen Odoo, je eigen Meta-account, je eigen Google-property, je eigen socialkanalen — zijn geen subverwerkers van ons. Jij hebt met die partijen een eigen verhouding; wij lezen en schrijven daar alleen met de sleutel die jij ons geeft, en alleen binnen jouw werkruimte.",
        ],
      },
      {
        title: "6. Rechten van betrokkenen",
        paragraphs: [
          "Krijgt een betrokkene bij ons een verzoek binnen dat eigenlijk voor jou bedoeld is — inzage, rectificatie, wissing, beperking, overdraagbaarheid of bezwaar — dan voeren wij dat niet zelf uit. Wij sturen het door naar jou en laten de betrokkene weten dat wij dat hebben gedaan.",
          "Wij helpen je om zulke verzoeken te beantwoorden, met passende technische en organisatorische maatregelen en voor zover dat redelijkerwijs mogelijk is. In het OS kun je gegevens zelf inzien, aanpassen, exporteren en verwijderen; lukt dat niet, dan doen wij het op jouw verzoek.",
          "Wij brengen voor deze hulp geen kosten in rekening, tenzij het gaat om herhaalde of buitensporige verzoeken die substantieel werk vragen; in dat geval melden wij de kosten vooraf.",
        ],
      },
      {
        title: "7. Datalekken, DPIA en voorafgaande raadpleging",
        paragraphs: [
          "Ontdekken wij een inbreuk in verband met persoonsgegevens, dan melden wij dat zonder onredelijke vertraging en in elk geval binnen 24 uur na ontdekking bij jou, zodat jij binnen de 72 uur van artikel 33 AVG je eigen afweging kunt maken. Wij melden nooit zelf bij de toezichthouder namens jou, tenzij je ons daar schriftelijk om vraagt.",
          "Onze melding bevat, voor zover bekend: wat er is gebeurd en wanneer, welke categorieën en hoeveel betrokkenen en records het vermoedelijk betreft, de waarschijnlijke gevolgen, de maatregelen die wij hebben genomen of voorstellen, en een contactpunt. Wat op dat moment nog niet bekend is, leveren wij na zodra wij het weten.",
          "Wij houden een intern register bij van inbreuken, ook van die welke niet gemeld hoefden te worden, met de feiten, de gevolgen en de genomen maatregelen.",
          "Moet jij een gegevensbeschermingseffectbeoordeling (DPIA) uitvoeren of de toezichthouder vooraf raadplegen, dan leveren wij de informatie over onze verwerking die je daarvoor nodig hebt.",
        ],
      },
      {
        title: "8. Einde: teruggeven of wissen",
        paragraphs: [
          "Bij het einde van je account of opdracht kies jij wat er met de gegevens gebeurt: teruggeven in een gangbaar bestandsformaat, of wissen. Laat je binnen dertig dagen na het einde niets weten, dan wissen wij.",
          "Wissen betekent bij ons: uit de actieve systemen binnen dertig dagen, en uit de back-ups zodra die volgens hun eigen cyclus aflopen, uiterlijk na negentig dagen. Zolang een gegeven nog in een back-up staat, wordt het niet meer gebruikt en niet meer getoond.",
          "Wat een wet ons verplicht te bewaren, bewaren wij. Dat is in de praktijk de factuuradministratie, zeven jaar op grond van de Algemene wet inzake rijksbelastingen. Die gegevens worden alleen nog voor dat doel gebruikt.",
          "Op jouw verzoek bevestigen wij het wissen schriftelijk.",
        ],
      },
      {
        title: "9. Informatie en audit",
        paragraphs: [
          "Wij stellen je alle informatie ter beschikking die nodig is om aan te tonen dat de verplichtingen uit artikel 28 AVG worden nagekomen, en werken mee aan audits, waaronder inspecties, door jou of door een door jou gemachtigde controleur.",
          "In de praktijk beantwoorden wij vragenlijsten en leveren wij op verzoek een overzicht van onze maatregelen, ons subverwerkersregister en onze auditsporen. Wil je een audit ter plaatse of door een externe partij, dan kondig je die minstens dertig dagen van tevoren aan, vindt hij plaats tijdens kantooruren, verstoort hij onze dienstverlening niet, en is de controleur tot geheimhouding gehouden. Ten hoogste één audit per kalenderjaar is voor onze rekening; een volgende audit in hetzelfde jaar, of een audit die geen tekortkoming aantoont, komt voor jouw rekening tegen ons gebruikelijke uurtarief.",
          "Bij een audit tonen wij nooit gegevens van andere klanten. Waar het maar even kan werken wij met geanonimiseerde of geaggregeerde bewijsstukken.",
        ],
      },
      {
        title: "10. Doorgifte buiten de EER",
        paragraphs: [
          "Wij bewaren en verwerken jouw gegevens bij voorkeur binnen de Europese Economische Ruimte. Bij de meeste subverwerkers in bijlage C hebben wij expliciet voor een Europese regio gekozen.",
          "Is doorgifte naar een derde land onvermijdelijk — dat speelt bij een aantal Amerikaanse leveranciers van modellen en infrastructuur — dan doen wij dat alleen op basis van een geldig mechanisme uit hoofdstuk V AVG: een adequaatheidsbesluit van de Europese Commissie, of de standaardcontractbepalingen (uitvoeringsbesluit (EU) 2021/914), aangevuld met een beoordeling van de omstandigheden in dat land en met aanvullende maatregelen waar die nodig zijn, zoals versleuteling onderweg en in rust en het zo klein mogelijk houden van wat er heen gaat.",
          "Per subverwerker staat in bijlage C waar de gegevens staan en welk mechanisme geldt. Wijzigt dat, dan werken wij die bijlage bij volgens artikel 5.",
        ],
      },
      {
        title: "11. Aansprakelijkheid",
        paragraphs: [
          "De aansprakelijkheidsregeling uit de algemene voorwaarden geldt ook hier, met één uitzondering: die beperking geldt niet voor boetes en vorderingen die rechtstreeks voortvloeien uit opzet of bewuste roekeloosheid van onze kant, en niet waar de wet een beperking verbiedt.",
          "Artikel 82 AVG blijft onverkort gelden tussen ons en betrokkenen. Wie onderling wat draagt, bepalen wij naar rato van ieders aandeel in de schade.",
        ],
      },
      {
        title: "12. Slot",
        paragraphs: [
          "Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement van onze vestigingsplaats.",
          "Wijzigen wij deze overeenkomst, dan melden wij dat minstens dertig dagen van tevoren per e-mail en publiceren wij de nieuwe versie op socialnow.nl/verwerkersovereenkomst. Is de wijziging in jouw nadeel en ga je er niet mee akkoord, dan mag je binnen die dertig dagen opzeggen tegen terugbetaling van het vooruitbetaalde deel.",
          "Vragen over deze overeenkomst, een datalek of een verzoek van een betrokkene: privacy@socialnow.nl.",
        ],
      },
      {
        title: "Bijlage A: gegevens en betrokkenen",
        paragraphs: [
          "Categorieën betrokkenen waarvan wij namens jou gegevens verwerken:",
          "Soorten persoonsgegevens:",
          "Bijzondere categorieën persoonsgegevens als bedoeld in artikel 9 AVG en strafrechtelijke gegevens als bedoeld in artikel 10 horen niet in SocialNow OS. Zet je ze er toch in, dan doe je dat op eigen verantwoordelijkheid en buiten de bedoeling van deze overeenkomst; wij treffen voor zulke gegevens geen aanvullende maatregelen omdat wij er niet op rekenen dat ze er zijn.",
        ],
        bullets: [
          [
            "jouw teamleden en de gebruikers van jouw werkruimte",
            "jouw klanten, leads en relaties, zoals ze in jouw Odoo of in het CRM staan",
            "mensen die reageren op je berichten, advertenties of formulieren",
            "bezoekers van de websites die wij voor je bouwen of beheren, voor zover jij daar gegevens verzamelt",
          ],
          [
            "naam, functie, bedrijf, e-mailadres, telefoonnummer en adres",
            "correspondentie: berichten, reacties, e-mails en gespreksverslagen die jij in het OS zet of laat binnenkomen",
            "commerciële gegevens: offertes, orders, facturen, bedragen en statussen uit jouw Odoo",
            "accountgegevens: inlognaam, rol, taal, tijdstempels van gebruik",
            "technische gegevens: IP-adres, apparaat en browser, voor zover die bij een handeling worden vastgelegd",
            "beeld en tekst die jij aanlevert of laat maken en waarin mensen herkenbaar kunnen zijn",
          ],
          [],
        ],
      },
      {
        title: "Bijlage B: beveiligingsmaatregelen",
        paragraphs: [
          "Toegang en identiteit:",
          "Versleuteling en sleutels:",
          "Scheiding en afscherming:",
          "Logging en detectie:",
          "Continuïteit:",
          "Organisatie:",
          "Deze lijst beschrijft wat er op 19 september 2026 staat. Wij vervangen een maatregel alleen door een maatregel die minstens zo beschermend is.",
        ],
        bullets: [
          [
            "inloggen op je account gaat via een identiteitsdienst met tweestapsverificatie; beheerderstoegang van SocialNow gaat via een passkey en een tijdgebonden code",
            "toegang van een beheerder tot een klantomgeving verloopt via een briefje dat twee minuten geldig is en alleen dat ene systeem opent; het briefje zelf wordt nooit gelogd, de uitgifte wel",
            "rechten worden per werkruimte toegekend en bij vertrek ingetrokken",
          ],
          [
            "al het verkeer loopt over TLS; HTTP-verkeer wordt afgedwongen doorgestuurd naar HTTPS",
            "gegevens staan versleuteld op de opslag van onze leveranciers",
            "sleutels die jij invoert voor Odoo, Meta, Google of je socialkanalen worden versleuteld opgeslagen, nooit teruggetoond en nooit in logregels geschreven",
            "geheimen staan uitsluitend in de omgeving van de hostingleverancier, niet in de broncode",
          ],
          [
            "elke klant heeft een eigen werkruimte; verzoeken worden per verzoek gecontroleerd op werkruimte en rol",
            "voor klanten met een eigen systeem draait een eigen omgeving met eigen geheimen, gescheiden van de andere",
            "de beheeromgeving is niet publiek bereikbaar en staat op noindex",
            "een strikt Content Security Policy beperkt welke scripts, stijlen en verbindingen een pagina mag gebruiken",
          ],
          [
            "handelingen met gevolgen — toegang verlenen, een systeem openen, een sleutel wijzigen — komen in een auditspoor met wie, wat en wanneer",
            "foutmeldingen en waarschuwingen worden centraal verzameld; persoonsgegevens worden daarin niet meegeschreven",
            "de bereikbaarheid en de inlogbeveiliging van elk klantsysteem worden doorlopend automatisch gecontroleerd",
          ],
          [
            "gegevens staan bij leveranciers met dagelijkse back-ups en herstelmogelijkheid",
            "de code staat in versiebeheer; elke publicatie is herleidbaar tot een commit en kan worden teruggedraaid",
            "voor publicatie draait een geautomatiseerde testsuite; een rode suite betekent niet publiceren",
          ],
          [
            "wie toegang heeft is een korte, bekende kring, allemaal onder geheimhouding",
            "nieuwe leveranciers worden beoordeeld op waar zij gegevens opslaan en op welke voorwaarden",
            "er is een vaste route voor het melden van kwetsbaarheden: security@socialnow.nl",
          ],
          [],
        ],
      },
      {
        title: "Bijlage C: subverwerkers",
        paragraphs: [
          "Infrastructuur en opslag:",
          "Identiteit en communicatie:",
          "Meten:",
          "Modellen voor tekst en beeld, alleen voor wat jij laat maken:",
          "Publiceren op sociale kanalen:",
          "Wij hebben met elk van deze partijen een verwerkersovereenkomst of gelijkwaardige voorwaarden. Bij partijen buiten de EER berust de doorgifte op de standaardcontractbepalingen van de Europese Commissie, en waar van toepassing op het EU-VS Data Privacy Framework.",
          "Deze lijst geldt op 19 september 2026. Wijzigingen worden dertig dagen vooraf aangekondigd volgens artikel 5.",
        ],
        bullets: [
          [
            "Vercel Inc. (Verenigde Staten, uitvoering in de EU-regio): hosting van het OS en de websites",
            "Google Ireland Limited / Google LLC: Firebase voor de opslag van werkruimten en accounts",
            "Hostinger International Ltd (Litouwen): hosting van websites, domeinen en e-mail",
          ],
          [
            "Google Ireland Limited: inloggen met een Google-account",
            "Hostinger International Ltd: verzending van e-mail vanuit het OS, waaronder inlogcodes",
          ],
          [
            "PostHog Inc., EU-datacentrum in Frankfurt: meten van gebruik van het OS, alleen na toestemming van de gebruiker, zonder schermopnames",
          ],
          [
            "Google Ireland Limited / Google LLC: Gemini voor tekst en beeld",
            "OpenAI Ireland Ltd: modellen voor tekst en beeld",
            "Anthropic PBC (Verenigde Staten): modellen voor tekst",
            "Higgsfield: beeld en film",
            "Bij al deze partijen is contractueel uitgesloten dat jouw invoer wordt gebruikt om hun modellen te trainen.",
          ],
          [
            "Zernio: het koppelen aan en publiceren op jouw eigen socialkanalen, met de sleutel die jij zelf aansluit",
          ],
          [],
          [],
        ],
      },
    ],
  },
  en: {
    title: "Data Processing Agreement",
    intro:
      "This data processing agreement forms part of the terms of service and applies as soon as you use SocialNow or SocialNow OS for data about people. It sets out what we may do with that data, what we will never do, how we secure it and what happens when you stop. The Dutch version is the binding one.",
    updated: "Last updated: 19 September 2026",
    sections: [
      {
        title: "Parties and effect",
        paragraphs: [
          "Controller: you, the client. You decide why and how the data of your customers, leads and staff is processed.",
          "Processor: SocialNow, Amstelstraat 43G, 1017 DA Amsterdam, the Netherlands, Chamber of Commerce 90877179. We process that data solely for you.",
          "This agreement takes effect when you create an account in SocialNow OS or give us an assignment in which we process personal data on your behalf, and lasts as long as that processing lasts. Where it conflicts with the terms of service on the subject of personal data, this agreement prevails.",
          "Where this agreement refers to the GDPR we mean Regulation (EU) 2016/679, and where it refers to the supervisory authority we mean the Dutch Data Protection Authority, or the authority of the country where you are established.",
        ],
      },
      {
        title: "1. Subject matter, nature, purpose and duration",
        paragraphs: [
          "The subject matter is the provision of SocialNow OS and the services around it: a workspace in which you manage your website, customers, content and advertising, connected to the sources you attach yourself.",
          "The nature of the processing is storing, organising, consulting, altering, combining, displaying, transmitting and erasing data, and having it processed by the models and services in Annex C, all to the extent needed to run the OS for you.",
          "The purpose is solely the performance of the agreement with you. We do not determine any purpose of our own for your data.",
          "The duration equals the term of your account or assignment. After that, clause 8 applies.",
          "The types of personal data and categories of data subjects are set out in Annex A.",
        ],
      },
      {
        title: "2. Only on your instruction",
        paragraphs: [
          "We process personal data only on your documented instruction. The following count as instructions: this agreement, the terms of service, the actions you and your team perform in the OS, and requests you send us by e-mail.",
          "We do not process the data for our own purposes, do not sell it, do not share it with other clients, and do not use it for third-party advertising or for profiling outside your workspace.",
          "If we consider an instruction to infringe the GDPR or other data protection law, we tell you before carrying it out, and we may suspend performance until you amend or confirm it.",
          "If Union or Member State law requires us to process beyond your instruction, we inform you before processing, unless that law prohibits it on important grounds of public interest.",
          "Note the distinction with clause 17 of the terms of service: there you, as our client, allow us to view data in your workspace internally in order to improve the product. That permission is an arrangement between you and us about your own use. For personal data of third parties in your workspace it applies only to the extent that you, as controller, have a lawful basis for it, and always within the limits of this agreement: internal, under confidentiality, without profiling and without disclosure to third parties.",
        ],
      },
      {
        title: "3. Confidentiality",
        paragraphs: [
          "Everyone at our end with access to your data is bound to confidentiality, in writing or by law. This covers staff, engaged specialists and the administrators of our systems.",
          "Access is granted only to those who need it for their work, and withdrawn as soon as that is no longer the case. Administrator access to a client environment runs through a short-lived, logged session; that access is recorded in an audit trail we retain.",
          "Confidentiality survives the end of this agreement and the end of any employment or engagement.",
        ],
      },
      {
        title: "4. Security",
        paragraphs: [
          "We take appropriate technical and organisational measures within the meaning of Article 32 GDPR, taking into account the state of the art, the cost of implementation, and the nature, scope, context and purposes of the processing, as well as the risks to data subjects.",
          "The measures currently in place are described in Annex B. That annex is a snapshot: we may replace a measure with one that is at least as protective, and will not lower the level of protection.",
          "You are responsible for security on your side: strong passwords or passkeys, two-step verification where available, timely withdrawal of access for departed team members, and careful handling of the keys you enter in the OS.",
        ],
      },
      {
        title: "5. Sub-processors",
        paragraphs: [
          "You give us general authorisation to engage sub-processors. The sub-processors we currently use are listed in Annex C, with what we use each of them for and where the data sits.",
          "We impose on each sub-processor the same obligations we owe you, by written contract. If a sub-processor fails to meet them, we remain fully liable to you.",
          "If we wish to add or replace a sub-processor we announce it at least thirty days in advance by e-mail and on socialnow.nl/verwerkersovereenkomst. If within that period you raise a reasonable objection concerning the protection of personal data, we look for a solution together; if we cannot find one, you may terminate the service concerned without termination costs, against refund of the prepaid portion.",
          "Parties you connect yourself — your own Odoo, your own Meta account, your own Google property, your own social channels — are not our sub-processors. You have your own relationship with them; we only read and write there with the key you give us, and only within your workspace.",
        ],
      },
      {
        title: "6. Data subject rights",
        paragraphs: [
          "If a data subject sends us a request that is really meant for you — access, rectification, erasure, restriction, portability or objection — we do not act on it ourselves. We forward it to you and tell the data subject we have done so.",
          "We assist you in answering such requests, by appropriate technical and organisational measures and insofar as reasonably possible. In the OS you can view, amend, export and delete data yourself; where that is not possible, we do it at your request.",
          "We do not charge for this assistance, unless requests are repetitive or excessive and require substantial work; in that case we tell you the cost in advance.",
        ],
      },
      {
        title: "7. Data breaches, DPIA and prior consultation",
        paragraphs: [
          "If we discover a personal data breach, we notify you without undue delay and in any case within 24 hours of discovery, so that you can make your own assessment within the 72 hours of Article 33 GDPR. We never notify the supervisory authority on your behalf unless you ask us in writing.",
          "Our notification contains, as far as known: what happened and when, which categories and approximately how many data subjects and records are likely affected, the likely consequences, the measures we have taken or propose, and a contact point. Anything not yet known at that moment follows as soon as we know it.",
          "We keep an internal register of breaches, including those that did not have to be notified, recording the facts, the effects and the remedial action taken.",
          "If you have to carry out a data protection impact assessment or consult the supervisory authority in advance, we provide the information about our processing that you need for it.",
        ],
      },
      {
        title: "8. On termination: return or erasure",
        paragraphs: [
          "When your account or assignment ends, you choose what happens to the data: return in a common file format, or erasure. If you tell us nothing within thirty days of the end, we erase.",
          "Erasure means: out of the active systems within thirty days, and out of backups as those expire on their own cycle, at the latest after ninety days. While a record is still in a backup it is no longer used and no longer shown.",
          "What the law requires us to keep, we keep. In practice that is the invoice administration, seven years under Dutch tax law. That data is then used for that purpose only.",
          "On request we confirm erasure in writing.",
        ],
      },
      {
        title: "9. Information and audit",
        paragraphs: [
          "We make available all information necessary to demonstrate compliance with Article 28 GDPR, and allow for and contribute to audits, including inspections, by you or an auditor mandated by you.",
          "In practice we answer questionnaires and provide, on request, an overview of our measures, our sub-processor register and our audit trails. For an on-site audit or one by an external party, you announce it at least thirty days in advance, it takes place during office hours, it does not disrupt our service, and the auditor is bound to confidentiality. At most one audit per calendar year is at our expense; a further audit in the same year, or one that finds no shortcoming, is at your expense at our usual hourly rate.",
          "During an audit we never show other clients' data. Wherever possible we work with anonymised or aggregated evidence.",
        ],
      },
      {
        title: "10. Transfers outside the EEA",
        paragraphs: [
          "We prefer to store and process your data within the European Economic Area. For most sub-processors in Annex C we have explicitly chosen a European region.",
          "Where a transfer to a third country is unavoidable — which is the case for a number of US providers of models and infrastructure — we do so only on the basis of a valid mechanism under Chapter V GDPR: an adequacy decision of the European Commission, or the standard contractual clauses (Implementing Decision (EU) 2021/914), supplemented by an assessment of the circumstances in that country and by additional measures where needed, such as encryption in transit and at rest and keeping what is sent as small as possible.",
          "Annex C states, per sub-processor, where the data sits and which mechanism applies. If that changes, we update the annex in line with clause 5.",
        ],
      },
      {
        title: "11. Liability",
        paragraphs: [
          "The liability regime of the terms of service applies here too, with one exception: that limitation does not apply to fines and claims arising directly from our intent or wilful recklessness, and not where the law prohibits a limitation.",
          "Article 82 GDPR continues to apply in full between us and data subjects. How we bear liability between ourselves is determined in proportion to each party's share in the damage.",
        ],
      },
      {
        title: "12. Final provisions",
        paragraphs: [
          "Dutch law applies to this agreement. Disputes are submitted to the competent court in the district of our place of business.",
          "If we amend this agreement we announce it at least thirty days in advance by e-mail and publish the new version on socialnow.nl/verwerkersovereenkomst. If the change is to your detriment and you do not accept it, you may terminate within those thirty days against refund of the prepaid portion.",
          "Questions about this agreement, a data breach or a data subject request: privacy@socialnow.nl.",
        ],
      },
      {
        title: "Annex A: data and data subjects",
        paragraphs: [
          "Categories of data subjects whose data we process on your behalf:",
          "Types of personal data:",
          "Special categories of personal data within the meaning of Article 9 GDPR and criminal conviction data within the meaning of Article 10 do not belong in SocialNow OS. If you put them in anyway, you do so at your own responsibility and outside the intent of this agreement; we take no additional measures for such data because we do not expect it to be there.",
        ],
        bullets: [
          [
            "your team members and the users of your workspace",
            "your customers, leads and contacts, as held in your Odoo or in the CRM",
            "people who respond to your posts, ads or forms",
            "visitors to the websites we build or manage for you, insofar as you collect data there",
          ],
          [
            "name, role, company, e-mail address, telephone number and address",
            "correspondence: messages, replies, e-mails and call notes you put into the OS or receive there",
            "commercial data: quotes, orders, invoices, amounts and statuses from your Odoo",
            "account data: login name, role, language, timestamps of use",
            "technical data: IP address, device and browser, insofar as recorded with an action",
            "images and text you supply or have created in which people may be recognisable",
          ],
          [],
        ],
      },
      {
        title: "Annex B: security measures",
        paragraphs: [
          "Access and identity:",
          "Encryption and keys:",
          "Separation and shielding:",
          "Logging and detection:",
          "Continuity:",
          "Organisation:",
          "This list describes what is in place on 19 September 2026. We replace a measure only with one that is at least as protective.",
        ],
        bullets: [
          [
            "signing in to your account runs through an identity provider with two-step verification; SocialNow administrator access runs through a passkey and a time-based code",
            "administrator access to a client environment runs through a token valid for two minutes that opens that one system only; the token itself is never logged, its issuance is",
            "rights are granted per workspace and withdrawn on departure",
          ],
          [
            "all traffic runs over TLS; HTTP traffic is redirected to HTTPS",
            "data is stored encrypted at our providers",
            "keys you enter for Odoo, Meta, Google or your social channels are stored encrypted, never shown back and never written to log lines",
            "secrets live only in the hosting provider's environment, not in source code",
          ],
          [
            "every client has its own workspace; each request is checked against workspace and role",
            "clients with their own system run in their own environment with their own secrets, separate from the others",
            "the administration environment is not publicly reachable and is set to noindex",
            "a strict Content Security Policy limits which scripts, styles and connections a page may use",
          ],
          [
            "consequential actions — granting access, opening a system, changing a key — are recorded in an audit trail with who, what and when",
            "errors and warnings are collected centrally; personal data is not written into them",
            "the reachability and login protection of every client system is checked automatically and continuously",
          ],
          [
            "data sits with providers with daily backups and restore capability",
            "code is under version control; every deployment traces back to a commit and can be rolled back",
            "an automated test suite runs before deployment; a failing suite means no deployment",
          ],
          [
            "the group with access is small and known, all under confidentiality",
            "new providers are assessed on where they store data and on what terms",
            "there is a fixed route for reporting vulnerabilities: security@socialnow.nl",
          ],
          [],
        ],
      },
      {
        title: "Annex C: sub-processors",
        paragraphs: [
          "Infrastructure and storage:",
          "Identity and communication:",
          "Measurement:",
          "Models for text and image, only for what you have created:",
          "Publishing to social channels:",
          "We have a data processing agreement or equivalent terms with each of these parties. For parties outside the EEA, transfers rest on the European Commission's standard contractual clauses and, where applicable, the EU-US Data Privacy Framework.",
          "This list is valid on 19 September 2026. Changes are announced thirty days in advance in line with clause 5.",
        ],
        bullets: [
          [
            "Vercel Inc. (United States, execution in the EU region): hosting of the OS and the websites",
            "Google Ireland Limited / Google LLC: Firebase for storage of workspaces and accounts",
            "Hostinger International Ltd (Lithuania): hosting of websites, domains and e-mail",
          ],
          [
            "Google Ireland Limited: signing in with a Google account",
            "Hostinger International Ltd: sending e-mail from the OS, including sign-in codes",
          ],
          [
            "PostHog Inc., EU data centre in Frankfurt: measuring use of the OS, only after the user's consent, without session recordings",
          ],
          [
            "Google Ireland Limited / Google LLC: Gemini for text and image",
            "OpenAI Ireland Ltd: models for text and image",
            "Anthropic PBC (United States): models for text",
            "Higgsfield: image and film",
            "With all of these parties it is contractually excluded that your input is used to train their models.",
          ],
          [
            "Zernio: connecting to and publishing on your own social channels, with the key you attach yourself",
          ],
          [],
          [],
        ],
      },
    ],
  },
};
