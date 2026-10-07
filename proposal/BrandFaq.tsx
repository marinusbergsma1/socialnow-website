import { useId } from "react";
import { useLanguage, type Language } from "./i18n/context";
import { getBrandFaq } from "./brand-faq";

export interface BrandFaqProps {
  /** Defaults to the current page language. */
  language?: Language;
  className?: string;
}

export default function BrandFaq({ language, className = "" }: BrandFaqProps) {
  const { language: pageLanguage } = useLanguage();
  const selectedLanguage = language ?? pageLanguage;
  const { heading, items } = getBrandFaq(selectedLanguage);
  const headingId = useId();

  return (
    <section
      className={`h-wrap h-section h-brand-faq ${className}`.trim()}
      aria-labelledby={headingId}
      lang={selectedLanguage}
      translate="no"
    >
      <div className="h-section-heading">
        <h2 id={headingId}>{heading}</h2>
      </div>
      <div style={{ maxWidth: "850px" }}>
        {items.map(({ id, question, answer }) => (
          <details key={id} style={{ borderTop: "1px solid currentColor", padding: "18px 0" }}>
            <summary style={{ cursor: "pointer", fontWeight: 500, lineHeight: 1.5 }}>
              {question}
            </summary>
            <p style={{ marginTop: "12px", lineHeight: 1.65 }}>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
