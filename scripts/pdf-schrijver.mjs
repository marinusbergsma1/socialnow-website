// Een kleine pdf-schrijver — 19 september 2026.
//
// WAAROM DIT ER IS EN NIET EEN BIBLIOTHEEK OF CHROME
//
// De eerste opzet liet Chrome de juridische documenten afdrukken. Dat gaf een mooi resultaat en
// precies één keer: bij het tweede document bleef Chrome staan zonder melding, en daarna ook bij
// een pagina van drie regels. Een bouwstap die op deze machine soms werkt is geen bouwstap.
// Een pdf-bibliotheek erbij halen kan ook, maar dan hangt een juridisch document aan een
// afhankelijkheid die onderhouden moet worden, voor tekst op papier.
//
// Wat hier staat is het kleinste dat een echte pdf oplevert: A4, de standaardletters van pdf zelf
// (Helvetica, dus niets in te sluiten), tekst die netjes afbreekt op de werkelijke letterbreedtes,
// koppen, opsommingen, een omslag en paginanummers. Deterministisch: dezelfde tekst geeft byte
// voor byte hetzelfde bestand, op elke machine.
//
// WAT HET NIET DOET
//
// Geen afbeeldingen, geen tabellen, geen eigen letter. De huisletter van SocialNow zou insluiten
// van een woff2 vragen, en dat is precies het stuk dat een kleine schrijver groot maakt. Voor een
// document dat gelezen en geprint wordt is Helvetica geen verlies.

// De breedtes van Helvetica, in duizendsten van de lettergrootte. Dit is de standaardtabel die in
// elke pdf-lezer zit; ze staan hier zodat wij vooraf kunnen uitrekenen waar een regel omslaat.
// Zonder deze tabel moet je gokken op een gemiddelde breedte, en dan loopt tekst over de marge.
const B = {
  " ":278,"!":278,'"':355,"#":556,"$":556,"%":889,"&":667,"'":191,"(":333,")":333,"*":389,"+":584,
  ",":278,"-":333,".":278,"/":278,"0":556,"1":556,"2":556,"3":556,"4":556,"5":556,"6":556,"7":556,
  "8":556,"9":556,":":278,";":278,"<":584,"=":584,">":584,"?":556,"@":1015,
  A:667,B:667,C:722,D:722,E:667,F:611,G:778,H:722,I:278,J:500,K:667,L:556,M:833,N:722,O:778,
  P:667,Q:778,R:722,S:667,T:611,U:722,V:667,W:944,X:667,Y:667,Z:611,
  "[":278,"\\":278,"]":278,"^":469,_:556,"`":333,
  a:556,b:556,c:500,d:556,e:556,f:278,g:556,h:556,i:222,j:222,k:500,l:222,m:833,n:556,o:556,
  p:556,q:556,r:333,s:500,t:278,u:556,v:500,w:722,x:500,y:500,z:500,
  "{":334,"|":260,"}":334,"~":584,
  "·":278,"—":1000,"–":556,"'":222,"'":222,'"':333,'"':333,"…":1000,"€":556,
  "é":556,"è":556,"ë":556,"ê":556,"á":556,"à":556,"ä":556,"â":556,"í":278,"ï":278,"ó":556,
  "ö":556,"ô":556,"ú":556,"ü":556,"û":556,"ç":500,"ñ":556,"É":667,"Ö":778,"Ü":722,"ß":611,
};
const BVET = {
  ...B,
  " ":278,"-":333,".":278,",":278,":":333,";":333,"(":333,")":333,"/":278,
  A:722,B:722,C:722,D:722,E:667,F:611,G:778,H:722,I:278,J:556,K:722,L:611,M:833,N:722,O:778,
  P:667,Q:778,R:722,S:667,T:611,U:722,V:667,W:944,X:667,Y:667,Z:611,
  a:556,b:611,c:556,d:611,e:556,f:333,g:611,h:611,i:278,j:278,k:556,l:278,m:889,n:611,o:611,
  p:611,q:611,r:389,s:556,t:333,u:611,v:556,w:778,x:556,y:556,z:500,
  "0":556,"1":556,"2":556,"3":556,"4":556,"5":556,"6":556,"7":556,"8":556,"9":556,
};

const breedte = (tekst, grootte, vet) => {
  const tabel = vet ? BVET : B;
  let som = 0;
  for (const teken of String(tekst)) som += tabel[teken] ?? 556;
  return (som * grootte) / 1000;
};

// Een pdf-string draagt zijn eigen ontsnapping: haakjes en de backslash zijn structuur.
// Alles buiten Latin-1 kan in WinAnsi niet worden weergegeven en wordt vervangen door het
// dichtstbijzijnde teken dat wel bestaat, zodat er nooit een vraagteken in een document staat.
const VERVANG = { "’": "'", "‘": "'", "“": '"', "”": '"', "…": "...", "–": "-", "—": "-", " ": " " };
function pdfTekst(t) {
  let s = String(t).replace(/[’‘“”…–— ]/g, (c) => VERVANG[c]);
  // WinAnsi kent · (183) en € (128); de rest buiten Latin-1 gaat eruit.
  s = s.replace(/[^\x20-\x7E -ÿ€]/g, "");
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
    .replace(/[-ÿ€]/g, (c) => {
      const code = c === "€" ? 128 : c.charCodeAt(0);
      return "\\" + code.toString(8).padStart(3, "0");
    });
}

// Tekst afbreken op de werkelijke breedte. Een woord dat zelf breder is dan de kolom — een lange
// url bijvoorbeeld — wordt hard gesplitst, want anders loopt het de marge uit.
export function breekAf(tekst, grootte, vet, maxBreedte) {
  const regels = [];
  for (const stuk of String(tekst).split("\n")) {
    let regel = "";
    for (const woord of stuk.split(/\s+/).filter(Boolean)) {
      const proef = regel ? regel + " " + woord : woord;
      if (breedte(proef, grootte, vet) <= maxBreedte) { regel = proef; continue; }
      if (regel) { regels.push(regel); regel = ""; }
      if (breedte(woord, grootte, vet) <= maxBreedte) { regel = woord; continue; }
      let rest = woord;
      while (breedte(rest, grootte, vet) > maxBreedte) {
        let n = 1;
        while (n < rest.length && breedte(rest.slice(0, n + 1), grootte, vet) <= maxBreedte) n++;
        regels.push(rest.slice(0, n));
        rest = rest.slice(n);
      }
      regel = rest;
    }
    regels.push(regel);
  }
  return regels;
}

const MM = 72 / 25.4;
export const A4 = { breedte: 210 * MM, hoogte: 297 * MM };

export class Pdf {
  constructor({ marge = 20 * MM, boven = 22 * MM, onder = 20 * MM } = {}) {
    this.marge = marge; this.boven = boven; this.onder = onder;
    this.kolom = A4.breedte - marge * 2;
    this.paginas = [];
    this.nieuwePagina();
  }

  nieuwePagina() {
    this.huidig = [];
    this.paginas.push(this.huidig);
    this.y = A4.hoogte - this.boven;
  }

  ruimte(hoogte) {
    if (this.y - hoogte < this.onder) this.nieuwePagina();
  }

  kleur(r, g, b) { this.huidig.push(`${r} ${g} ${b} rg`); }

  /** Eén regel tekst op een vaste plek. Alle opmaak hieronder loopt hierlangs. */
  regel(tekst, { x = this.marge, grootte = 9.6, vet = false, kleur = null, y = null } = {}) {
    const plek = y == null ? this.y : y;
    if (kleur) this.huidig.push(`${kleur[0]} ${kleur[1]} ${kleur[2]} rg`);
    this.huidig.push(`BT /${vet ? "F2" : "F1"} ${grootte} Tf 1 0 0 1 ${x.toFixed(2)} ${plek.toFixed(2)} Tm (${pdfTekst(tekst)}) Tj ET`);
    if (kleur) this.huidig.push("0 0 0 rg");
  }

  alinea(tekst, { grootte = 9.6, regelhoogte = 1.5, vet = false, inspring = 0, kleur = null, na = 3.4 } = {}) {
    const max = this.kolom - inspring;
    const regels = breekAf(tekst, grootte, vet, max);
    const hoogte = grootte * regelhoogte;
    for (const r of regels) {
      this.ruimte(hoogte);
      this.regel(r, { x: this.marge + inspring, grootte, vet, kleur });
      this.y -= hoogte;
    }
    this.y -= na;
  }

  kop(tekst, { grootte = 10.6, kleur = [0.04, 0.48, 0.22] } = {}) {
    // Een kop onderaan een pagina met zijn tekst op de volgende is een losse kop. Vandaar de
    // extra ruimte: hij moet zelf passen én er moet nog een regel onder kunnen.
    this.ruimte(grootte * 1.4 + 9.6 * 1.5 * 2);
    this.y -= 4;
    this.alinea(tekst, { grootte, vet: true, kleur, regelhoogte: 1.25, na: 1.4 });
  }

  opsomming(regels, { grootte = 9.6 } = {}) {
    for (const r of regels) {
      const hoogte = grootte * 1.5;
      const afgebroken = breekAf(r, grootte, false, this.kolom - 14);
      this.ruimte(hoogte * Math.min(afgebroken.length, 2));
      // Het bolletje staat op de hoogte van de eerste regel van dit punt.
      this.regel("·", { x: this.marge + 5, grootte, vet: true });
      for (const regel of afgebroken) {
        this.ruimte(hoogte);
        this.regel(regel, { x: this.marge + 14, grootte });
        this.y -= hoogte;
      }
      this.y -= 1.2;
    }
    this.y -= 2.2;
  }

  lijn({ dikte = 0.6, kleur = [0.85, 0.85, 0.85] } = {}) {
    this.ruimte(6);
    this.huidig.push(`${kleur[0]} ${kleur[1]} ${kleur[2]} RG ${dikte} w ${this.marge} ${this.y.toFixed(2)} m ${(A4.breedte - this.marge).toFixed(2)} ${this.y.toFixed(2)} l S 0 0 0 RG`);
    this.y -= 6;
  }

  /** Paginanummers onderaan, plus een korte verwijzing. Pas aanroepen als alles erin staat. */
  voetregels(tekst) {
    this.paginas.forEach((pagina, i) => {
      if (i === 0) return; // de omslag krijgt geen nummer
      const nummer = `${i + 1} / ${this.paginas.length}`;
      const y = this.onder - 9;
      pagina.push(`0.45 0.45 0.45 rg BT /F1 7.4 Tf 1 0 0 1 ${this.marge} ${y.toFixed(2)} Tm (${pdfTekst(tekst)}) Tj ET`);
      const b = breedte(nummer, 7.4, false);
      pagina.push(`BT /F1 7.4 Tf 1 0 0 1 ${(A4.breedte - this.marge - b).toFixed(2)} ${y.toFixed(2)} Tm (${pdfTekst(nummer)}) Tj ET 0 0 0 rg`);
    });
  }

  /** Het bestand zelf: objecten, de kruisverwijzingstabel en de staart. */
  bouw({ titel = "", auteur = "SocialNow" } = {}) {
    const objecten = [];
    const voegToe = (inhoud) => { objecten.push(inhoud); return objecten.length; };

    const paginaIds = [];
    const inhoudIds = this.paginas.map((pagina) => {
      const stroom = pagina.join("\n");
      return voegToe(`<< /Length ${Buffer.byteLength(stroom, "latin1")} >>\nstream\n${stroom}\nendstream`);
    });
    const fontGewoon = voegToe("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    const fontVet = voegToe("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
    const paginaboomId = objecten.length + this.paginas.length + 1;
    for (const inhoudId of inhoudIds) {
      paginaIds.push(voegToe(
        `<< /Type /Page /Parent ${paginaboomId} 0 R /MediaBox [0 0 ${A4.breedte.toFixed(2)} ${A4.hoogte.toFixed(2)}] ` +
        `/Resources << /Font << /F1 ${fontGewoon} 0 R /F2 ${fontVet} 0 R >> >> /Contents ${inhoudId} 0 R >>`));
    }
    voegToe(`<< /Type /Pages /Kids [${paginaIds.map((i) => i + " 0 R").join(" ")}] /Count ${paginaIds.length} >>`);
    const infoId = voegToe(`<< /Title (${pdfTekst(titel)}) /Author (${pdfTekst(auteur)}) /Producer (SocialNow) >>`);
    const wortelId = voegToe(`<< /Type /Catalog /Pages ${paginaboomId} 0 R >>`);

    let uit = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
    const plekken = [];
    objecten.forEach((inhoud, i) => {
      plekken.push(Buffer.byteLength(uit, "latin1"));
      uit += `${i + 1} 0 obj\n${inhoud}\nendobj\n`;
    });
    const xref = Buffer.byteLength(uit, "latin1");
    uit += `xref\n0 ${objecten.length + 1}\n0000000000 65535 f \n`;
    for (const p of plekken) uit += String(p).padStart(10, "0") + " 00000 n \n";
    uit += `trailer\n<< /Size ${objecten.length + 1} /Root ${wortelId} 0 R /Info ${infoId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return Buffer.from(uit, "latin1");
  }
}
