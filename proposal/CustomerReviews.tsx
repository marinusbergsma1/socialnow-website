import React from "react";
import { Heading } from "./ui";
import { REVIEWS_URL } from "./os-entry";
import { ArrowUpRight, Quote } from "lucide-react";

// Bestaande letterlijke klantreacties uit components/BlijeKlanten.tsx.
export const customerReviews = [
  {
    name: "Albert Deltour",
    company: "Light Art Collection",
    website: "https://lightart-collection.com/",
    logo: false,
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
            Wat onze klanten
            <br />
            <span>zeggen.</span>
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
      <div className="h-review-cards" translate="no">
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
                <a href={review.website} target="_blank" rel="noopener noreferrer">{review.company}</a>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function HeroReview() {
  const review = customerReviews[0];
  return <a className="h-hero-review" href={review.website} target="_blank" rel="noopener noreferrer">
    <img src={review.image} alt="" width="34" height="34" loading="lazy" />
    <span><q lang="en" translate="no">{review.text}</q><span translate="no">{review.name} · {review.company} <ArrowUpRight size={12} aria-hidden="true" /></span></span>
  </a>;
}
