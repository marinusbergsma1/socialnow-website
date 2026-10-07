import "./partner-intro.css";
import { useLanguage } from "./i18n/context";

export default function PartnerIntro() {
  const { t } = useLanguage();
  return (
    <section className="h-partner-uitleg">
      <h3>Wat is een partner?</h3>
      <p>{t("Wij verbinden jouw bedrijf met zelfstandige partners die begrijpen wat jij en je klanten nodig hebben. Samen maken we klantvriendelijke producten en brengen we je website, CRM, content en advertenties samen in één gebruiksvriendelijk systeem. Je kunt gratis starten met ons Operation & Management-systeem of kiezen voor een systeem op maat.")}</p>
      <p>Je begint gratis. Kies je voor maatwerk, dan organiseert en betaalt SocialNow B.V. de juiste partners. Je hebt één aanspreekpunt; wij bewaken de kwaliteit.</p>
    </section>
  );
}
