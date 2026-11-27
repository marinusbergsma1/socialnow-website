/* ELT Live · bouwt de pagina's op uit inhoud.js. Hier hoef je niets aan te veranderen. */
(function () {
  var I = window.INHOUD, A = I.algemeen;
  var pagina = document.body.getAttribute("data-pagina");
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  // [Albert vult aan]-plekken krijgen een opvallende markering
  var t = function (s) { return esc(s).replace(/\[([^\]]+)\]/g, '<mark class="aanvul">[$1]</mark>'); };
  var label = function (s) { return '<p class="label"><span class="streep" aria-hidden="true"></span>' + t(s) + "</p>"; };
  var knop = function (tekst, link, soort) { return '<a class="knop ' + (soort || "") + '" href="' + link + '">' + esc(tekst) + '<span class="pijl" aria-hidden="true">→</span></a>'; };
  // Foto of video: een pad dat op .mp4 eindigt wordt een stille, herhalende video
  var foto = function (src, alt, cls, poster) {
    if (!src) return "";
    // het openingsbeeld meteen laden, de rest pas als het nodig is
    var eerst = /podium-foto|paginakop-foto/.test(cls || "");
    if (/\.mp4$/i.test(src)) return '<video class="' + (cls || "") + '" src="' + esc(src) + '"' + (poster ? ' poster="' + esc(poster) + '"' : "") + ' autoplay muted loop playsinline preload="metadata" aria-label="' + esc(alt) + '"></video>';
    return '<img class="' + (cls || "") + '" src="' + esc(src) + '" alt="' + esc(alt) + '"' + (eerst ? ' fetchpriority="high"' : ' loading="lazy"') + '>';
  };
  // Iconen uit de branding (dun lijnwerk met één oranje punt), inline zodat ze zich kunnen tekenen
  var ikoon = function (naam) { var b = (window.ICONEN || {})[naam]; return b ? '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + b + "</svg>" : ""; };
  var STAPIKOON = ["strategie", "creatie", "productie", "nazorg"];
  var VORMIKOON = ["congres", "event", "meeting", "productintroductie", "kalender"];
  var achtergrond = function (src) { return src ? '<img class="achtergrond" src="' + esc(src) + '" alt="" aria-hidden="true" loading="lazy">' : ""; };

  /* ---------- kop en menu ---------- */
  function kopbalk() {
    var links = A.menu.map(function (m) {
      var actief = location.pathname.split("/").pop() === m.link ? ' aria-current="page"' : "";
      return '<li><a href="' + m.link + '"' + actief + ">" + esc(m.tekst) + "</a></li>";
    }).join("");
    return '<header class="kopbalk" id="kopbalk"><div class="kopbalk-in">' +
      '<a class="merk" href="index.html" aria-label="' + esc(A.bedrijfsnaam) + ', naar home"><img class="merk-wit" src="beeld/logo/elt-woordmerk-wit.png" alt="' + esc(A.bedrijfsnaam) + '" width="566" height="135"><img class="merk-zwart" src="beeld/logo/elt-woordmerk-zwart.png" alt="" aria-hidden="true" width="566" height="135"></a>' +
      '<nav class="menu" id="menu" aria-label="Hoofdmenu"><ul>' + links + "</ul></nav>" +
      '<div class="kopbalk-acties">' + knop(A.knopAanvraag, "contact.html#aanvraag", "knop-klein") +
      '<button class="menuknop" id="menuknop" aria-expanded="false" aria-controls="menu"><span></span><span></span><span class="sr">Menu</span></button></div>' +
      "</div></header>";
  }

  function afsluiter() {
    var f = A.afsluiter;
    return '<section class="afsluiter met-achtergrond">' + achtergrond(f.foto) + '<div class="breed">' + label("Plan een gesprek") +
      '<h2 class="kop-xl">' + t(f.kop) + "</h2><div class=\"afsluiter-rij\"><p class=\"groot\">" + t(f.tekst) + "</p></div></div></section>";
  }

  /* ---------- footeropties ter vergelijking (footer-optie-1.html t/m -4.html) ---------- */
  var jaar = new Date().getFullYear();
  var menuLinks = function () { return A.menu.map(function (m) { return '<li><a href="' + m.link + '">' + esc(m.tekst) + "</a></li>"; }).join(""); };
  var contactRegels = function (scheiding) {
    return [esc(A.adres), '<a href="mailto:' + A.email + '">' + esc(A.email) + "</a>", '<a href="tel:' + A.telefoonLink + '">' + esc(A.telefoon) + "</a>", '<a href="' + esc(A.linkedin) + '" rel="noopener">LinkedIn</a>'].join(scheiding);
  };
  var footerOpties = {
    // 1. Compact: logo één keer, één rij met menu en contact, pay-off één keer in de slotregel
    "1": function () {
      return '<footer class="voet voet-1"><div class="breed v1-rij">' +
        '<a class="v-merk" href="index.html"><img src="beeld/logo/elt-woordmerk-wit.png" alt="ELT Live" width="566" height="135"></a>' +
        '<nav aria-label="Voetmenu"><ul>' + menuLinks() + "</ul></nav>" +
        '<address>' + contactRegels("<br>") + "</address></div>" +
        '<div class="breed v-onder"><span>© ' + jaar + " " + esc(A.bedrijfsnaam) + "</span><span>" + esc(A.payoff) + "</span></div></footer>";
    },
    // 2. Groot logo als slotbeeld: geen klein logo, één rustige rij info, dan ELT LIVE strak en subtiel over de volle breedte
    "2": function () {
      return '<footer class="voet voet-2"><div class="breed v2-rij">' +
        '<p class="v2-contact">' + contactRegels('<span class="sep" aria-hidden="true">·</span>') + "</p>" +
        '<nav aria-label="Voetmenu"><ul>' + menuLinks() + "</ul></nav></div>" +
        '<div class="breed v-onder"><span>© ' + jaar + " " + esc(A.bedrijfsnaam) + "</span><span>" + esc(A.voetnoot) + "</span></div>" +
        '<div class="voet-groot v2-logo"><img src="beeld/logo/elt-woordmerk-wit-groot.png" alt="ELT Live" width="2258" height="535"></div></footer>';
    },
    // 3. Wit en minimalistisch: logo, adres, mail, LinkedIn, één regel
    "3": function () {
      return '<footer class="voet voet-3 licht"><div class="breed v3-rij">' +
        '<a class="v-merk" href="index.html"><img src="beeld/logo/elt-woordmerk-zwart.png" alt="ELT Live" width="566" height="135"></a>' +
        '<p>' + [esc(A.adres), '<a href="mailto:' + A.email + '">' + esc(A.email) + "</a>", '<a href="' + esc(A.linkedin) + '" rel="noopener">LinkedIn</a>', "© " + jaar].join('<span class="sep" aria-hidden="true">·</span>') + "</p></div></footer>";
    },
    // 4. De oranje lijn eindigt in de voet en tekent de pay-off uit het logo als slotbeeld
    "4": function () {
      return '<footer class="voet voet-4"><div class="breed v4-slot"><img class="voet-slot" src="beeld/logo/elt-payoff-wit.png" alt="Every little thing matters" width="2051" height="268"></div>' +
        '<div class="breed v4-rij"><a class="v-merk" href="index.html"><img src="beeld/logo/elt-woordmerk-wit.png" alt="ELT Live" width="566" height="135"></a>' +
        '<p>' + contactRegels('<span class="sep" aria-hidden="true">·</span>') + '</p><span class="v4-jaar">© ' + jaar + "</span></div></footer>";
    }
  };

  function voet() {
    var fo = document.body.getAttribute("data-footer");
    if (fo && footerOpties[fo]) return footerOpties[fo]();
    var partners = (I.overOns.partners || []).map(function (x) { return esc(x.naam); }).join('<span class="sep" aria-hidden="true">·</span>');
    return '<footer class="voet voet-def">' +
      // slotbeeld: de oranje lijn tekent de pay-off en loopt door naar de knop
      '<div class="breed v-slot"><div class="slot-tekst"><img class="voet-slot" src="beeld/logo/elt-payoff-tekst-wit.png" alt="Every little thing matters" width="1318" height="268"></div>' +
      '<div class="voet-knop">' + knop(A.afsluiter.knop, "contact.html#aanvraag", "knop-groot") + "</div></div>" +
      '<div class="breed v-kolommen">' +
        '<div class="v-intro"><a class="v-merk" href="index.html" aria-label="ELT Live, naar home"><img src="beeld/logo/elt-woordmerk-wit-groot.png" alt="ELT Live" width="2258" height="535"></a>' +
        "<p>Bureau voor strategische live communicatie. Van eerste vraag tot uitvoering, vanuit één team en één regie.</p></div>" +
        '<div class="v-kol"><h3>Contact</h3><address>' + esc(A.adres) + '<br><a href="tel:' + A.telefoonLink + '">' + esc(A.telefoon) + '</a><br><a href="mailto:' + A.email + '">' + esc(A.email) + "</a></address></div>" +
        '<div class="v-kol"><h3>Pagina\'s</h3><ul>' + A.menu.map(function (m) { return '<li><a href="' + m.link + '">' + esc(m.tekst) + "</a></li>"; }).join("") + "</ul></div>" +
        '<div class="v-kol"><h3>Wat we doen</h3><ul>' + I.watWeDoen.vormen.map(function (v) { return '<li><a href="wat-we-doen.html">' + esc(v.naam) + "</a></li>"; }).join("") + "</ul></div>" +
        '<div class="v-kol"><h3>Volg ons</h3><ul><li><a href="' + esc(A.linkedin) + '" rel="noopener">LinkedIn</a></li></ul></div>' +
      "</div>" +
      (partners ? '<div class="breed v-partners"><h3>Partners</h3><p>' + partners + "</p></div>" : "") +
      '<div class="breed v-onder"><span>© ' + new Date().getFullYear() + " " + esc(A.bedrijfsnaam) + '<span class="sep" aria-hidden="true">·</span>' + esc(A.voetnoot) + "</span></div></footer>";
  }

  function oudeVoet() {
    return '<footer class="voet"><div class="breed voet-rij">' +
      '<div class="voet-merk"><img src="beeld/logo/elt-logo-wit.png" alt="ELT Live, Strategic Live Communication, Every little thing matters" width="1086" height="514"></div>' +
      '<div class="voet-blok"><h3>Contact</h3><p>' + esc(A.adres) + '</p><p><a href="tel:' + A.telefoonLink + '">' + esc(A.telefoon) + '</a><br><a href="mailto:' + A.email + '">' + esc(A.email) + "</a></p></div>" +
      '<div class="voet-blok"><h3>Pagina\'s</h3><ul>' + A.menu.map(function (m) { return '<li><a href="' + m.link + '">' + esc(m.tekst) + "</a></li>"; }).join("") + "</ul></div>" +
      '<div class="voet-blok"><h3>Volg ons</h3><p><a href="' + esc(A.linkedin) + '" rel="noopener">LinkedIn</a></p></div>' +
      '</div><div class="breed voet-onder"><span>© ' + new Date().getFullYear() + " " + esc(A.bedrijfsnaam) + "</span><span>" + esc(A.voetnoot) + "</span></div>" +
      '<div class="voet-groot" aria-hidden="true"><img src="beeld/logo/elt-beeldmerk-negatief.svg" alt="" width="2256" height="532"></div></footer>';
  }

  /* ---------- paginakop met foto (binnenpagina's) ---------- */
  function paginakop(p) {
    return '<section class="paginakop">' + foto(p.foto, p.fotoOmschrijving, "paginakop-foto") +
      '<div class="breed paginakop-in">' + label(p.label) + '<h1 class="kop-xl">' + t(p.kop) + '</h1><p class="groot">' + t(p.inleiding) + "</p></div></section>";
  }

  /* ---------- headeropties (alleen voor de vergelijking) ---------- */
  var kopMetAccent = function (kop) { return t(kop).replace(/goosebumps\?/, '<span class="accent">goosebumps?</span>'); };
  var knoppenHeld = function (h) { return '<div class="knoppen">' + knop(A.knopAanvraag, "contact.html#aanvraag", "knop-groot") + knop(h.knopTwee, "aanpak.html", "knop-rand") + "</div>"; };
  var headerOpties = {
    // 1. Typografisch: zwart podium, kop als hoofdrol, vormen als aftiteling onderaan
    "1": function (h) {
      return '<section class="held held-1"><div class="breed held-in">' + label(A.voetnoot) +
        '<h1 class="kop-held">' + kopMetAccent(h.kop) + '</h1><div class="held-rij"><p class="groot">' + t(h.inleiding) + "</p>" + knoppenHeld(h) + "</div></div>" +
        '<ul class="held-vormen breed">' + I.watWeDoen.vormen.map(function (v) { return "<li>" + esc(v.naam) + "</li>"; }).join("") + "</ul></section>";
    },
    // 2. Gesplitst: tekst links op zwart, rechts een staande foto van het lege podium tot de schermrand
    "2": function (h) {
      return '<section class="held held-2"><div class="held-tekst"><h1 class="kop-held">' + kopMetAccent(h.kop) + '</h1><p class="groot">' + t(h.inleiding) + "</p>" + knoppenHeld(h) + "</div>" +
        '<div class="held-beeld">' + foto("beeld/stock/podium-stoel.webp", "Een lege stoel op een donker podium, vlak voor de show", "podium-foto") + "</div></section>";
    },
    // 3. Gecentreerd: groot zaalbeeld, logo in het midden van de kopbalk, kop en knop gecentreerd
    "3": function (h) {
      return '<section class="held held-3">' + foto("beeld/stock/zaal-lichtbundels.webp", "Een lege congreszaal met lichtbundels boven het podium", "podium-foto") +
        '<div class="breed held-in"><h1 class="kop-held">' + kopMetAccent(h.kop) + '</h1><p class="groot">' + t(h.inleiding) + "</p>" + knoppenHeld(h) + "</div></section>";
    },
    // 4. Filmdoek: kop op zwart, eronder een breed beeld als projectiedoek; kopbalk minimaal (logo, knop, menu)
    "4": function (h) {
      return '<section class="held held-4"><div class="breed held-in"><h1 class="kop-held">' + kopMetAccent(h.kop) + '</h1><div class="held-rij"><p class="groot">' + t(h.inleiding) + "</p>" + knoppenHeld(h) + "</div></div>" +
        '<div class="breed held-doek">' + foto("beeld/stock/podiumlicht-zijkant.webp", "Podiumlicht van opzij in een donkere zaal", "podium-foto") + "</div></section>";
    }
  };
  if (document.body.getAttribute("data-header")) document.body.classList.add("kop-optie-" + document.body.getAttribute("data-header"));

  /* ---------- pagina's ---------- */
  var bouw = {
    home: function () {
      var h = I.home;
      var held = '<section class="podium">' + foto(h.foto, h.fotoOmschrijving, "podium-foto") +
        '<div class="breed podium-in"><h1 class="kop-held">' + t(h.kop) + '</h1>' +
        '<div class="podium-onder"><p class="groot">' + t(h.inleiding) + '</p><div class="knoppen">' +
        knop(A.knopAanvraag, "contact.html#aanvraag", "knop-groot") + knop(h.knopTwee, "aanpak.html", "knop-rand") + "</div></div></div>" +
        '<p class="podium-voet breed"><span>' + esc(A.voetnoot) + '</span><span>Almere</span></p></section>';
      // headeropties ter vergelijking (header-optie-1.html t/m -4.html); index.html gebruikt de standaard
      var optie = document.body.getAttribute("data-header");
      if (optie && headerOpties[optie]) held = headerOpties[optie](h);
      return held +

        '<section class="sectie licht"><div class="breed twee"><div>' + label(h.wie.label) + '<h2 class="kop-l">' + t(h.wie.kop) + '</h2></div><div class="lees">' +
        h.wie.tekst.map(function (p) { return "<p>" + t(p) + "</p>"; }).join("") + '<p class="nadruk">' + t(h.wie.nadruk) + "</p></div></div></section>" +

        '<section class="sectie sectie-vlak vormen-sectie"><div class="breed"><div class="vormen-kop">' + label("Wat we maken") + '<h2 class="kop-l">Vijf vormen, één vraag: wat moet het opleveren?</h2></div>' +
        knop("Alles over wat we doen", "wat-we-doen.html", "knop-rand vormen-knop") + '</div><ul class="vormkaarten">' +
        I.watWeDoen.vormen.map(function (v, i) {
          return '<li class="vorm-kaart"><a href="wat-we-doen.html"><span class="vorm-beeld">' + foto(v.foto, v.naam) + '</span><span class="nr">0' + (i + 1) + '</span><span class="vorm-naam">' + esc(v.naam) + "</span></a></li>";
        }).join("") +
        "</ul></section>" +

        '<section class="sectie licht"><div class="breed beeldtekst">' + foto(h.begin.foto, h.begin.fotoOmschrijving) + '<div>' + label(h.begin.label) +
        '<h2 class="kop-l">' + t(h.begin.kop) + '</h2><p class="groot">' + t(h.begin.tekst) + "</p>" +
        '<ol class="cues">' + I.aanpak.stappen.map(function (s, i) { return '<li><span class="nr">0' + (i + 1) + "</span>" + esc(s.naam) + "</li>"; }).join("") + "</ol>" +
        knop("Zo werken we", "aanpak.html", "knop-rand") + "</div></div></section>" +

        '<section class="sectie spot"><div class="breed spot-rij"><div class="spot-tekst">' + label(h.details.label) + '<h2 class="kop-l">' + t(h.details.kop) + '</h2>' + (h.details.tekst ? '<p class="spot-inleiding">' + t(h.details.tekst) + "</p>" : "") +
        '<ul class="spotlijst">' + h.details.punten.map(function (p) { return "<li>" + t(p) + "</li>"; }).join("") + "</ul>" +
        '<img class="signatuur" src="beeld/logo/elt-matters.png" alt="matters" width="1472" height="266" loading="lazy"></div>' +
        foto(h.details.foto, h.details.fotoOmschrijving, "spot-foto", h.details.poster) + "</div></section>";
    },

    aanpak: function () {
      var p = I.aanpak;
      return paginakop(p) +
        '<section class="sectie licht"><div class="breed"><ol class="draaiboek">' + p.stappen.map(function (s, i) {
          return '<li><div class="cue-kol"><span class="cue">0' + (i + 1) + "</span>" + ikoon(STAPIKOON[i]) + '</div><div><p class="cue-naam">' + esc(s.naam) + '</p><h2 class="kop-m">' + t(s.kop) + "</h2></div><p>" + t(s.tekst) + "</p></li>";
        }).join("") + "</ol></div></section>" +
        '<section class="sectie sectie-vlak"><div class="breed beeldtekst beeld-breed">' + foto(p.rol.foto, p.rol.fotoOmschrijving, "", p.rol.poster) + '<div><h2 class="kop-l">' + t(p.rol.kop) + '</h2><ul class="vinklijst">' +
        p.rol.punten.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("") + "</ul></div></div></section>";
    },

    "wat-we-doen": function () {
      var p = I.watWeDoen;
      return paginakop(p) +
        '<section class="sectie licht"><div class="breed"><ul class="vormen">' + p.vormen.map(function (v, i) {
          return "<li>" + ikoon(VORMIKOON[i]) + '<span class="nr">0' + (i + 1) + '</span><h2 class="kop-m">' + esc(v.naam) + "</h2><p>" + t(v.tekst) + "</p></li>";
        }).join("") + "</ul></div></section>" +
        '<section class="sectie sectie-vlak"><div class="breed">' + label("Eén team") + '<h2 class="kop-l smal">' + t(p.disciplines.kop) + '</h2>' + foto(p.disciplines.foto, p.disciplines.fotoOmschrijving, "band-foto") + '<ul class="kolommen">' +
        p.disciplines.punten.map(function (d, i) { return "<li>" + ikoon(STAPIKOON[i]) + "<h3>" + esc(d.naam) + "</h3><p>" + t(d.tekst) + "</p></li>"; }).join("") + "</ul></div></section>";
    },

    werk: function () {
      var p = I.werk;
      return paginakop(p) +
        '<section class="sectie licht"><div class="breed cases">' + p.cases.filter(function (c) { return c.zichtbaar; }).map(function (c, i) {
          return '<article class="case">' + (c.foto ? foto(c.foto, c.kop, "case-foto") : '<div class="case-foto case-leeg"><span>Foto van case ' + (i + 1) + "</span></div>") +
            '<div class="case-tekst"><p class="case-meta">' + t(c.opdrachtgever) + " · " + t(c.soort) + '</p><h2 class="kop-m">' + t(c.kop) + "</h2>" +
            "<dl><dt>De vraag</dt><dd>" + t(c.vraag) + "</dd><dt>Wat we deden</dt><dd>" + t(c.aanpak) + "</dd><dt>Wat het opleverde</dt><dd>" + t(c.resultaat) + "</dd></dl></div></article>";
        }).join("") + "</div></section>" +
        '<section class="sectie sectie-vlak met-achtergrond">' + achtergrond(p.reactie.foto) + '<div class="breed"><blockquote class="citaat"><p>' + t(p.reactie.tekst) + "</p><footer>" + t(p.reactie.naam) + "</footer></blockquote></div></section>";
    },

    "over-ons": function () {
      var p = I.overOns;
      return '<section class="paginakop">' + foto(p.kopFoto, p.kopFotoOmschrijving, "paginakop-foto") + '<div class="breed paginakop-in">' + label(p.label) + '<h1 class="kop-xl">' + t(p.kop) + '</h1><p class="groot">' + t(p.inleiding) + "</p>" +
        '<ul class="waarden">' + p.waarden.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "</ul></div></section>" +
        '<section class="sectie licht"><div class="breed">' + label(p.teamKop) + '<ul class="team">' + p.team.map(function (m) {
          var ini = m.naam.split(" ").map(function (d) { return d[0]; }).filter(function (c) { return c === c.toUpperCase(); }).join("");
          return '<li>' + (m.foto ? foto(m.foto, m.naam, "team-foto") : '<div class="team-foto team-leeg" aria-hidden="true"><span>' + ini + "</span></div>") +
            '<h2 class="kop-m">' + esc(m.naam) + '</h2><p class="team-rol">' + esc(m.rol) + "</p><p>" + t(m.tekst) + "</p>" +
            (m.linkedin ? '<p><a class="tekstlink" href="' + esc(m.linkedin) + '" rel="noopener">LinkedIn</a></p>' : "") + "</li>";
        }).join("") + "</ul></div></section>" +
        '<section class="sectie sectie-vlak"><div class="breed beeldtekst">' + foto(p.foto, p.fotoOmschrijving) + "<div>" + label(p.partnersLabel) +
        '<h2 class="kop-l">' + t(p.partnersKop) + "</h2>" + p.partnersTekst.map(function (x) { return "<p>" + t(x) + "</p>"; }).join("") +
        '<ul class="partners">' + p.partners.map(function (x) { return "<li><h3>" + esc(x.naam) + "</h3><p>" + t(x.tekst) + "</p></li>"; }).join("") + "</ul></div></div></section>";
    },

    contact: function () {
      var p = I.contact;
      var keuzes = function (naam, lijst) {
        return lijst.map(function (o, i) { return '<label class="keuze"><input type="radio" name="' + naam + '" value="' + esc(o) + '"' + (i === 0 && false ? " checked" : "") + "><span>" + esc(o) + "</span></label>"; }).join("");
      };
      return '<section class="paginakop paginakop-kaal"><div class="breed paginakop-in">' + label(p.label) + '<h1 class="kop-xl">' + t(p.kop) + '</h1><p class="groot">' + t(p.inleiding) + "</p></div></section>" +
        '<section class="sectie licht" id="aanvraag"><div class="breed contact-rij">' +
        '<form class="formulier" id="formulier" novalidate>' +
        '<h2 class="kop-m">' + esc(p.formulierKop) + "</h2>" +
        '<div class="velden2"><div class="veld"><label for="naam">Naam <span class="vereist">*</span></label><input id="naam" name="naam" autocomplete="name" required></div>' +
        '<div class="veld"><label for="organisatie">Organisatie <span class="vereist">*</span></label><input id="organisatie" name="organisatie" autocomplete="organization" required></div>' +
        '<div class="veld"><label for="email">E-mailadres <span class="vereist">*</span></label><input id="email" name="email" type="email" autocomplete="email" required></div>' +
        '<div class="veld"><label for="telefoon">Telefoonnummer</label><input id="telefoon" name="telefoon" type="tel" autocomplete="tel"></div></div>' +
        '<fieldset class="veld"><legend>Soort live moment</legend><div class="keuzes">' + keuzes("soort", p.soortenEvent) + "</div></fieldset>" +
        '<div class="velden2"><div class="veld"><label for="datum">Datum of periode</label><input id="datum" name="datum" placeholder="Bijvoorbeeld voorjaar 2027"></div>' +
        '<div class="veld"><label for="gasten">Aantal gasten</label><select id="gasten" name="gasten"><option value="">Kies een aantal</option>' + p.aantallenGasten.map(function (o) { return "<option>" + esc(o) + "</option>"; }).join("") + "</select></div></div>" +
        '<div class="veld"><label for="vraag">Je vraag <span class="vereist">*</span></label><textarea id="vraag" name="vraag" rows="6" required placeholder="Wat wil je bereiken, voor wie, en wat weet je al?"></textarea></div>' +
        '<p class="fout" id="fout" role="alert" hidden>Vul je naam, organisatie, e-mailadres en vraag in.</p>' +
        '<button class="knop knop-groot" type="submit">Verstuur aanvraag<span class="pijl" aria-hidden="true">→</span></button>' +
        '<p class="klein">We gebruiken je gegevens alleen om contact met je op te nemen over deze aanvraag.</p></form>' +
        '<div class="bedankt" id="bedankt" hidden tabindex="-1"><h2 class="kop-l">' + t(p.bedankt.kop) + "</h2><p class=\"groot\">" + t(p.bedankt.tekst) + "</p></div>" +
        '<aside class="contactkaart">' + (p.belFoto ? '<img class="contactkaart-band" src="' + esc(p.belFoto) + '" alt="" aria-hidden="true">' : "") + '<h2 class="kop-m">' + t(p.belKop) + "</h2><p>" + t(p.belTekst) + "</p>" +
        '<p class="contactregel"><span>' + ikoon("telefoon") + 'Telefoon</span><a href="tel:' + A.telefoonLink + '">' + esc(A.telefoon) + "</a></p>" +
        '<p class="contactregel"><span>' + ikoon("mail") + 'E-mail</span><a href="mailto:' + A.email + '">' + esc(A.email) + "</a></p>" +
        '<p class="contactregel"><span>' + ikoon("locatie") + 'Adres</span>' + esc(A.adres) + "</p></aside>" +
        "</div></section>";
    }
  };

  var titels = { home: I.home.titel, aanpak: I.aanpak.titel, "wat-we-doen": I.watWeDoen.titel, werk: I.werk.titel, "over-ons": I.overOns.titel, contact: I.contact.titel };
  document.title = titels[pagina] || A.bedrijfsnaam;
  document.getElementById("site").innerHTML = kopbalk() + '<main id="inhoud">' + bouw[pagina]() + "</main>" + (pagina === "contact" ? "" : afsluiter()) + voet();

  /* ---------- gedrag ---------- */
  var kb = document.getElementById("kopbalk");
  // De kopbalk kleurt mee met de sectie eronder: wit op zwart, zwart op wit
  var opScroll = function () {
    var vlakken = document.querySelectorAll("main > section, .afsluiter, .voet");
    kb.classList.toggle("vast", window.scrollY > 24);
    var y = kb.offsetHeight / 2, licht = false;
    for (var i = 0; i < vlakken.length; i++) {
      var r = vlakken[i].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { licht = vlakken[i].classList.contains("licht"); break; }
    }
    kb.classList.toggle("op-licht", licht);
  };
  // ook bij laden, terugkeren naar een scrollpositie, ankers en formaatwijziging
  opScroll(); window.addEventListener("scroll", opScroll, { passive: true });
  ["load", "resize", "hashchange", "pageshow"].forEach(function (ev) { addEventListener(ev, function () { requestAnimationFrame(opScroll); }); });
  setTimeout(opScroll, 300);

  var mk = document.getElementById("menuknop");
  mk.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    mk.setAttribute("aria-expanded", open);
  });

  // Spotlicht: de regel in beeld licht op, de rest blijft in het donker
  var spot = document.querySelectorAll(".spotlijst li");
  if (spot.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var idx = Array.prototype.indexOf.call(spot, e.target);
        spot.forEach(function (l, i) { l.classList.toggle("aan", i === idx); if (i <= idx) l.classList.add("gezien"); });
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    spot.forEach(function (l) { io.observe(l); });
    spot[0].classList.add("aan", "gezien");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) spot.forEach(function (l) { l.classList.add("gezien"); });
  } else { spot.forEach(function (l) { l.classList.add("gezien"); }); }

  // Rustig binnenkomen bij scrollen
  var reveal = document.querySelectorAll(".sectie .breed > *, .draaiboek li, .vormen li, .case, .team li");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ro = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("zicht"); ro.unobserve(e.target); } }); }, { rootMargin: "0px 0px -4% 0px" });
    reveal.forEach(function (el) {
      if (el.getBoundingClientRect().top < innerHeight) return;   // al in beeld bij laden: gewoon tonen
      el.classList.add("verborgen"); ro.observe(el);
    });
  }

  /* ---------- Effecten: blur-in koppen, woord-voor-woord, logo in de voet ----------
     Zonder JS of met 'minder beweging' blijft alle tekst gewoon zichtbaar. */
  var rustig = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var kanIO = "IntersectionObserver" in window;

  // Splitst tekst in losse woorden (span per woord); spaties blijven echte spaties
  function splitsWoorden(el, cls) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [], n = 0;
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(function (tn) {
      var frag = document.createDocumentFragment();
      tn.nodeValue.split(/(\s+)/).forEach(function (d) {
        if (!d) return;
        if (/^\s+$/.test(d)) { frag.appendChild(document.createTextNode(d)); return; }
        var sp = document.createElement("span"); sp.className = cls; sp.style.setProperty("--i", n++); sp.textContent = d; frag.appendChild(sp);
      });
      tn.parentNode.replaceChild(frag, tn);
    });
    return el.querySelectorAll("." + cls);
  }

  if (!rustig && kanIO) {
    document.documentElement.classList.add("fx");

    // 1. Blur-in: koppen worden van wazig scherp, woord voor woord, eenmalig
    var koppen = document.querySelectorAll("main h1, main h2, .afsluiter h2");
    var ko = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ko.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -4% 0px" });
    koppen.forEach(function (k) {
      // al in beeld bij laden (behalve de grote openingskop): direct tonen
      if (k.getBoundingClientRect().top < innerHeight && !k.classList.contains("kop-held")) return;
      splitsWoorden(k, "bw"); k.classList.add("blur-kop");
      if (k.classList.contains("kop-held")) requestAnimationFrame(function () { requestAnimationFrame(function () { k.classList.add("in"); }); });
      else ko.observe(k);
    });

    // Iconen tekenen zich één keer zodra ze in beeld komen; daarna het oranje moment
    var ics = document.querySelectorAll(".ic");
    var ico = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ico.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    ics.forEach(function (ic) { ico.observe(ic); });
    // Handgeschreven "matters" schrijft zich van links naar rechts
    var sig = document.querySelector(".signatuur");
    if (sig) new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { sig.classList.add("in"); o.disconnect(); } }); }, { rootMargin: "0px 0px -12% 0px" }).observe(sig);

    // Vormen op home: beelden schuiven één voor één open
    var vk = document.querySelector(".vormkaarten");
    if (vk) {
      vk.querySelectorAll(".vorm-kaart").forEach(function (li, i) { li.style.setProperty("--k", i); });
      new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { vk.classList.add("in"); o.disconnect(); } }); }, { rootMargin: "0px 0px -10% 0px" }).observe(vk);
    }

    // 2. Woord voor woord: alleen een paar sleutelteksten
    var sleutel = document.querySelectorAll(
      'body[data-pagina="home"] .beeldtekst .groot, body[data-pagina="aanpak"] .paginakop .groot, body[data-pagina="over-ons"] .paginakop .groot');
    var scrollTeksten = [];
    sleutel.forEach(function (p) {
      var woorden = splitsWoorden(p, "ww"); p.classList.add("woord-voor-woord");
      var r = p.getBoundingClientRect();
      if (r.top < innerHeight * 0.85) {
        // al in beeld bij openen: korte sequentie
        woorden.forEach(function (wd, i) { setTimeout(function () { wd.classList.add("aan"); }, 250 + i * 35); });
      } else { scrollTeksten.push({ el: p, woorden: woorden }); }
    });
    if (scrollTeksten.length) {
      var bezig = false;
      var werkBij = function () {
        bezig = false;
        scrollTeksten.forEach(function (t) {
          var r = t.el.getBoundingClientRect();
          // begint als de alinea op 90% van het scherm staat, klaar rond 40%
          var p = Math.min(1, Math.max(0, (innerHeight * 0.95 - r.top) / (innerHeight * 0.3)));
          var tot = Math.round(p * t.woorden.length);
          t.woorden.forEach(function (wd, i) { wd.classList.toggle("aan", i < tot); });
        });
      };
      addEventListener("scroll", function () { if (!bezig) { bezig = true; requestAnimationFrame(werkBij); } }, { passive: true });
      werkBij();
    }

    // 3. Groot logo in de voet: wordt eenmalig van vaag scherp en schuift een paar procent omhoog
    var groot = document.querySelector(".voet-groot");
    if (groot) new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { groot.classList.add("in"); o.disconnect(); } }); }, { rootMargin: "0px 0px -10% 0px" }).observe(groot);
  }

  /* ---------- De rode draad: één oranje lijn die zich tekent terwijl je scrollt ----------
     Loopt in de linkermarge (nooit door tekst) van de paginakop tot de aanvraagknop.
     Bij elk sectielabel buigt hij af naar de kop; elke stap is een punt dat oplicht.
     Aan het eind buigt hij de knop "Plan een gesprek" in, die oplicht als de lijn aankomt. */
  (function () {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "draad"); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
    document.body.appendChild(svg);
    var doelen = "main h1, main .label, .afsluiter .label, .cues li .nr, .draaiboek .cue, .vormen .nr, .case-meta, .formulier h2, .spotlijst li";
    var vervolg = null, voetKnop = null;
    var stam, lengte = 0, start = 0, rechtTot = 0, takken = [], punten = [], cta = null, bezig = false;
    var maak = function (n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); svg.appendChild(e); return e; };
    var pagina = function (r) { return { x: r.left + scrollX, y: r.top + scrollY, r: r.right + scrollX, b: r.bottom + scrollY, w: r.width, h: r.height }; };

    function meet() {
      // meet de eindposities: inkom-animaties (verschuiving) tijdelijk uit, anders ligt de tak naast het label
      document.documentElement.classList.add("meten"); void document.body.offsetHeight;
      try { meetNu(); } finally { document.documentElement.classList.remove("meten"); }
    }
    function meetNu() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      takken = []; punten = [];
      var breed = document.querySelector("main .breed");
      if (!breed) return;
      var br = breed.getBoundingClientRect(), pad = parseFloat(getComputedStyle(breed).paddingLeft);
      // hele pixels: een lijn van 2 px op een heel getal valt precies op het pixelraster (ook bij zoom en retina)
      var gx = Math.round(br.left + scrollX + pad / 2), inhoudX = br.left + scrollX + pad, R = Math.round;
      // hoogte van de site zelf, niet van het document: anders duwt de lijnlaag een lege band onder de voet
      var W = document.documentElement.clientWidth, H = document.getElementById("site").offsetHeight;
      svg.setAttribute("width", W); svg.setAttribute("height", H); svg.setAttribute("viewBox", "0 0 " + W + " " + H);

      var knopen = Array.prototype.slice.call(document.querySelectorAll(doelen)).filter(function (e) { return e.offsetParent !== null; }).map(function (e) {
        var r = pagina(e.getBoundingClientRect());
        var lh = parseFloat(getComputedStyle(e).lineHeight) || 40;
        var y = e.tagName === "H1" ? r.y + Math.min(r.h, lh) / 2
              : e.matches(".spotlijst li") ? r.y + parseFloat(getComputedStyle(e).paddingTop) + lh / 2   // midden van de eerste regel
              : r.y + r.h / 2;
        var streep = e.querySelector && e.querySelector(".streep"), tekstX = null;
        if (streep) {
          // midden en begin van de labeltekst zelf (niet van het hele element)
          var tn = Array.prototype.filter.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); }).pop();
          if (tn) { var rg = document.createRange(); rg.selectNodeContents(tn); var tr0 = pagina(rg.getBoundingClientRect()); y = tr0.y + tr0.h / 2; tekstX = tr0.x; }
        }
        var blok = e.closest(".beeldtekst"), media = blok && blok.querySelector("img, video");
        return { el: e, y: R(y), licht: !!e.closest(".licht"), naar: streep ? pagina(streep.getBoundingClientRect()).x : null, tekstX: tekstX,
                 boven: media ? R(Math.min(pagina(media.getBoundingClientRect()).y, r.y) - 30) : null };
      }).sort(function (a, b) { return a.y - b.y; });
      if (!knopen.length) return;
      start = knopen[0].y;

      // eindpunt: de aanvraagknop onderaan (afsluiter) of de verstuurknop
      // eindpunt: de pay-off in de voet (footeroptie 4), anders de aanvraagknop onderaan of de verstuurknop
      var knop = document.querySelector(".voet-slot") || document.querySelector(".afsluiter .knop") || document.querySelector(".formulier .knop");
      cta = knop;
      var d = "M" + gx + " " + start, rr = innerWidth < 760 ? 9 : 14;
      var PO_Y = 0.1194, PO_GAT = 0.0275;   // streephoogte en tussenruimte zoals in het originele logo
      if (knop && knop.classList.contains("voet-slot")) {
        var k = pagina(knop.getBoundingClientRect());
        var ym = R(k.y + k.h * PO_Y); rechtTot = ym - rr;
        d += " V" + rechtTot + " Q" + gx + " " + ym + " " + (gx + rr) + " " + ym + " H" + R(k.x - k.w * PO_GAT);
      } else if (knop) {
        var k = pagina(knop.getBoundingClientRect());
        if (k.x - inhoudX < 12) {
          // niets links van de knop: van links de knop in, op halve hoogte
          // bij de pay-off sluit de lijn aan op het oranje streepje links van "EVERY LITTLE THING" (31/268 van de hoogte)
          var ym = R(knop.classList.contains("voet-slot") ? k.y + k.h * 31 / 268 : k.y + k.h / 2); rechtTot = ym - rr;
          d += " V" + rechtTot + " Q" + gx + " " + ym + " " + (gx + rr) + " " + ym + " H" + R(k.x);
        } else {
          // tekst links van de knop: eronderdoor en van onderen de knop in
          var yb = R(k.b + 26), kx = R(k.x + k.w / 2); rechtTot = yb - rr;
          d += " V" + rechtTot + " Q" + gx + " " + yb + " " + (gx + rr) + " " + yb + " H" + (kx - rr) + " Q" + kx + " " + yb + " " + kx + " " + (yb - rr) + " V" + R(k.b);
        }
      } else { rechtTot = knopen[knopen.length - 1].y; d += " V" + rechtTot; }

      maak("path", { d: d, class: "draad-spoor" });
      stam = maak("path", { d: d, class: "draad-lijn" });
      lengte = stam.getTotalLength();
      stam.style.strokeDasharray = lengte; stam.style.strokeDashoffset = lengte;

      // Doorloop: na "EVERY LITTLE THING" loopt dezelfde lijn verder: rechter streepje, bocht omlaag, midden van de knop in.
      // (Een SVG-pad met een sprong begint zijn streep opnieuw; daarom twee paden met precies dezelfde lijn, die als één animatie tekenen.)
      vervolg = null; voetKnop = document.querySelector(".voet-knop .knop");
      var slot = document.querySelector(".voet-slot");
      if (slot && voetKnop) {
        var sl = pagina(slot.getBoundingClientRect()), kb = pagina(voetKnop.getBoundingClientRect());
        var ry = R(sl.y + sl.h * PO_Y), px = R(sl.r + sl.w * PO_GAT), kcx = R(kb.x + kb.w / 2), kt = R(kb.y), r2 = rr, d2;
        if (kcx - px > 4 * r2) {
          // knop staat rechts: rechtdoor, één bocht omlaag, van boven het midden van de knop in
          d2 = "M" + px + " " + ry + " H" + (kcx - r2) + " Q" + kcx + " " + ry + " " + kcx + " " + (ry + r2) + " V" + kt;
        } else {
          // knop staat eronder (mobiel): streepje naar rechts, omlaag, terug naar het midden, de knop in
          var xe = R(Math.min(sl.r + 44, W - 12)), ym2 = R(sl.b + (kb.y - sl.b) / 2), q = Math.min(r2, Math.floor((kb.y - sl.b) / 4));
          d2 = "M" + px + " " + ry + " H" + (xe - q) + " Q" + xe + " " + ry + " " + xe + " " + (ry + q) + " V" + (ym2 - q) + " Q" + xe + " " + ym2 + " " + (xe - q) + " " + ym2 +
               " H" + (kcx + q) + " Q" + kcx + " " + ym2 + " " + kcx + " " + (ym2 + q) + " V" + kt;
        }
        maak("path", { d: d2, class: "draad-spoor" });
        var p2 = maak("path", { d: d2, class: "draad-lijn" }), l2 = p2.getTotalLength();
        p2.style.strokeDasharray = l2; p2.style.strokeDashoffset = l2;
        vervolg = { el: p2, l: l2, tot: kt };
      }

      // Takken: vertrekken precies uit het midden van de punt (T-aansluiting onder de punt),
      // horizontaal, en eindigen op vaste afstand (GAT) vóór de labeltekst, verticaal op het tekstmidden.
      // Bochten (alleen bij labels naast een beeld) zijn één pad met overal dezelfde radius.
      var GAT = 12;
      document.querySelectorAll(".label.met-tak").forEach(function (l) { l.classList.remove("met-tak"); });
      knopen.forEach(function (n) {
        if (!n.naar || n.tekstX === null) return;
        var eindX = R(n.tekstX - GAT), td, br2 = rr;
        if (n.naar - inhoudX > 24 && n.boven !== null) {
          // label naast een beeld: vanaf de punt boven het beeld langs, bocht omlaag, bocht naar rechts het label in
          var ya = n.boven, ly = n.y, xd = R(n.naar);
          br2 = Math.min(rr, Math.floor((eindX - xd) / 2), Math.floor((ly - ya) / 2));
          td = "M" + gx + " " + ya + " H" + (xd - br2) + " Q" + xd + " " + ya + " " + xd + " " + (ya + br2) +
               " V" + (ly - br2) + " Q" + xd + " " + ly + " " + (xd + br2) + " " + ly + " H" + eindX;
          n.y = ya;   // het knooppunt op de lijn ligt waar de tak vertrekt
        } else {
          td = "M" + gx + " " + n.y + " H" + eindX;
        }
        if (eindX - gx < 8) return;
        n.el.classList.add("met-tak");   // de losse oranje streep van het label wordt de tak
        var t = maak("path", { d: td, class: "draad-tak" });
        var tl = t.getTotalLength(); t.style.strokeDasharray = tl; t.style.strokeDashoffset = tl;
        takken.push({ el: t, y: n.y, l: tl });
      });
      knopen.forEach(function (n) {
        var c = maak("circle", { cx: gx, cy: n.y, r: innerWidth < 760 ? 4.5 : 5.5, class: "draad-punt" + (n.licht ? " op-licht" : "") });
        punten.push({ el: c, y: n.y });
      });
      teken();
    }

    function teken() {
      bezig = false;
      if (!stam) return;
      var tip = rustig ? Infinity : scrollY + innerHeight * 0.75;   // de lijn loopt iets vóór op de lezer
      var recht = rechtTot - start;
      var getekend = Math.max(0, Math.min(recht, tip - start));
      // de laatste bocht naar de knop tekent zich binnen ±120 px scroll, zodat de knop nog in beeld is als hij oplicht
      // ...en is altijd af als je helemaal onderaan bent, ook als het eindpunt laag op de pagina staat
      var venster = Math.max(16, Math.min(120, document.documentElement.scrollHeight - innerHeight * 0.25 - rechtTot - 4));
      var totaal = lengte + (vervolg ? vervolg.l : 0), g = getekend;
      if (vervolg) {
        // één doorlopende beweging: na het rechte stuk gaat het tekenen zonder pauze door tot in de knop,
        // gekoppeld aan het scrollen tot de bovenkant van de knop (en altijd af als je onderaan bent)
        var eindTip = Math.min(vervolg.tot + 40, document.documentElement.scrollHeight - innerHeight * 0.25 - 2);
        if (tip - start > recht) g = recht + Math.min(1, (tip - start - recht) / Math.max(40, eindTip - rechtTot)) * (totaal - recht);
        if (rustig || scrollY + innerHeight >= document.documentElement.scrollHeight - 2 && tip - start > recht) g = totaal;
        getekend = Math.min(lengte, g);
      } else if (tip - start > recht) getekend = Math.min(lengte, recht + (tip - start - recht) / venster * (lengte - recht));
      stam.style.strokeDashoffset = lengte - getekend;
      var bereikt = start + Math.min(getekend, recht);
      takken.forEach(function (t) { var aan = t.y <= bereikt + 1; t.el.classList.toggle("aan", aan); t.el.style.strokeDashoffset = aan ? 0 : t.l; });
      punten.forEach(function (p) { p.el.classList.toggle("aan", p.y <= bereikt + 1); });
      var klaar = getekend >= lengte - 1;
      if (cta) cta.classList.toggle("draad-aan", klaar);
      if (vervolg) {
        var v = Math.max(0, Math.min(vervolg.l, g - lengte));
        vervolg.el.style.strokeDashoffset = vervolg.l - v;
        voetKnop.classList.toggle("draad-aan", v >= vervolg.l - 1);
      }
    }

    addEventListener("scroll", function () { if (!bezig) { bezig = true; requestAnimationFrame(teken); } }, { passive: true });
    var hermeet; var opnieuw = function () { clearTimeout(hermeet); hermeet = setTimeout(meet, 150); };
    addEventListener("resize", opnieuw); addEventListener("load", meet);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(meet);
    if ("ResizeObserver" in window) new ResizeObserver(opnieuw).observe(document.getElementById("site"));
    meet();
  })();

  // Aanvraagformulier: lokaal alleen controleren en bedanken. Verzendroute: zie LEESMIJ.md
  var form = document.getElementById("formulier");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      ["naam", "organisatie", "email", "vraag"].forEach(function (id) {
        var el = document.getElementById(id), goed = el.value.trim() !== "" && (id !== "email" || /\S+@\S+\.\S+/.test(el.value));
        el.setAttribute("aria-invalid", !goed); if (!goed) ok = false;
      });
      document.getElementById("fout").hidden = ok;
      if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
      var data = Object.fromEntries(new FormData(form).entries());
      console.info("Aanvraag (lokaal, niet verstuurd):", data);
      form.hidden = true;
      var b = document.getElementById("bedankt"); b.hidden = false; b.classList.add("zicht"); b.scrollIntoView({ block: "center" }); b.focus();
    });
  }
})();
