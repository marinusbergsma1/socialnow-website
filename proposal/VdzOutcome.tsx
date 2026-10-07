import { Link } from "react-router-dom";
import { useLanguage, type Language } from "./i18n/context";

const copy: Record<Language, [string, string, string, string]> = {
  nl: ["Gratis starten. Samen verder bouwen.", "Van 0 online zichtbaarheid naar €100.000 omzet voor VDZ.", "Van nul online zichtbaarheid naar een website, huisstijl, animatie, fotografie en een eigen OS. Die samenwerking leverde €100.000 omzet op voor VDZ Brigade.", "Bekijk het werk voor VDZ"],
  en: ["Start free. Build further together.", "From zero online visibility to €100,000 revenue for VDZ.", "From zero online visibility to a website, visual identity, animation, photography and a dedicated OS. That collaboration generated €100,000 in revenue for VDZ Brigade.", "See our work for VDZ"],
  de: ["Kostenlos starten. Gemeinsam weiterbauen.", "Von keiner Online-Sichtbarkeit zu 100.000 € Umsatz für VDZ.", "Von keiner Online-Sichtbarkeit zu Website, Markenauftritt, Animation, Fotografie und eigenem OS. Diese Zusammenarbeit brachte VDZ Brigade 100.000 € Umsatz.", "Unsere Arbeit für VDZ ansehen"],
  fr: ["Commencez gratuitement. Avançons ensemble.", "D’une visibilité en ligne inexistante à 100 000 € de chiffre d’affaires pour VDZ.", "D’une visibilité en ligne inexistante à un site web, une identité visuelle, une animation, des photos et un OS dédié. Cette collaboration a généré 100 000 € de chiffre d’affaires pour VDZ Brigade.", "Voir notre travail pour VDZ"],
  es: ["Empieza gratis. Sigue creciendo con nosotros.", "De ninguna visibilidad online a 100.000 € de facturación para VDZ.", "De ninguna visibilidad online a un sitio web, identidad visual, animación, fotografía y un OS propio. Esta colaboración generó 100.000 € de facturación para VDZ Brigade.", "Ver nuestro trabajo para VDZ"],
  it: ["Inizia gratis. Costruiamo insieme.", "Da nessuna visibilità online a 100.000 € di fatturato per VDZ.", "Da nessuna visibilità online a sito web, identità visiva, animazione, fotografia e un OS dedicato. Questa collaborazione ha generato 100.000 € di fatturato per VDZ Brigade.", "Scopri il nostro lavoro per VDZ"],
  pt: ["Começa gratuitamente. Vamos construir juntos.", "De nenhuma visibilidade online a 100.000 € de faturação para a VDZ.", "De nenhuma visibilidade online a um website, identidade visual, animação, fotografia e um OS próprio. Esta colaboração gerou 100.000 € de faturação para a VDZ Brigade.", "Ver o nosso trabalho para a VDZ"],
  pl: ["Zacznij bezpłatnie. Budujmy dalej razem.", "Od zerowej widoczności w internecie do 100 000 € przychodu dla VDZ.", "Od zerowej widoczności w internecie do strony, identyfikacji wizualnej, animacji, fotografii i własnego OS. Ta współpraca wygenerowała 100 000 € przychodu dla VDZ Brigade.", "Zobacz naszą pracę dla VDZ"],
  sv: ["Börja gratis. Bygg vidare tillsammans.", "Från ingen synlighet online till 100 000 € i omsättning för VDZ.", "Från ingen synlighet online till webbplats, visuell identitet, animation, fotografi och ett eget OS. Samarbetet gav VDZ Brigade 100 000 € i omsättning.", "Se vårt arbete för VDZ"],
  da: ["Start gratis. Byg videre sammen.", "Fra ingen synlighed online til 100.000 € i omsætning for VDZ.", "Fra ingen synlighed online til hjemmeside, visuel identitet, animation, fotografi og eget OS. Samarbejdet skabte 100.000 € i omsætning for VDZ Brigade.", "Se vores arbejde for VDZ"],
};

export default function VdzOutcome() {
  const { language } = useLanguage();
  const [label, title, text, link] = copy[language];
  return <section className="h-partner-uitleg" lang={language} translate="no">
    <p className="h-eyebrow">{label}</p>
    <h3>{title}</h3>
    <p>{text}</p>
    <Link to="/project/vdz-brigade-website" style={{ color: "#176b38", textDecoration: "underline", textUnderlineOffset: 4 }}>{link} ↗</Link>
  </section>;
}
