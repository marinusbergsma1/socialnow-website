import React from 'react';

/**
 * GenerateButton — getrouwe port van de aangeleverde styled-components knop.
 * Zonder styled-components (niet geïnstalleerd): exact dezelfde CSS, gescoped
 * onder `.sn-generate-btn` en met sn-* keyframe-namen om botsingen te vermijden.
 * De "Generate → Generating" morph triggert op :focus (klik/tab), net als origineel.
 */

interface GenerateButtonProps {
  onClick?: () => void;
  className?: string;
  /** Rusttekst op de knop (default "Generate"). */
  text?: string;
  /** Morph-tekst bij focus/klik (default "Generating"). */
  morphText?: string;
}

// Splitst een string in letter-spans; spaties worden een smalle spacer (animeren niet).
const renderLetters = (s: string) =>
  s.split('').map((ch, i) =>
    ch === ' '
      ? <span key={i} aria-hidden className="btn-space">&nbsp;</span>
      : <span key={i} className="btn-letter">{ch}</span>
  );

const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  className = '',
  text = 'Generate',
  morphText = 'Generating',
}) => {
  const sizer = text.length >= morphText.length ? text : morphText;
  return (
    <div className={`sn-generate-btn ${className}`}>
      <style>{`
        .sn-generate-btn .btn-wrapper {
          position: relative;
          display: inline-block;
        }
        .sn-generate-btn .btn {
          --border-radius: 24px;
          --padding: 4px;
          --transition: 0.4s;
          --button-color: #101010;
          --highlight-color-hue: 142deg; /* SocialNow-groen (#25D366) */

          user-select: none;
          display: flex;
          justify-content: center;
          padding: 0.5em 0.5em 0.5em 1.1em;
          font-family: "Poppins", "Inter", "Segoe UI", sans-serif;
          font-size: 1em;
          font-weight: 400;
          color: inherit;

          background-color: var(--button-color);

          box-shadow:
            inset 0px 1px 1px rgba(255, 255, 255, 0.2),
            inset 0px 2px 2px rgba(255, 255, 255, 0.15),
            inset 0px 4px 4px rgba(255, 255, 255, 0.1),
            inset 0px 8px 8px rgba(255, 255, 255, 0.05),
            inset 0px 16px 16px rgba(255, 255, 255, 0.05),
            0px -1px 1px rgba(0, 0, 0, 0.02),
            0px -2px 2px rgba(0, 0, 0, 0.03),
            0px -4px 4px rgba(0, 0, 0, 0.05),
            0px -8px 8px rgba(0, 0, 0, 0.06),
            0px -16px 16px rgba(0, 0, 0, 0.08);

          border: solid 1px #fff2;
          border-radius: var(--border-radius);
          cursor: pointer;

          transition:
            box-shadow var(--transition),
            border var(--transition),
            background-color var(--transition);
        }
        .sn-generate-btn .btn::before {
          content: "";
          position: absolute;
          top: calc(0px - var(--padding));
          left: calc(0px - var(--padding));
          width: calc(100% + var(--padding) * 2);
          height: calc(100% + var(--padding) * 2);
          border-radius: calc(var(--border-radius) + var(--padding));
          pointer-events: none;
          background-image: linear-gradient(0deg, #0004, #000a);

          z-index: -1;
          transition:
            box-shadow var(--transition),
            filter var(--transition);
          box-shadow:
            0 -8px 8px -6px #0000 inset,
            0 -16px 16px -8px #00000000 inset,
            1px 1px 1px #fff2,
            2px 2px 2px #fff1,
            -1px -1px 1px #0002,
            -2px -2px 2px #0001;
        }
        .sn-generate-btn .btn::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          pointer-events: none;
          background-image: linear-gradient(
            0deg,
            #fff,
            hsl(var(--highlight-color-hue), 100%, 70%),
            hsla(var(--highlight-color-hue), 100%, 70%, 50%),
            8%,
            transparent
          );
          background-position: 0 0;
          opacity: 0;
          transition:
            opacity var(--transition),
            filter var(--transition);
        }

        .sn-generate-btn .btn-letter {
          position: relative;
          display: inline-block;
          color: #fff5;
          animation: sn-letter-anim 2s ease-in-out infinite;
          transition:
            color var(--transition),
            text-shadow var(--transition),
            opacity var(--transition);
        }

        @keyframes sn-letter-anim {
          50% {
            text-shadow: 0 0 3px #fff8;
            color: #fff;
          }
        }

        .sn-generate-btn .btn-svg {
          flex-grow: 1;
          height: 24px;
          margin-right: 0.5rem;
          fill: #e8e8e8;
          animation: sn-flicker 2s linear infinite;
          animation-delay: 0.5s;
          filter: drop-shadow(0 0 2px #fff9);
          transition:
            fill var(--transition),
            filter var(--transition),
            opacity var(--transition);
        }
        @keyframes sn-flicker {
          50% {
            opacity: 0.3;
          }
        }

        .sn-generate-btn .txt-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .sn-generate-btn .txt-sizer {
          visibility: hidden;
          white-space: nowrap;
          pointer-events: none;
        }
        .sn-generate-btn .btn-space {
          display: inline-block;
          width: 0.28em;
        }
        .sn-generate-btn .txt-1,
        .sn-generate-btn .txt-2 {
          position: absolute;
          left: 0;
          white-space: nowrap;
        }
        .sn-generate-btn .txt-1 {
          animation: sn-appear-anim 1s ease-in-out forwards;
        }
        .sn-generate-btn .txt-2 {
          opacity: 0;
        }
        @keyframes sn-appear-anim {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .sn-generate-btn .btn:focus .txt-1 {
          animation: sn-opacity-anim 0.3s ease-in-out forwards;
          animation-delay: 1s;
        }
        .sn-generate-btn .btn:focus .txt-2 {
          animation: sn-opacity-anim 0.3s ease-in-out reverse forwards;
          animation-delay: 1s;
        }
        @keyframes sn-opacity-anim {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        .sn-generate-btn .btn:focus .btn-letter {
          animation:
            sn-focused-letter-anim 1s ease-in-out forwards,
            sn-letter-anim 1.2s ease-in-out infinite;
          animation-delay: 0s, 1s;
        }
        @keyframes sn-focused-letter-anim {
          0%, 100% { filter: blur(0px); }
          50% {
            transform: scale(2);
            filter: blur(10px) brightness(150%)
              drop-shadow(-36px 12px 12px hsl(var(--highlight-color-hue), 100%, 70%));
          }
        }
        .sn-generate-btn .btn:focus .btn-svg {
          animation-duration: 1.2s;
          animation-delay: 0.2s;
        }

        .sn-generate-btn .btn:focus::before {
          box-shadow:
            0 -8px 12px -6px #fff3 inset,
            0 -16px 16px -8px hsla(var(--highlight-color-hue), 100%, 70%, 20%) inset,
            1px 1px 1px #fff3,
            2px 2px 2px #fff1,
            -1px -1px 1px #0002,
            -2px -2px 2px #0001;
        }
        .sn-generate-btn .btn:focus::after {
          opacity: 0.6;
          mask-image: linear-gradient(0deg, #fff, transparent);
          filter: brightness(100%);
        }

        .sn-generate-btn .btn-letter:nth-child(1),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(1) { animation-delay: 0s; }
        .sn-generate-btn .btn-letter:nth-child(2),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(2) { animation-delay: 0.08s; }
        .sn-generate-btn .btn-letter:nth-child(3),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(3) { animation-delay: 0.16s; }
        .sn-generate-btn .btn-letter:nth-child(4),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(4) { animation-delay: 0.24s; }
        .sn-generate-btn .btn-letter:nth-child(5),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(5) { animation-delay: 0.32s; }
        .sn-generate-btn .btn-letter:nth-child(6),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(6) { animation-delay: 0.4s; }
        .sn-generate-btn .btn-letter:nth-child(7),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(7) { animation-delay: 0.48s; }
        .sn-generate-btn .btn-letter:nth-child(8),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(8) { animation-delay: 0.56s; }
        .sn-generate-btn .btn-letter:nth-child(9),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(9) { animation-delay: 0.64s; }
        .sn-generate-btn .btn-letter:nth-child(10),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(10) { animation-delay: 0.72s; }
        .sn-generate-btn .btn-letter:nth-child(11),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(11) { animation-delay: 0.8s; }
        .sn-generate-btn .btn-letter:nth-child(12),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(12) { animation-delay: 0.88s; }
        .sn-generate-btn .btn-letter:nth-child(13),
        .sn-generate-btn .btn:focus .btn-letter:nth-child(13) { animation-delay: 0.96s; }

        .sn-generate-btn .btn:active {
          border: solid 1px hsla(var(--highlight-color-hue), 100%, 80%, 70%);
          background-color: hsla(var(--highlight-color-hue), 50%, 20%, 0.5);
        }
        .sn-generate-btn .btn:active::before {
          box-shadow:
            0 -8px 12px -6px #fffa inset,
            0 -16px 16px -8px hsla(var(--highlight-color-hue), 100%, 70%, 80%) inset,
            1px 1px 1px #fff4,
            2px 2px 2px #fff2,
            -1px -1px 1px #0002,
            -2px -2px 2px #0001;
        }
        .sn-generate-btn .btn:active::after {
          opacity: 1;
          mask-image: linear-gradient(0deg, #fff, transparent);
          filter: brightness(200%);
        }
        .sn-generate-btn .btn:active .btn-letter {
          text-shadow: 0 0 1px hsla(var(--highlight-color-hue), 100%, 90%, 90%);
          animation: none;
        }

        .sn-generate-btn .btn:hover {
          border: solid 1px hsla(var(--highlight-color-hue), 100%, 80%, 40%);
        }
        .sn-generate-btn .btn:hover::before {
          box-shadow:
            0 -8px 8px -6px #fffa inset,
            0 -16px 16px -8px hsla(var(--highlight-color-hue), 100%, 70%, 30%) inset,
            1px 1px 1px #fff2,
            2px 2px 2px #fff1,
            -1px -1px 1px #0002,
            -2px -2px 2px #0001;
        }
        .sn-generate-btn .btn:hover::after {
          opacity: 1;
          mask-image: linear-gradient(0deg, #fff, transparent);
        }
        .sn-generate-btn .btn:hover .btn-svg {
          fill: #fff;
          filter: drop-shadow(0 0 3px hsl(var(--highlight-color-hue), 100%, 70%))
            drop-shadow(0 -4px 6px #0009);
          animation: none;
        }
      `}</style>

      <div className="btn-wrapper">
        <button className="btn" type="button" onClick={onClick}>
          <svg className="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
          <div className="txt-wrapper">
            <span className="txt-sizer" aria-hidden="true">{sizer}</span>
            <div className="txt-1">{renderLetters(text)}</div>
            <div className="txt-2">{renderLetters(morphText)}</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GenerateButton;
