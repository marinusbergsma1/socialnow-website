"""Publiek handboek; beleidsbronnen zijn een gedateerde snapshot van de website.
Opnieuw maken: python maak-handboek.py --font-root /pad/naar/Fonts
Vereist reportlab, Pillow en pypdf. Geen ondertekende NDA of vertrouwelijke klantinhoud.
"""
from pathlib import Path
import argparse, json, html
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image

ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
args=argparse.ArgumentParser();args.add_argument('--font-root',default='/Users/marinusbergsma/Library/Fonts');config=args.parse_args()
for name,file in [('SN','Gilroy-Regular.ttf'),('SN-Bold','Gilroy-Bold.ttf')]:pdfmetrics.registerFont(TTFont(name,str(Path(config.font_root)/file)))
pdfmetrics.registerFontFamily('SN',normal='SN',bold='SN-Bold',italic='SN',boldItalic='SN-Bold')
GREEN=colors.HexColor('#128c40');INK=colors.HexColor('#101820');MUTED=colors.HexColor('#59636d');LINE=colors.HexColor('#d8dfe2')
styles={
 'body':ParagraphStyle('body',fontName='SN',fontSize=10.2,leading=15.1,textColor=INK,spaceAfter=10),
 'small':ParagraphStyle('small',fontName='SN',fontSize=8.4,leading=12,textColor=MUTED,spaceAfter=8),
 'title':ParagraphStyle('title',fontName='SN-Bold',fontSize=28,leading=31,textColor=INK,spaceAfter=14),
 'h1':ParagraphStyle('h1',fontName='SN-Bold',fontSize=22,leading=25,textColor=INK,spaceAfter=14),
 'h2':ParagraphStyle('h2',fontName='SN-Bold',fontSize=12.5,leading=17,textColor=GREEN,spaceBefore=12,spaceAfter=8,keepWithNext=True),
 'tag':ParagraphStyle('tag',fontName='SN-Bold',fontSize=8,leading=12,textColor=GREEN,spaceAfter=14),
 'bullet':ParagraphStyle('bullet',fontName='SN',fontSize=10.2,leading=15.1,textColor=INK,leftIndent=13,firstLineIndent=-11,spaceAfter=7),
}
source=json.loads((HERE/'beleidsbronnen.json').read_text())
S={d['slug']:d for d in source}
story=[]
def p(text,style='body'):return Paragraph(text,styles[style])
def add(text):story.append(p(html.escape(text)))
def bullets(items):
 for text in items:story.append(p('• '+html.escape(text),'bullet'))
def title(n,heading):
 story.append(PageBreak());story.append(p(f'{n:02d} · VEILIGHEID &amp; DATA','tag'));story.append(p(f'<a name="chapter{n}"/>'+heading,'h1'))
def sub(head,text):story.append(p(head,'h2'));add(text)
def link(label,url):return f'<a href="{html.escape(url)}" color="#128c40"><u>{html.escape(label)}</u></a>'
def ref(slug):story.append(p('Bron: '+link(S[slug]['title'],'https://socialnow.nl/nl/'+slug)+' · '+html.escape(S[slug]['updated']),'small'))

story += [Spacer(1,32),p('PUBLIEKE DOCUMENTATIE · VERSIE 1.0 · 13 OKTOBER 2026','tag'),p('Jouw data.<br/>Jouw regie.<br/>Onze verantwoordelijkheid.','title'),p('Eigendom, privacy en beveiliging bij SocialNow en SocialNow OS.','h2')]
add('Een uitgebreid handboek voor ondernemers, teamleden, ICT-beheerders en inkopers. Lees hoe gegevens worden gebruikt, hoe toegang en koppelingen zijn ingericht, wat je zelf beheert en welke afspraken gelden als je wilt stoppen.')
summary=Table([[p('100% jouw data.','h2'),p('Veiligheid, zwart op wit.','h2')],[p('Jouw bedrijfsgegevens blijven van jou. De rechten op software en ontwerpen staan afzonderlijk in de overeenkomst.'),p('Concrete maatregelen, heldere grenzen en afspraken voor het geval er iets misgaat.')]],colWidths=[230,230])
summary.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#f0f6f2')),('BOX',(0,0),(-1,-1),.6,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]));story.append(Spacer(1,20));story.append(summary)
story.append(Spacer(1,24));add('Dit handboek verduidelijkt het gepubliceerde beleid. Het is geen certificaat, auditrapport, verwerkersovereenkomst of nieuwe garantie. De overeenkomst en de actuele juridische documenten blijven leidend. Een beveiligingsmaatregel verkleint risico’s; absolute veiligheid bestaat niet.')


chapters=[('Leeswijzer en kernbeloften'),('Wat “jouw eigendom” betekent'),('Toegang en de grens van je werkruimte'),('Versleuteling en API-sleutels'),('Goedkeuring, koppelingen en AI'),('Leveranciers, locaties en gegevensstromen'),('Logging, ontwikkeling en continuïteit'),('Incidenten en kwetsbaarheden'),('Privacyrechten en veilig afscheid nemen'),('Jouw checklist voor veilig gebruik'),('Vragen voor ICT en inkoop'),('Veelgestelde vragen en contact')]
title(0,'Inhoud en leesroute')
for i,h in enumerate(chapters,1):story.append(p(f'<a href="#chapter{i}" color="#128c40">{i:02d}  {html.escape(h)}</a> · pagina {i+2}','body'))
sub('Bijlagen','A: gepubliceerde beveiligingsmaatregelen. B: relevante bepalingen over eigendom en gebruik. C: verwerking, beveiliging, incidenten en beëindiging. D: bronnen, versies en onderhoud.')
add('Ondernemer: begin bij hoofdstukken 1, 2, 9 en 10. ICT-beheerder: lees vooral 3 tot en met 8 en 11. Inkoper of privacyverantwoordelijke: combineer dit handboek met de verwerkersovereenkomst en de leverancierslijst. De bijlagen zijn gedateerde uittreksels; controleer de actuele online versie voordat je contractuele afspraken beoordeelt.')

title(1,chapters[0])
sub('Jij bepaalt het doel','Voor gegevens van jouw klanten, leads en medewerkers bepaal jij als organisatie het doel van de verwerking. SocialNow verwerkt die gegevens voor de afgesproken dienstverlening. Accountbeheer, facturering en eigen bedrijfsadministratie hebben een andere rolverdeling; die staat in het privacybeleid. Het gaat om de feitelijke verwerking, niet alleen om een etiket in een overeenkomst.')
sub('Jouw data blijft van jou','De eigendomsbelofte gaat over jouw bedrijfsgegevens en aangeleverde inhoud. Wij verkopen die gegevens niet, delen ze niet met andere klanten en gebruiken ze niet voor advertenties van derden. Je kunt gegevens laten teruggeven of wissen binnen de afspraken uit de verwerkersovereenkomst. Rechten van personen die in de gegevens voorkomen blijven daarnaast bestaan.')
sub('Beveiliging met concrete afspraken','Onze gepubliceerde maatregelen beschrijven versleuteling, controle op werkruimte en rol, beperkte beheerderstoegang en het veilig gebruiken van koppelsleutels. De sleutelbelofte beschrijft ook jouw goedkeuring voor wijzigingen en het uitsluiten van sleutels uit logs en AI-verzoeken. Deze maatregelen zijn bedoeld om ongewenste toegang en ongewenste acties te voorkomen.')
sub('Duidelijke grenzen','Dit document beweert niet dat elke gebruikte leverancier Europees is, dat iedere login tweestapsverificatie afdwingt of dat SocialNow ISO 27001- of SOC 2-gecertificeerd is. Het zegt ook niet dat een kopie van een gegeven direct uit iedere back-up verdwijnt. De hoofdstukken hieronder maken die verschillen expliciet, zodat je een zakelijke afweging kunt maken.')
ref('voorwaarden');ref('verwerkersovereenkomst')

title(2,chapters[1])
sub('Data, accounts en materiaal','Jouw klantgegevens, bedrijfsinformatie en bestanden worden niet het eigendom van SocialNow doordat je ze in het OS zet. Je moet wel zelf het recht hebben om materiaal aan te leveren en gegevens te laten verwerken. Denk aan toestemming of een andere geldige grondslag voor persoonsgegevens, en aan gebruiksrechten voor foto’s, muziek en teksten.')
sub('Software en ontwerpen zijn een ander onderwerp','De algemene voorwaarden behouden intellectuele eigendomsrechten van SocialNow en beschrijven hoe je geleverde ontwerpen, software en resultaten mag gebruiken. “100% jouw data” betekent daarom niet dat je automatisch de broncode van het SocialNow-platform, alle auteursrechten op een ontwerp of het intellectuele eigendom van een leverancier krijgt. Een afwijkende overdracht moet afzonderlijk en schriftelijk worden afgesproken.')
sub('Jouw regie over koppelingen','Gebruik accounts en sleutels die bij jouw organisatie horen. Een API-sleutel geeft toestemming voor bepaalde handelingen; hij draagt geen eigendom over. Bij het intrekken van de sleutel bij de bron stopt de betreffende koppeling. De bronleverancier bepaalt mede welke exportmogelijkheden, gebruiksrechten en bewaartermijnen gelden in zijn eigen dienst.')
sub('Teruggeven en wissen','Als je stopt, kun je kiezen voor teruggeven in een gangbaar formaat of wissen. Dat recht is iets anders dan een automatische volledige migratie naar een willekeurige andere applicatie. Spreek het gewenste exportformaat, de onderdelen, de verantwoordelijke persoon en eventuele migratiewerkzaamheden af voordat het account sluit.')
ref('voorwaarden');ref('verwerkersovereenkomst')

title(3,chapters[2])
sub('Werkruimte en rol','Een werkruimte is de grens voor klantgegevens. Het gepubliceerde beveiligingsbeleid beschrijft controle per verzoek op werkruimte en rol. Rechten horen bij de taken van een persoon. Geef een medewerker alleen toegang tot de onderdelen die nodig zijn, en controleer na een functiewijziging of die rechten nog passend zijn.')
sub('Inloggen','Accountlogin gebruikt Google Firebase. Of een tweede factor wordt afgedwongen hangt af van de inlogroute en het accountbeleid. Het centrale beheerportaal ondersteunt passkeys en een tijdcode; daarmee is niet aangetoond dat iedere rechtstreekse app-login een tweede factor vraagt. Maak voor jouw organisatie expliciet welke routes worden gebruikt en welke extra beveiliging beschikbaar is.')
sub('Beheerderstoegang','Volgens het beleid werkt beheerderstoegang met een kortlevend, systeemgebonden toegangsbewijs. Het beschreven bewijs is twee minuten geldig en wordt door het klantsysteem beoordeeld. De uitgifte laat een auditspoor achter met wie, welk systeem en wanneer. Het toegangsbewijs zelf hoort niet in logs. Noodzakelijke ondersteuning en beveiliging geven bevoegde medewerkers beperkte, gelogde toegang.')
bullets(['Gebruik persoonlijke accounts in plaats van een gedeeld teamwachtwoord.','Trek toegang van vertrokken medewerkers tijdig in.','Controleer rollen en actieve koppelingen bij het toevoegen van een nieuwe partner.','Vraag bij twijfel welke toegang SocialNow voor een supportvraag nodig heeft.'])
ref('beveiliging');ref('voorwaarden')

title(4,chapters[3])
sub('Onderweg en in opslag','Het beveiligingsbeleid beschrijft TLS voor netwerkverkeer en versleuteling op de opslag van leveranciers. De sleutelbelofte noemt AES-256-GCM en een eigen sleutel per werkruimte voor koppelsleutels. Dit zijn verschillende lagen: versleuteling van verkeer beschermt de verbinding; versleuteling in opslag beschermt opgeslagen gegevens; controle op identiteit en rechten bepaalt wie een functie mag uitvoeren.')
sub('Een sleutel is een bevoegdheid','Gebruik een aparte API-gebruiker of sleutel voor het OS, met alleen de noodzakelijke rechten. Gebruik geen persoonlijk hoofdaccount als dat niet nodig is. Een gekoppelde bron kan eigen grenzen en abonnementseisen hebben. Controleer de rechten aan de kant van Odoo, Meta, Google, LinkedIn of de betreffende leverancier voordat je de sleutel invoert.')
sub('Geen sleutels in de browser, logs of AI','De sleutelbelofte zegt dat de sleutel niet terug naar de browser gaat, niet zichtbaar is in app of beheerscherm, uit logbestanden wordt gefilterd en niet in een vraag aan een AI-model wordt meegestuurd. Een gemaskeerde sleutel of een statusmelding is geen reden om een geheime waarde in een chat of screenshot te delen.')
sub('Intrekken en vervangen','Trek een sleutel in bij de bron als een gebruiker vertrekt, een bevoegdheid niet meer nodig is of je vermoedt dat een sleutel is uitgelekt. Alleen de socials-sleutel heeft volgens de sleutelbelofte een verwijdermogelijkheid in het OS; andere sleutels trek je bij de bron in of je vraagt ondersteuning. Test daarna of de bedoelde toegang werkelijk is gestopt.')
story.append(p('Bron: '+link('Veiligheid en sleutelbelofte','https://socialnow.nl/nl/veiligheid'),'small'));ref('beveiliging')

title(5,chapters[4])
sub('Van voorstel naar actie','De sleutelbelofte beschrijft dat het OS pas schrijft in gekoppelde systemen na een voorstel dat jij goedkeurt, en dat de actie in een logboek komt. Het privacybeleid beschrijft menselijke tussenkomst bij publiceren, versturen en betalen. Controleer bij een voorstel de ontvanger, inhoud, bron, timing en gevolgen voordat je akkoord geeft. Eerder geconfigureerde opdrachten en instellingen kunnen eveneens instructies zijn.')
sub('AI verwerkt wat nodig is','Voor teksten, beelden en analyses kunnen relevante gegevens naar een modelleverancier gaan. Het privacybeleid noemt onder meer je verhaal, branding en relevante cijfers. De verwerkersovereenkomst noemt Google, OpenAI, Anthropic en Higgsfield bij de modeldiensten. Welke dienst een taak uitvoert hangt af van de gekozen functie. Je gegevens blijven dus niet per definitie uitsluitend in één lokale omgeving.')
sub('Training en toestemming','De leverancierslijst in de verwerkersovereenkomst beschrijft dat contractueel is uitgesloten dat de invoer wordt gebruikt voor modeltraining. Dat is een beleids- en contractafspraak voor de genoemde dienstconfiguraties, geen algemene uitspraak over ieder consumentenaccount van dezelfde leverancier. Vraag bij een nieuwe functie of afwijkende configuratie om de geldende afspraken.')
sub('Noodzakelijk gebruik en optionele meting','De actuele algemene voorwaarden maken onderscheid tussen beperkte toegang voor ondersteuning en beveiliging, en optionele gebruiksmeting en afzonderlijke gemaskeerde sessieopnamen waarvoor toestemming nodig is. Een account aanmaken geeft geen algemene toestemming om bedrijfsinhoud voor eigen productontwikkeling te gebruiken. Je beheert de optionele keuzes onder Account.')
ref('privacy');ref('voorwaarden');ref('verwerkersovereenkomst')

title(6,chapters[5])
sub('De gegevensstroom in vijf stappen','1. Jij of je team voert gegevens in of koppelt een bron. 2. Het OS controleert de identiteit, werkruimte en bevoegdheden. 3. De gekozen functie gebruikt de relevante opslag, communicatie- of modeldienst. 4. Een voorstel wordt aan je getoond wanneer goedkeuring nodig is. 5. Een goedgekeurde actie gaat naar de aangesloten bron. Het precieze pad verschilt per functie en leverancier.')
sub('De rol van leveranciers','De gepubliceerde verwerkersovereenkomst noemt leveranciers voor hosting, opslag, inloggen, mail, meting, AI en socialkanalen. Die leveranciers zijn subverwerkers als zij persoonsgegevens namens SocialNow verwerken. Een merk in het partnerblok is niet automatisch een subverwerker voor jouw gegevens. Een mogelijke koppeling of een verkennend gesprek betekent ook niet dat die partij al toegang tot jouw werkruimte heeft.')
sub('Locatie en internationale doorgifte','De dienstverlening is niet uitsluitend Europees. De verwerkersovereenkomst vermeldt een EU-regio voor PostHog en Amerikaanse regio’s voor de beschreven Vercel-appfuncties. Leveranciers, locaties en doorgiftemechanismen kunnen per dienst verschillen. Het beleid beschrijft passende doorgiftemechanismen, zoals standaardcontractbepalingen of waar toepasselijk het EU-VS Data Privacy Framework. Controleer voor gevoelige toepassingen de concrete dienst en regio.')
sub('Controle bij verandering','De leverancierslijst is een gedateerde momentopname. De overeenkomst beschrijft aankondiging van wijzigingen en de mogelijkheden om bezwaar te maken. Vraag voor een inkoopbesluit om de actuele lijst, de gebruikte configuratie en de gegevenscategorieën. Een logo of dit handboek vervangt die controle niet.')
ref('verwerkersovereenkomst');ref('privacy')

title(7,chapters[6])
sub('Auditsporen en foutmeldingen','Het beveiligingsbeleid beschrijft registratie van handelingen met gevolgen, zoals toegang verlenen, een systeem openen en een sleutel wijzigen. De sleutelbelofte beschrijft een logboek van acties. Sleutels horen niet in dat logboek. Deel bij een supportvraag bij voorkeur een tijdstip, werkruimte, foutmelding en een gemaskeerd voorbeeld; stuur geen complete klantendatabase als een klein voorbeeld voldoende is.')
sub('Ontwikkeling en wijzigingen','Het beleid beschrijft versiebeheer, herleidbare publicaties, automatische controles, een Content Security Policy en controles op kwetsbaarheden in afhankelijkheden. Dit handboek is geen onafhankelijke verificatie van iedere controle op iedere toepassing. Vraag bij een audit om bewijs dat past bij het systeem en de release die jouw organisatie gebruikt. De publieke website en de klantapp zijn verschillende toepassingen.')
sub('Back-ups zijn geen migratieplan','De verwerkersovereenkomst beschrijft het verlopen van back-ups na beëindiging. Daarmee is geen algemene dagelijkse back-upfrequentie, hersteltijd, maximaal gegevensverlies of beschikbaarheidspercentage afgesproken. Als jouw bedrijfsproces een specifieke RTO, RPO of SLA nodig heeft, laat die waarden voor jouw systeem expliciet vastleggen. Houd waar nodig ook eigen exports van bedrijfskritische gegevens bij.')
sub('Wat versleuteling niet oplost','Versleuteling voorkomt niet dat een bevoegd account een verkeerd bestand publiceert, een gebruiker een phishingverzoek volgt of een externe leverancier onbereikbaar raakt. Identiteitscontrole, beperkte rechten, menselijke controle en afspraken over herstel horen daarom bij dezelfde beveiligingsaanpak.')
ref('beveiliging');ref('verwerkersovereenkomst')

title(8,chapters[7])
sub('Melden bij SocialNow','Een vermoeden van ongewenste toegang, een uitgelekte sleutel of een kwetsbaarheid meld je aan security@socialnow.nl. Vermeld het tijdstip, het getroffen systeem, het gedrag dat je zag en hoe wij het kunnen reproduceren. Gebruik een gemaskeerde screenshot of een minimaal voorbeeld. Deel geen gegevens van andere klanten en publiceer het probleem niet voordat het verantwoord is afgehandeld.')
sub('De 24-uursafspraak','SocialNow meldt volgens de verwerkersovereenkomst een ontdekte inbreuk in verband met persoonsgegevens zonder onredelijke vertraging en uiterlijk binnen 24 uur bij de betrokken klant. De eerste melding bevat de feiten voor zover bekend; aanvullende informatie volgt zodra die beschikbaar is. Dit is een melding aan de klant. De klant beoordeelt zelf of een melding bij de toezichthouder of betrokkenen nodig is, tenzij SocialNow schriftelijk wordt gevraagd namens de klant te handelen.')
sub('De wettelijke termijn is een andere termijn','De Autoriteit Persoonsgegevens legt uit dat een meldplichtig datalek binnen 72 uur na kennisname moet worden gemeld. Niet elk beveiligingsincident is automatisch zo’n meldplichtig datalek. De feitelijke aantasting van persoonsgegevens en de risico’s zijn bepalend. Houd het onderzoek, de afweging en de maatregelen bij in een incidentregister.')
sub('Verantwoord kwetsbaarheden melden','Het beveiligingsbeleid beschrijft een menselijke reactie binnen drie werkdagen en een inschatting van de ernst binnen tien werkdagen. Stop als je onbedoeld toegang krijgt tot andermans gegevens. Belast het systeem niet met zware scans, verwijder niets en gebruik geen phishing of social engineering. SocialNow heeft geen beloningsprogramma volgens het gepubliceerde beleid.')
ref('beveiliging');ref('verwerkersovereenkomst');story.append(p('Externe uitleg: '+link('AP · Zo meldt u een datalek','https://autoriteitpersoonsgegevens.nl/themas/beveiliging/datalekken/zo-meldt-u-een-datalek'),'small'))

title(9,chapters[8])
sub('Rechten en verzoeken','Het privacybeleid beschrijft inzage, correctie, verwijdering, beperking, overdracht, bezwaar en het intrekken van toestemming, voor zover die rechten in de concrete situatie van toepassing zijn. Voor gegevens van jouw eigen klanten of medewerkers ben jij hun aanspreekpunt als verwerkingsverantwoordelijke. SocialNow ondersteunt je als verwerker bij de uitvoering van die verzoeken.')
sub('Identiteit en omvang','Beschrijf bij een verzoek welke persoon, werkruimte en gegevens bedoeld worden. Identiteitscontrole voorkomt dat een export bij de verkeerde persoon terechtkomt. Vraag geen gegevens op via een openbaar gedeelde link of een onbeveiligd groepsgesprek. Leg voor een grote export het formaat, de bestemming en de bevoegde ontvanger vast. Bij twijfel over de juiste route kun je privacy@socialnow.nl gebruiken.')
sub('Als je stopt','Volgens de verwerkersovereenkomst kies je voor teruggeven in een gangbaar bestandsformaat of wissen. Zonder keuze binnen dertig dagen na het einde worden gegevens gewist. De afspraak beschrijft verwijdering uit actieve systemen binnen dertig dagen en uit back-ups uiterlijk na negentig dagen. Een kopie in een aflopende back-up wordt niet meer gebruikt of getoond.')
sub('Uitzonderingen en controle','Een wettelijke bewaarplicht kan verwijdering voor bepaalde gegevens uitstellen, bijvoorbeeld voor factuuradministratie. Dat verandert het doel van de bewaring niet: die gegevens worden dan voor de wettelijke verplichting bewaard. Vraag desgewenst schriftelijke bevestiging van het wissen. Trek ook sleutels bij bronleveranciers in en controleer afzonderlijk de accounts, abonnementen en gegevens die daar blijven staan.')
ref('privacy');ref('verwerkersovereenkomst')

title(10,chapters[9])
sub('Bij de start','Kies één verantwoordelijke voor de werkruimte en één vervanger. Breng in kaart welke bronnen je gaat koppelen, welke gegevens erin staan en wie toegang nodig heeft. Controleer dat je gegevens mag laten verwerken en dat de gekozen dienst past bij eventuele sector- of klantvereisten. Lees de verwerkersovereenkomst voordat je persoonsgegevens van derden gebruikt.')
bullets(['Persoonlijke accounts en passende rollen ingericht.','Beschikbare passkeys of tweestapsverificatie geactiveerd.','Aparte API-gebruiker met beperkte rechten aangemaakt.','Geen geheimen in gedeelde documenten of prompts opgeslagen.','Optionele meting en sessieopnamen bewust gekozen.','Contactpersoon voor privacy en incidenten bekend.'])
sub('Bij dagelijkse werkzaamheden','Controleer voorgestelde acties voordat je goedkeurt. Neem geen complete databases op in een AI-verzoek als een beperkt deel voldoende is. Masker persoonsgegevens en sleutels bij support. Controleer toegang bij personeelswisselingen en na het inschakelen van een partner. Houd eigen procesafspraken bij; een veiligheidsfunctie kan een ontbrekende werkafspraak niet herstellen.')
sub('Bij wijziging of vertrek','Beoordeel rechten opnieuw als een functie of koppeling verandert. Controleer de actuele leverancierslijst bij een nieuwe dienst. Plan de export voordat een account sluit, trek bronrechten in en vraag om bevestiging van verwijdering waar dat nodig is. Spreek extra continuïteitseisen schriftelijk af in plaats van ze af te leiden uit een algemene marketingtekst.')
ref('verwerkersovereenkomst');story.append(p('Meer uitleg: '+link('Veilig koppelen','https://socialnow.nl/nl/veiligheid'),'small'))

title(11,chapters[10])
add('Een zakelijke beoordeling gaat verder dan “is het veilig?”. Gebruik onderstaande onderwerpen om vast te stellen of de dienstverlening past bij jouw organisatie. Dit is een vragenlijst voor controle, geen verklaring dat elke hieronder genoemde extra maatregel standaard aanwezig is.')
checks=[('Rol en doel','Welke gegevens verwerken jullie voor ons, voor welk doel en op welke instructie?'),('Toegang','Welke inlogroutes gebruiken wij, welke tweede factor is beschikbaar en welke beheerderstoegang is mogelijk?'),('Sleutels','Hoe worden onze koppelsleutels opgeslagen, uitgesloten van logs en AI, en ingetrokken?'),('Leveranciers','Welke subverwerkers en regio’s gebruikt onze configuratie daadwerkelijk?'),('AI','Welke modeldienst verwerkt welke invoer, met welke afspraken over training en bewaring?'),('Continuïteit','Welke back-ups, hersteltests, hersteltijden en beschikbaarheidsafspraken gelden specifiek voor ons?'),('Incident','Wie is onze contactpersoon, hoe verloopt de melding en welke gegevens krijgen wij?'),('Exit','Welke onderdelen kunnen we exporteren, in welk formaat en met welke termijnen voor wissen?'),('Bewijs','Welke auditsporen en maatregelen kunnen jullie voor onze toepassing aantonen?')]
for head,text in checks:sub(head,text)
add('De verwerkersovereenkomst beschrijft informatieverstrekking en audits. Bescherm bij een audit gegevens van andere klanten en de vertrouwelijke beveiligingsinformatie van leveranciers. Een eventuele geheimhoudingsovereenkomst legt vertrouwelijkheid vast; zij bewijst op zichzelf geen technische veiligheid.')
ref('verwerkersovereenkomst')

title(12,chapters[11])
for q,a in [
 ('Is mijn data echt van mij?','Je bedrijfsgegevens blijven van jou. Rechten van betrokken personen blijven gelden. Het eigendom of de gebruiksrechten van software, ontwerpen en materiaal van derden worden afzonderlijk geregeld.'),
 ('Kunnen jullie technisch nergens bij?','Noodzakelijke ondersteuning en beveiliging kunnen beperkte, gelogde toegang voor bevoegde medewerkers vereisen. De belofte is gecontroleerde toegang en geheimhouding, niet dat toegang technisch onmogelijk is.'),
 ('Staat alles in Europa?','Nee. De leveranciers en locaties verschillen per dienst. Het gepubliceerde beleid benoemt ook verwerking buiten de EER en de bijbehorende doorgiftemechanismen.'),
 ('Wordt mijn invoer gebruikt om AI-modellen te trainen?','De gepubliceerde verwerkersovereenkomst beschrijft uitsluiting van training bij de genoemde modeldiensten. Controleer voor jouw gekozen configuratie de actuele afspraken. Sleutels gaan volgens de sleutelbelofte nooit naar een AI-model.'),
 ('Hebben jullie ISO 27001 of SOC 2?','Het gepubliceerde beveiligingsbeleid zegt dat SocialNow deze certificeringen niet heeft. Dit document is geen vervangende certificering.'),
 ('Kan ik weg zonder mijn gegevens te verliezen?','Je kunt gegevens laten teruggeven of wissen volgens de verwerkersovereenkomst. Plan de export vóór sluiting en maak aparte afspraken voor een eventuele migratie.'),
 ('Is veiligheid voor 100% gegarandeerd?','Nee. Risico’s worden beperkt met technische maatregelen, werkafspraken en controle. Daarom publiceren wij zowel maatregelen als grenzen en het incidentproces.'),
]:sub(q,a)
sub('Contact','Beveiliging en kwetsbaarheden: security@socialnow.nl. Privacy, gegevens en verzoeken: privacy@socialnow.nl. Algemeen: hello@socialnow.nl. SocialNow, Amstelstraat 43G, 1017 DA Amsterdam. De actuele contact- en bedrijfsgegevens staan op de website.')
story.append(p(link('Veiligheid','https://socialnow.nl/nl/veiligheid')+' · '+link('Juridische documenten','https://socialnow.nl/nl/juridisch'),'small'))

# Gedateerde, publiek beschikbare beleidsuittreksels. Geen NDA-contract of handtekeningen.
def appendix(label,slug,selected):
 story.append(PageBreak());story.append(p('BIJLAGE '+label,'tag'));story.append(p(S[slug]['title']+' · beleidsuittreksel','h1'))
 add('Onderstaande tekst komt uit de gepubliceerde beleidsbron. Dit is een gedateerde selectie voor naslag. De actuele online tekst en jouw overeenkomst blijven leidend. Deze bijlage is geen onafhankelijk auditbewijs.')
 ref(slug)
 for section in S[slug]['sections']:
  if not selected(section['title']):continue
  story.append(p(html.escape(section['title']),'h2'))
  for i,paragraph in enumerate(section['paragraphs']):
   add(paragraph)
   lists=section.get('bullets') or []
   if i<len(lists) and lists[i]:bullets(lists[i])
appendix('A','beveiliging',lambda t:t in ['De uitgangspunten','Toegang','Versleuteling','Toezicht','Als er toch iets misgaat','Een kwetsbaarheid melden','Contact'])
appendix('B','voorwaarden',lambda t:t.startswith(('15.','17.')))
appendix('C','verwerkersovereenkomst',lambda t:t.startswith(('3.','4.','5.','6.','7.','8.','9.','10.','Bijlage A','Bijlage B','Bijlage C')))
story.append(PageBreak());story.append(p('BIJLAGE D','tag'));story.append(p('Bronnen, versie en onderhoud','h1'))
add('Versie 1.0, samengesteld op 13 oktober 2026. De hoofdstukken zijn uitleg op basis van de hieronder genoemde publieke bronnen. De brondata is bewaard naast het opmaakscript zodat deze uitgave reproduceerbaar is. De oorspronkelijke beleidsdatums staan bij de uittreksels. Controleer veranderingen in diensten en beleid voordat je dit document als inkoopbewijs gebruikt.')
for slug in ['voorwaarden','privacy','beveiliging','verwerkersovereenkomst']:ref(slug)
for label,url in [('Veiligheid en sleutelbelofte','https://socialnow.nl/nl/veiligheid'),('Responsible disclosure','https://socialnow.nl/security.txt'),('AP: beveiliging van persoonsgegevens','https://autoriteitpersoonsgegevens.nl/themas/beveiliging/beveiliging-van-persoonsgegevens'),('AP: verwerkersovereenkomst','https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verwerkersovereenkomst'),('AP: melding van een datalek','https://autoriteitpersoonsgegevens.nl/themas/beveiliging/datalekken/zo-meldt-u-een-datalek')]:story.append(p(link(label,url),'body'))
sub('Wat deze versie niet toevoegt','Geen nieuwe garantie, nieuw serviceniveau, gewijzigde overdracht van intellectuele eigendomsrechten of wijziging van een ondertekende overeenkomst. Geen aanspraak op niet-bestaande certificeringen en geen claim dat iedere verwerking uitsluitend in de EU plaatsvindt.')
sub('Wanneer bijwerken','Bij een wijziging van leverancier, regio, inlogroute, AI-configuratie, bewaartermijn, exportmogelijkheid of contractueel beleid. Werk eerst de onderliggende beleidsbron bij en maak daarna een nieuwe versie van dit handboek. Gebruik voor nieuwe afspraken altijd de actuele overeenkomsten.')

logo=ImageReader(Image.open(ROOT/'public/images/SocialNow-Logo-2026.webp'))
def decorate(canvas,doc):
 canvas.saveState();w,h=doc.pagesize
 canvas.setFillColor(colors.black);canvas.rect(0,h-48,w,48,fill=1,stroke=0)
 canvas.drawImage(logo,54,h-35,width=122,height=24,mask='auto',preserveAspectRatio=True,anchor='c')
 canvas.setFillColor(colors.HexColor('#bcc5cc'));canvas.setFont('SN',7);canvas.drawRightString(w-54,h-28,'VEILIGHEID & DATA · SOCIALNOW OS')
 canvas.setStrokeColor(LINE);canvas.line(54,43,w-54,43)
 canvas.setFillColor(MUTED);canvas.setFont('SN',7);canvas.drawString(54,30,'SocialNow · socialnow.nl · Publieke documentatie · 13 oktober 2026')
 canvas.drawRightString(w-54,30,f'v1.0 · {doc.page}');canvas.restoreState()
output=ROOT/'public/documenten/socialnow-veiligheid-en-data-nl.pdf'
doc=SimpleDocTemplate(str(output),pagesize=(595.28,841.89),leftMargin=54,rightMargin=54,topMargin=80,bottomMargin=62,title='Jouw data. Jouw regie. Onze verantwoordelijkheid. — SocialNow',author='SocialNow',subject='Uitgebreide publieke documentatie over eigendom, privacy en beveiliging')
doc.build(story,onFirstPage=decorate,onLaterPages=decorate)
from pypdf import PdfReader
print(f'{output}: {len(PdfReader(str(output)).pages)} pagina’s')
