// Tabellen voor de php2shell-check. Bron: /Volumes/WORK/02-SOCIALNOW/php-check/ONDERZOEK.md (22 oktober 2026),
// sectie 3. De lijsten van Red Hat, AlmaLinux, Rocky en Debian 11 lopen nog; lees ze elke dag na en werk
// `bijgewerkt` bij. Een nieuwe rij hier is een commit die iemand leest.

export const BIJGEWERKT = "2026-10-22";

// Eerste herstelde upstream-release per tak (php.net, 21 oktober 2026).
export const HERSTELD = { "8.5": "8.5.12", "8.4": "8.4.27", "8.3": "8.3.36", "8.2": "8.2.35" };

// Ubuntu zet de fix terug in zijn eigen build en laat het upstream-nummer staan. De header noemt de
// hele build, dus hier kunnen we exact vergelijken (dpkg-volgorde). Sleutel = upstream-deel van de build.
export const UBUNTU = {
  "8.5.9": { release: "26.10", hersteld: "8.5.9-0ubuntu2.1" },
  "8.5.4": { release: "26.04 LTS", hersteld: "8.5.4-0ubuntu1.5" },
  "8.3.6": { release: "24.04 LTS", hersteld: "8.3.6-0ubuntu0.24.04.13" },
  "8.1.2": { release: "22.04 LTS", hersteld: "8.1.2-1ubuntu2.28" },
  "7.4.3": { release: "20.04 (Ubuntu Pro)", hersteld: "7.4.3-4ubuntu2.29+esm5" },
  "7.2.24": { release: "18.04 (Ubuntu Pro)", hersteld: "7.2.24-0ubuntu0.18.04.17+esm14" },
  "7.0.33": { release: "16.04 (Ubuntu Pro)", hersteld: "7.0.33-0ubuntu0.16.04.16+esm22" },
  "5.5.9+dfsg": { release: "14.04 (Ubuntu Pro)", hersteld: "5.5.9+dfsg-1ubuntu4.29+esm18" },
};

// Debian 12 en 13 zijn naar de upstream-release gegaan (DLA-4848-1, DSA-6574-1): daar beslist het
// upstream-nummer. Andere Debian-takken (11, php7.4) zijn nog onbekend.
export const DEBIAN_TAKKEN = ["8.2", "8.4"];

// Een gewoon nummer onder de fix is nooit rood: AlmaLinux, Rocky, RHEL, cPanel (ea-php84 8.4.26), CloudLinux
// alt-php en Aikido-images zetten de fix terug en houden het oude nummer (ONDERZOEK.md 3.2). Rood vraagt
// bewijs in de build zelf: Ubuntu, Debian 12/13 of Sury onder de fix. Dat is variant A uit ONDERZOEK.md 5.3.
