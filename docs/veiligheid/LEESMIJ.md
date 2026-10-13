# Veiligheid en data — publiek handboek

Versie 1.0, 13 oktober 2026. 24 pagina’s, Nederlands.

`maak-handboek.py` maakt `public/documenten/socialnow-veiligheid-en-data-nl.pdf` met ReportLab. Lettertypen: Gilroy Regular en Bold uit de bestaande lokale lettertypebibliotheek. Gebruik `--font-root` om een andere locatie aan te wijzen. Het PDF-bestand bevat de lettertypen; de websitebuild hoeft dit script niet uit te voeren.

`beleidsbronnen.json` is een Nederlandse snapshot uit de publieke juridische TypeScript-bronnen van deze website. De oorspronkelijke beleidsdatums zijn behouden. De hoofdstukken verduidelijken die afspraken; de bijlagen zijn geselecteerde beleidsuittreksels. Bij beleidswijzigingen eerst de snapshot bijwerken, daarna tekst, PDF en versienummer.

De eigendomsclaim geldt voor klantdata, niet voor alle software of auteursrechten op ontwerpen. De veiligheidsbelofte beschrijft maatregelen en grenzen, geen absolute veiligheid of certificering. Geen ondertekende NDA, handtekeningen of vertrouwelijke klantdocumenten opgenomen.

Controle: tekst en links via pypdf; alle 24 pagina’s gerenderd met pdftoppm en zichtbaar gecontroleerd. De SocialNow-logo’s staan steeds op een zwarte kopbalk.
