import React from "react";
import { Heading } from "./ui";
import { REVIEWS_URL } from "./os-entry";
import { ArrowUpRight, Quote } from "lucide-react";

// Bestaande letterlijke klantreacties uit components/BlijeKlanten.tsx.
export const customerReviews = [
  {
    name: "Ellen Sluijs",
    company: "kWh Garant",
    image: "/images/Ellen-Sluijs.webp",
    text: "Wij zijn heel erg blij met Marinus. Denkt goed mee en levert op tijd. Topper!",
  },
  {
    name: "VDZ Brigade",
    company: "Website en huisstijl",
    image: "/images/klantlogos/vdz-brigade.svg",
    logo: true,
    text: "Zeer tevreden over dit bedrijf. Wat deze mannen neerzetten in zo’n korte tijd ongelofelijk. Wij gaan zomaar niet weg. Echt een aanrader. Inmiddels al zakenrelaties doorgestuurd. Ga zo door!!",
  },
  {
    name: "Hussein Awqati",
    company: "Divine Machines",
    image: "/images/Hussein.webp",
    text: "Erg tevreden met de ervaring en kennis van de team van socialnow. Via via zijn wij in contact gekomen en sindsdien is socialnow de designer van Divine Machines. Ga zo door!",
  },
  {
    name: "Albert Deltour",
    company: "Light Art Collection",
    image: "/images/66ed2e6a48aae627d6698e31-Albert-Deltour.webp",
    text: "From ambitious and talented intern to a reliable partner is how I would describe Marinus.",
  },
];
export default function CustomerReviews() {
  return (
    <section
      className="h-section h-wrap h-customer-reviews"
      id="ervaring"
      aria-labelledby="customer-reviews-title"
    >
      <Heading
        id="customer-reviews-title"
        label="Klantreacties"
        title={
          <>
            De mensen achter
            <br />
            <span>ons werk.</span>
          </>
        }
      >
        <a
          className="h-text-link"
          href={REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Bekijk de reviews op Google <ArrowUpRight size={17} />
        </a>
      </Heading>
      <div className="h-review-cards">
        {customerReviews.map((review) => (
          <figure key={review.name}>
            <Quote size={24} aria-hidden="true" />
            <blockquote lang={review.name === "Albert Deltour" ? "en" : "nl"}>
              {review.text}
            </blockquote>
            <figcaption>
              <img
                src={review.image}
                alt=""
                className={review.logo ? "h-review-logo" : ""}
                width="56"
                height="56"
                loading="lazy"
              />
              <span>
                <strong>{review.name}</strong>
                <span>{review.company}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
