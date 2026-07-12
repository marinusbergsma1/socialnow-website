import React from 'react';
import GenerateButton from './GenerateButton';

/**
 * BentoFeaturesSection — getrouwe port van de aangeleverde Aceternity-bento tiles.
 * Kaart-styling (glass morphism), SVG-beams, grafieken, dots en cursors zijn
 * 1-op-1 overgenomen; alleen de teksten zijn aangepast op de SocialNow-boodschap.
 * Next.js-specifieke bits (<Image>, tsparticles) zijn vervangen door plain equivalenten.
 */

/* ------------------------------------------------------------------ */
/* Platform-iconen (exact uit de aangeleverde code)                    */
/* ------------------------------------------------------------------ */

const IconInstagram = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
    <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#ig_p0)" />
    <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#ig_p1)" />
    <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#ig_p2)" />
    <path d="M23 10.5C23 11.3284 22.3284 12 21.5 12C20.6716 12 20 11.3284 20 10.5C20 9.67157 20.6716 9 21.5 9C22.3284 9 23 9.67157 23 10.5Z" fill="white" />
    <path fillRule="evenodd" clipRule="evenodd" d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21ZM16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z" fill="white" />
    <path fillRule="evenodd" clipRule="evenodd" d="M6 15.6C6 12.2397 6 10.5595 6.65396 9.27606C7.2292 8.14708 8.14708 7.2292 9.27606 6.65396C10.5595 6 12.2397 6 15.6 6H16.4C19.7603 6 21.4405 6 22.7239 6.65396C23.8529 7.2292 24.7708 8.14708 25.346 9.27606C26 10.5595 26 12.2397 26 15.6V16.4C26 19.7603 26 21.4405 25.346 22.7239C24.7708 23.8529 23.8529 24.7708 22.7239 25.346C21.4405 26 19.7603 26 16.4 26H15.6C12.2397 26 10.5595 26 9.27606 25.346C8.14708 24.7708 7.2292 23.8529 6.65396 22.7239C6 21.4405 6 19.7603 6 16.4V15.6ZM15.6 8H16.4C18.1132 8 19.2777 8.00156 20.1779 8.0751C21.0548 8.14674 21.5032 8.27659 21.816 8.43597C22.5686 8.81947 23.1805 9.43139 23.564 10.184C23.7234 10.4968 23.8533 10.9452 23.9249 11.8221C23.9984 12.7223 24 13.8868 24 15.6V16.4C24 18.1132 23.9984 19.2777 23.9249 20.1779C23.8533 21.0548 23.7234 21.5032 23.564 21.816C23.1805 22.5686 22.5686 23.1805 21.816 23.564C21.5032 23.7234 21.0548 23.8533 20.1779 23.9249C19.2777 23.9984 18.1132 24 16.4 24H15.6C13.8868 24 12.7223 23.9984 11.8221 23.9249C10.9452 23.8533 10.4968 23.7234 10.184 23.564C9.43139 23.1805 8.81947 22.5686 8.43597 21.816C8.27659 21.5032 8.14674 21.0548 8.0751 20.1779C8.00156 19.2777 8 18.1132 8 16.4V15.6C8 13.8868 8.00156 12.7223 8.0751 11.8221C8.14674 10.9452 8.27659 10.4968 8.43597 10.184C8.81947 9.43139 9.43139 8.81947 10.184 8.43597C10.4968 8.27659 10.9452 8.14674 11.8221 8.0751C12.7223 8.00156 13.8868 8 15.6 8Z" fill="white" />
    <defs>
      <radialGradient id="ig_p0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 23) rotate(-55.3758) scale(25.5196)">
        <stop stopColor="#B13589" /><stop offset="0.79309" stopColor="#C62F94" /><stop offset="1" stopColor="#8A3AC8" />
      </radialGradient>
      <radialGradient id="ig_p1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11 31) rotate(-65.1363) scale(22.5942)">
        <stop stopColor="#E0E8B7" /><stop offset="0.444662" stopColor="#FB8A2E" /><stop offset="0.71474" stopColor="#E2425C" /><stop offset="1" stopColor="#E2425C" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ig_p2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.500002 3) rotate(-8.1301) scale(38.8909 8.31836)">
        <stop offset="0.156701" stopColor="#406ADC" /><stop offset="0.467799" stopColor="#6A45BE" /><stop offset="1" stopColor="#6A45BE" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

const IconTikTok = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <path d="M8.45095 19.7926C8.60723 18.4987 9.1379 17.7743 10.1379 17.0317C11.5688 16.0259 13.3561 16.5948 13.3561 16.5948V13.2197C13.7907 13.2085 14.2254 13.2343 14.6551 13.2966V17.6401C14.6551 17.6401 12.8683 17.0712 11.4375 18.0775C10.438 18.8196 9.90623 19.5446 9.7505 20.8385C9.74562 21.5411 9.87747 22.4595 10.4847 23.2536C10.3345 23.1766 10.1815 23.0889 10.0256 22.9905C8.68807 22.0923 8.44444 20.7449 8.45095 19.7926ZM22.0352 6.97898C21.0509 5.90039 20.6786 4.81139 20.5441 4.04639H21.7823C21.7823 4.04639 21.5354 6.05224 23.3347 8.02482L23.3597 8.05134C22.8747 7.7463 22.43 7.38624 22.0352 6.97898ZM28 10.0369V14.293C28 14.293 26.42 14.2312 25.2507 13.9337C23.6179 13.5176 22.5685 12.8795 22.5685 12.8795C22.5685 12.8795 21.8436 12.4245 21.785 12.3928V21.1817C21.785 21.6711 21.651 22.8932 21.2424 23.9125C20.709 25.246 19.8859 26.1212 19.7345 26.3001C19.7345 26.3001 18.7334 27.4832 16.9672 28.28C15.3752 28.9987 13.9774 28.9805 13.5596 28.9987C13.5596 28.9987 11.1434 29.0944 8.96915 27.6814C8.49898 27.3699 8.06011 27.0172 7.6582 26.6277L7.66906 26.6355C9.84383 28.0485 12.2595 27.9528 12.2595 27.9528C12.6779 27.9346 14.0756 27.9528 15.6671 27.2341C17.4317 26.4374 18.4344 25.2543 18.4344 25.2543C18.5842 25.0754 19.4111 24.2001 19.9423 22.8662C20.3498 21.8474 20.4849 20.6247 20.4849 20.1354V11.3475C20.5435 11.3797 21.2679 11.8347 21.2679 11.8347C21.2679 11.8347 22.3179 12.4734 23.9506 12.8889C25.1204 13.1864 26.7 13.2483 26.7 13.2483V9.91314C27.2404 10.0343 27.7011 10.0671 28 10.0369Z" fill="#EE1D52" />
    <path d="M26.7009 9.91314V13.2472C26.7009 13.2472 25.1213 13.1853 23.9515 12.8879C22.3188 12.4718 21.2688 11.8337 21.2688 11.8337C21.2688 11.8337 20.5444 11.3787 20.4858 11.3464V20.1364C20.4858 20.6258 20.3518 21.8484 19.9432 22.8672C19.4098 24.2012 18.5867 25.0764 18.4353 25.2553C18.4353 25.2553 17.4337 26.4384 15.668 27.2352C14.0765 27.9539 12.6788 27.9357 12.2604 27.9539C12.2604 27.9539 9.84473 28.0496 7.66995 26.6366L7.6591 26.6288C7.42949 26.4064 7.21336 26.1717 7.01177 25.9257C6.31777 25.0795 5.89237 24.0789 5.78547 23.7934C5.78529 23.7922 5.78529 23.791 5.78547 23.7898C5.61347 23.2937 5.25209 22.1022 5.30147 20.9482C5.38883 18.9122 6.10507 17.6625 6.29444 17.3494C6.79597 16.4957 7.44828 15.7318 8.22233 15.0919C8.90538 14.5396 9.6796 14.1002 10.5132 13.7917C11.4144 13.4295 12.3794 13.2353 13.3565 13.2197V16.5948C13.3565 16.5948 11.5691 16.028 10.1388 17.0317C9.13879 17.7743 8.60812 18.4987 8.45185 19.7926C8.44534 20.7449 8.68897 22.0923 10.0254 22.991C10.1813 23.0898 10.3343 23.1775 10.4845 23.2541C10.7179 23.5576 11.0021 23.8221 11.3255 24.0368C12.631 24.8632 13.7249 24.9209 15.1238 24.3842C16.0565 24.0254 16.7586 23.2167 17.0842 22.3206C17.2888 21.7611 17.2861 21.1978 17.2861 20.6154V4.04639H20.5417C20.6763 4.81139 21.0485 5.90039 22.0328 6.97898C22.4276 7.38624 22.8724 7.7463 23.3573 8.05134C23.5006 8.19955 24.2331 8.93231 25.1734 9.38216C25.6596 9.61469 26.1722 9.79285 26.7009 9.91314Z" fill="#000000" />
    <path d="M4.48926 22.7568V22.7594L4.57004 22.9784C4.56076 22.9529 4.53074 22.8754 4.48926 22.7568Z" fill="#69C9D0" />
    <path d="M10.5128 13.7916C9.67919 14.1002 8.90498 14.5396 8.22192 15.0918C7.44763 15.7332 6.79548 16.4987 6.29458 17.354C6.10521 17.6661 5.38897 18.9168 5.30161 20.9528C5.25223 22.1068 5.61361 23.2983 5.78561 23.7944C5.78543 23.7956 5.78543 23.7968 5.78561 23.798C5.89413 24.081 6.31791 25.0815 7.01191 25.9303C7.2135 26.1763 7.42963 26.4111 7.65924 26.6334C6.92357 26.1457 6.26746 25.5562 5.71236 24.8839C5.02433 24.0451 4.60001 23.0549 4.48932 22.7626C4.48919 22.7605 4.48919 22.7584 4.48932 22.7564V22.7527C4.31677 22.2571 3.95431 21.0651 4.00477 19.9096C4.09213 17.8736 4.80838 16.6239 4.99775 16.3108C5.4985 15.4553 6.15067 14.6898 6.92509 14.0486C7.608 13.4961 8.38225 13.0567 9.21598 12.7484C9.73602 12.5416 10.2778 12.3891 10.8319 12.2934C11.6669 12.1537 12.5198 12.1415 13.3588 12.2575V13.2196C12.3808 13.2349 11.4148 13.4291 10.5128 13.7916Z" fill="#69C9D0" />
    <path d="M20.5438 4.04635H17.2881V20.6159C17.2881 21.1983 17.2881 21.76 17.0863 22.3211C16.7575 23.2167 16.058 24.0253 15.1258 24.3842C13.7265 24.923 12.6326 24.8632 11.3276 24.0368C11.0036 23.823 10.7187 23.5594 10.4844 23.2567C11.5962 23.8251 12.5913 23.8152 13.8241 23.341C14.7558 22.9821 15.4563 22.1734 15.784 21.2774C15.9891 20.7178 15.9864 20.1546 15.9864 19.5726V3H20.4819C20.4819 3 20.4315 3.41188 20.5438 4.04635ZM26.7002 8.99104V9.9131C26.1725 9.79263 25.6609 9.61447 25.1755 9.38213C24.2352 8.93228 23.5026 8.19952 23.3594 8.0513C23.5256 8.1559 23.6981 8.25106 23.8759 8.33629C25.0192 8.88339 26.1451 9.04669 26.7002 8.99104Z" fill="#69C9D0" />
  </svg>
);

const IconTwitter = () => (
  <svg viewBox="0 -4 48 48" version="1.1" className="h-full w-full">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-300.000000, -164.000000)" fill="#00AAEC">
        <path d="M348,168.735283 C346.236309,169.538462 344.337383,170.081618 342.345483,170.324305 C344.379644,169.076201 345.940482,167.097147 346.675823,164.739617 C344.771263,165.895269 342.666667,166.736006 340.418384,167.18671 C338.626519,165.224991 336.065504,164 333.231203,164 C327.796443,164 323.387216,168.521488 323.387216,174.097508 C323.387216,174.88913 323.471738,175.657638 323.640782,176.397255 C315.456242,175.975442 308.201444,171.959552 303.341433,165.843265 C302.493397,167.339834 302.008804,169.076201 302.008804,170.925244 C302.008804,174.426869 303.747139,177.518238 306.389857,179.329722 C304.778306,179.280607 303.256911,178.821235 301.9271,178.070061 L301.9271,178.194294 C301.9271,183.08848 305.322064,187.17082 309.8299,188.095341 C309.004402,188.33225 308.133826,188.450704 307.235077,188.450704 C306.601162,188.450704 305.981335,188.390033 305.381229,188.271578 C306.634971,192.28169 310.269414,195.2026 314.580032,195.280607 C311.210424,197.99061 306.961789,199.605634 302.349709,199.605634 C301.555203,199.605634 300.769149,199.559408 300,199.466956 C304.358514,202.327194 309.53689,204 315.095615,204 C333.211481,204 343.114633,188.615385 343.114633,175.270495 C343.114633,174.831347 343.106181,174.392199 343.089276,173.961719 C345.013559,172.537378 346.684275,170.760563 348,168.735283" />
      </g>
    </g>
  </svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 48 48" version="1.1" className="h-full w-full">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-200.000000, -160.000000)" fill="#4460A0">
        <path d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z" />
      </g>
    </g>
  </svg>
);

const IconMessenger = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" className="w-full h-full">
    <g clipPath="url(#msg_clip)">
      <path fill="url(#msg_b)" d="M0 0h18v18H0V0Z" />
      <path fill="#F0F3FA" d="M11.612 5.2c-.984 0-1.753.743-2.45 1.688C8.205 5.666 7.406 5.2 6.448 5.2 4.496 5.2 3 7.749 3 10.447c0 1.688.814 2.753 2.178 2.753.981 0 1.687-.464 2.942-2.665l.883-1.565c.126.204.258.424.398.66l.589.993c1.146 1.924 1.784 2.577 2.942 2.577 1.329 0 2.068-1.08 2.068-2.802C15 7.573 13.47 5.2 11.612 5.2ZM7.163 9.94c-1.017 1.6-1.37 1.958-1.936 1.958-.583 0-.93-.514-.93-1.43 0-1.958.974-3.96 2.134-3.96.629 0 1.154.363 1.958 1.518A165.377 165.377 0 0 0 7.163 9.94Zm3.84-.202-.704-1.177a25.45 25.45 0 0 0-.548-.858c.634-.981 1.157-1.471 1.779-1.471 1.292 0 2.326 1.909 2.326 4.254 0 .893-.292 1.412-.896 1.412-.58 0-.857-.384-1.957-2.16Z" />
      <path fill="url(#msg_c)" fillRule="evenodd" d="m9 8.975-.61-.948c-.409.63-.809 1.253-1.003 1.56l.81.81L9 8.975Z" clipRule="evenodd" />
      <path fill="url(#msg_d)" fillRule="evenodd" d="M10.904 6.412c-.405.222-.845.82-1.155 1.293l-.586-.818c.44-.599.906-1.108 1.43-1.405l.311.93Z" clipRule="evenodd" />
    </g>
    <defs>
      <linearGradient id="msg_b" x1="9.281" x2="9.281" y1="16" y2="-.149" gradientUnits="userSpaceOnUse"><stop stopColor="#0869E1" /><stop offset="1" stopColor="#0081FA" /></linearGradient>
      <linearGradient id="msg_c" x1="8.719" x2="7.757" y1="8.561" y2="9.888" gradientUnits="userSpaceOnUse"><stop stopOpacity=".15" /><stop offset="1" stopOpacity="0" /></linearGradient>
      <linearGradient id="msg_d" x1="9.489" x2="10.592" y1="7.168" y2="6.089" gradientUnits="userSpaceOnUse"><stop stopOpacity=".1" /><stop offset="1" stopOpacity="0" /></linearGradient>
      <clipPath id="msg_clip"><path fill="#fff" d="M0 0h18v18H0z" /></clipPath>
    </defs>
  </svg>
);

const IconLinkedIn = () => (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g fill="none">
      <path d="M0 18.338C0 8.216 8.474 0 18.92 0h218.16C247.53 0 256 8.216 256 18.338v219.327C256 247.79 247.53 256 237.08 256H18.92C8.475 256 0 247.791 0 237.668V18.335z" fill="#069" />
      <path d="M77.796 214.238V98.986H39.488v115.252H77.8zM58.65 83.253c13.356 0 21.671-8.85 21.671-19.91-.25-11.312-8.315-19.915-21.417-19.915-13.111 0-21.674 8.603-21.674 19.914 0 11.06 8.312 19.91 21.169 19.91h.248zM99 214.238h38.305v-64.355c0-3.44.25-6.889 1.262-9.346 2.768-6.885 9.071-14.012 19.656-14.012 13.858 0 19.405 10.568 19.405 26.063v61.65h38.304v-66.082c0-35.399-18.896-51.872-44.099-51.872-20.663 0-29.738 11.549-34.78 19.415h.255V98.99H99.002c.5 10.812-.003 115.252-.003 115.252z" fill="#ffffff" />
    </g>
  </svg>
);

const IconSlack = () => (
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" className="w-full h-full">
    <g fillRule="evenodd" clipRule="evenodd">
      <path fill="#E01E5A" d="M2.471 11.318a1.474 1.474 0 001.47-1.471v-1.47h-1.47A1.474 1.474 0 001 9.846c.001.811.659 1.469 1.47 1.47zm3.682-2.942a1.474 1.474 0 00-1.47 1.471v3.683c.002.811.66 1.468 1.47 1.47a1.474 1.474 0 001.47-1.47V9.846a1.474 1.474 0 00-1.47-1.47z" />
      <path fill="#36C5F0" d="M4.683 2.471c.001.811.659 1.469 1.47 1.47h1.47v-1.47A1.474 1.474 0 006.154 1a1.474 1.474 0 00-1.47 1.47zm2.94 3.682a1.474 1.474 0 00-1.47-1.47H2.47A1.474 1.474 0 001 6.153c.002.812.66 1.469 1.47 1.47h3.684a1.474 1.474 0 001.47-1.47z" />
      <path fill="#2EB67D" d="M9.847 7.624a1.474 1.474 0 001.47-1.47V2.47A1.474 1.474 0 009.848 1a1.474 1.474 0 00-1.47 1.47v3.684c.002.81.659 1.468 1.47 1.47zm3.682-2.941a1.474 1.474 0 00-1.47 1.47v1.47h1.47A1.474 1.474 0 0015 6.154a1.474 1.474 0 00-1.47-1.47z" />
      <path fill="#ECB22E" d="M8.377 9.847c.002.811.659 1.469 1.47 1.47h3.683A1.474 1.474 0 0015 9.848a1.474 1.474 0 00-1.47-1.47H9.847a1.474 1.474 0 00-1.47 1.47zm2.94 3.682a1.474 1.474 0 00-1.47-1.47h-1.47v1.47c.002.812.659 1.469 1.47 1.47a1.474 1.474 0 001.47-1.47z" />
    </g>
  </svg>
);

/* Icon-box wrapper — exacte classes uit de aangeleverde code */
const IconBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="flex items-center justify-center h-16 w-16 rounded-lg border-2 bg-[rgba(40,40,40)] relative
    border-[rgba(255,_255,_255,_0.20)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)_inset]
    flex-shrink-0
    hover:scale-[0.98] transition duration-200
    "
  >
    <div className="h-8 w-8 rounded-md overflow-hidden">{children}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* AI-logo's (exact uit de aangeleverde code)                          */
/* ------------------------------------------------------------------ */

const AiClaude = () => (
  <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 512" className="h-4 w-4">
    <rect fill="#CC9B7A" width="512" height="512" rx="104.187" ry="105.042" />
    <path fill="#1F1F1E" fillRule="nonzero" d="M318.663 149.787h-43.368l78.952 212.423 43.368.004-78.952-212.427zm-125.326 0l-78.952 212.427h44.255l15.932-44.608 82.846-.004 16.107 44.612h44.255l-79.126-212.427h-45.317zm-4.251 128.341l26.91-74.701 27.083 74.701h-53.993z" />
  </svg>
);

const AiBot = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.75 14a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 .75-.75Zm4.5 0a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 .75-.75Z" />
    <path d="M12 2c2.214 0 4.248.657 5.747 1.756.136.099.268.204.397.312.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086l.633 1.478.043.022A4.75 4.75 0 0 1 24 15.222v1.028c0 .529-.309.987-.565 1.293-.28.336-.636.653-.966.918a13.84 13.84 0 0 1-1.299.911l-.024.015-.006.004-.039.025c-.223.135-.45.264-.68.386-.46.245-1.122.571-1.941.895C16.845 21.344 14.561 22 12 22c-2.561 0-4.845-.656-6.479-1.303a19.046 19.046 0 0 1-1.942-.894 14.081 14.081 0 0 1-.535-.3l-.144-.087-.04-.025-.006-.004-.024-.015a13.16 13.16 0 0 1-1.299-.911 6.913 6.913 0 0 1-.967-.918C.31 17.237 0 16.779 0 16.25v-1.028a4.75 4.75 0 0 1 2.626-4.248l.043-.022.633-1.478a10.195 10.195 0 0 1-.052-1.086c0-1.331.282-2.498 1.132-3.368.397-.406.89-.717 1.474-.952.129-.108.261-.213.397-.312C7.752 2.657 9.786 2 12 2Zm-8 9.654v6.669a17.59 17.59 0 0 0 2.073.98C7.595 19.906 9.686 20.5 12 20.5c2.314 0 4.405-.594 5.927-1.197a17.59 17.59 0 0 0 2.073-.98v-6.669l-.038-.09c-.046.061-.095.12-.145.177-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.544-3.508-1.492a4.323 4.323 0 0 1-.355-.508h-.344a4.323 4.323 0 0 1-.355.508C10.704 12.456 9.555 13 7.965 13c-1.725 0-2.989-.359-3.782-1.259a3.026 3.026 0 0 1-.145-.177Zm6.309-1.092c.445-.547.708-1.334.851-2.301.057-.357.087-.718.09-1.079v-.031c-.001-.762-.166-1.26-.43-1.568l-.008-.01c-.341-.391-1.046-.689-2.533-.529-1.505.163-2.347.537-2.824 1.024-.462.473-.705 1.18-.705 2.32 0 .605.044 1.087.135 1.472.092.384.231.672.423.89.365.413 1.084.75 2.657.75.91 0 1.527-.223 1.964-.564.14-.11.268-.235.38-.374Zm2.504-2.497c.136 1.057.403 1.913.878 2.497.442.545 1.134.938 2.344.938 1.573 0 2.292-.337 2.657-.751.384-.435.558-1.151.558-2.361 0-1.14-.243-1.847-.705-2.319-.477-.488-1.318-.862-2.824-1.025-1.487-.161-2.192.139-2.533.529-.268.308-.437.808-.438 1.578v.02c.002.299.023.598.063.894Z" />
  </svg>
);

const AiOpenAI = () => (
  <svg className="h-8 w-8" width="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26.153 11.46a6.888 6.888 0 0 0-.608-5.73 7.117 7.117 0 0 0-3.29-2.93 7.238 7.238 0 0 0-4.41-.454 7.065 7.065 0 0 0-2.41-1.742A7.15 7.15 0 0 0 12.514 0a7.216 7.216 0 0 0-4.217 1.346 7.061 7.061 0 0 0-2.603 3.539 7.12 7.12 0 0 0-2.734 1.188A7.012 7.012 0 0 0 .966 8.268a6.979 6.979 0 0 0 .88 8.273 6.89 6.89 0 0 0 .607 5.729 7.117 7.117 0 0 0 3.29 2.93 7.238 7.238 0 0 0 4.41.454 7.061 7.061 0 0 0 2.409 1.742c.92.404 1.916.61 2.923.604a7.215 7.215 0 0 0 4.22-1.345 7.06 7.06 0 0 0 2.605-3.543 7.116 7.116 0 0 0 2.734-1.187 7.01 7.01 0 0 0 1.993-2.196 6.978 6.978 0 0 0-.884-8.27Zm-10.61 14.71c-1.412 0-2.505-.428-3.46-1.215.043-.023.119-.064.168-.094l5.65-3.22a.911.911 0 0 0 .464-.793v-7.86l2.389 1.36a.087.087 0 0 1 .046.065v6.508c0 2.952-2.491 5.248-5.257 5.248ZM4.062 21.354a5.17 5.17 0 0 1-.635-3.516c.042.025.115.07.168.1l5.65 3.22a.928.928 0 0 0 .928 0l6.898-3.93v2.72a.083.083 0 0 1-.034.072l-5.711 3.255a5.386 5.386 0 0 1-4.035.522 5.315 5.315 0 0 1-3.23-2.443ZM2.573 9.184a5.283 5.283 0 0 1 2.768-2.301V13.515a.895.895 0 0 0 .464.793l6.897 3.93-2.388 1.36a.087.087 0 0 1-.08.008L4.52 16.349a5.262 5.262 0 0 1-2.475-3.185 5.192 5.192 0 0 1 .527-3.98Zm19.623 4.506-6.898-3.93 2.388-1.36a.087.087 0 0 1 .08-.008l5.713 3.255a5.28 5.28 0 0 1 2.054 2.118 5.19 5.19 0 0 1-.488 5.608 5.314 5.314 0 0 1-2.39 1.742v-6.633a.896.896 0 0 0-.459-.792Zm2.377-3.533a7.973 7.973 0 0 0-.168-.099l-5.65-3.22a.93.93 0 0 0-.928 0l-6.898 3.93V8.046a.083.083 0 0 1 .034-.072l5.712-3.251a5.375 5.375 0 0 1 5.698.241 5.262 5.262 0 0 1 1.865 2.28c.39.92.506 1.93.335 2.913ZM9.631 15.009l-2.39-1.36a.083.083 0 0 1-.046-.065V7.075c.001-.997.29-1.973.832-2.814a5.297 5.297 0 0 1 2.231-1.935 5.382 5.382 0 0 1 5.659.72 4.89 4.89 0 0 0-.168.093l-5.65 3.22a.913.913 0 0 0-.465.793l-.003 7.857Zm1.297-2.76L14 10.5l3.072 1.75v3.5L14 17.499l-3.072-1.75v-3.5Z" fill="currentColor" />
  </svg>
);

const AiMeta = () => (
  <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 287.56 191" className="h-6 w-6">
    <defs>
      <linearGradient id="meta_lg1" x1="62.34" y1="101.45" x2="260.34" y2="91.45" gradientTransform="matrix(1, 0, 0, -1, 0, 192)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0064e1" /><stop offset="0.4" stopColor="#0064e1" /><stop offset="0.83" stopColor="#0073ee" /><stop offset="1" stopColor="#0082fb" /></linearGradient>
      <linearGradient id="meta_lg2" x1="41.42" y1="53" x2="41.42" y2="126" gradientTransform="matrix(1, 0, 0, -1, 0, 192)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0082fb" /><stop offset="1" stopColor="#0064e0" /></linearGradient>
    </defs>
    <path fill="#0081fb" d="M31.06,126c0,11,2.41,19.41,5.56,24.51A19,19,0,0,0,53.19,160c8.1,0,15.51-2,29.79-21.76,11.44-15.83,24.92-38,34-52l15.36-23.6c10.67-16.39,23-34.61,37.18-47C181.07,5.6,193.54,0,206.09,0c21.07,0,41.14,12.21,56.5,35.11,16.81,25.08,25,56.67,25,89.27,0,19.38-3.82,33.62-10.32,44.87C271,180.13,258.72,191,238.13,191V160c17.63,0,22-16.2,22-34.74,0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85,0-26.8,11.2-40.23,31.17-7.14,10.61-14.47,23.54-22.7,38.13l-9.06,16c-18.2,32.27-22.81,39.62-31.91,51.75C84.74,183,71.12,191,53.19,191c-21.27,0-34.72-9.21-43-23.09C3.34,156.6,0,141.76,0,124.85Z" />
    <path fill="url(#meta_lg1)" d="M24.49,37.3C38.73,15.35,59.28,0,82.85,0c13.65,0,27.22,4,41.39,15.61,15.5,12.65,32,33.48,52.63,67.81l7.39,12.32c17.84,29.72,28,45,33.93,52.22,7.64,9.26,13,12,19.94,12,17.63,0,22-16.2,22-34.74l27.4-.86c0,19.38-3.82,33.62-10.32,44.87C271,180.13,258.72,191,238.13,191c-12.8,0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71L146.08,93.6c-12.94-21.62-24.81-37.74-31.68-45C107,40.71,97.51,31.23,82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78Z" />
    <path fill="url(#meta_lg2)" d="M82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78C38.61,71.62,31.06,99.34,31.06,126c0,11,2.41,19.41,5.56,24.51L10.14,167.91C3.34,156.6,0,141.76,0,124.85,0,94.1,8.44,62.05,24.49,37.3,38.73,15.35,59.28,0,82.85,0Z" />
  </svg>
);

const AiGemini = () => (
  <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="h-4 w-4">
    <path d="M16 8.016A8.522 8.522 0 0 0 8.016 16h-.032A8.521 8.521 0 0 0 0 8.016v-.032A8.521 8.521 0 0 0 7.984 0h.032A8.522 8.522 0 0 0 16 7.984v.032z" fill="url(#gem_p0)" />
    <defs>
      <radialGradient id="gem_p0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"><stop offset=".067" stopColor="#9168C0" /><stop offset=".343" stopColor="#5684D1" /><stop offset=".672" stopColor="#1BA1E3" /></radialGradient>
    </defs>
  </svg>
);

/* Verticale gradient-lijn voor tile 4 */
const VLine: React.FC<{ i: number }> = ({ i }) => (
  <div className="flex flex-col items-center justify-center">
    <div className="rounded-full h-3 w-3 border border-[rgba(255,255,255,0.2)] bg-[rgba(248,248,248,0.02)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset]" />
    <svg xmlns="http://www.w3.org/2000/svg" width="2" height="265" viewBox="0 0 2 265" fill="none">
      <path d="M1 265V1" stroke={`url(#vline_${i})`} strokeOpacity="0.1" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id={`vline_${i}`} x1="1.5" y1="1" x2="1.5" y2="265" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8F8F8" stopOpacity="0.05" />
          <stop offset="0.530519" stopColor="#F8F8F8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F8F8F8" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

/* ------------------------------------------------------------------ */
/* Sectie                                                              */
/* ------------------------------------------------------------------ */

const BentoFeaturesSection: React.FC<{ onOpenBooking?: () => void }> = ({ onOpenBooking }) => {
  const row1 = [IconInstagram, IconTikTok, IconTwitter, IconFacebook, IconMessenger, IconLinkedIn, IconSlack];
  const row2 = [IconMessenger, IconLinkedIn, IconSlack, IconInstagram, IconTikTok, IconTwitter, IconFacebook];

  return (
    <section
      id="wat-wij-bouwen"
      className="py-16 md:py-24"
      style={{ ['--blue-900' as string]: '#001AFF', ['--blue-500' as string]: '#6DD4F5' } as React.CSSProperties}
    >
      <style>{`
        @keyframes sn-move { 0%{transform:translateX(-48px)} 50%{transform:translateX(48px)} 100%{transform:translateX(-48px)} }
        .sn-animate-move{ animation: sn-move 3s ease-in-out infinite; }
        @keyframes sn-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .sn-f1{animation:sn-float 3.2s ease-in-out infinite}
        .sn-f2{animation:sn-float 3.2s ease-in-out .3s infinite}
        .sn-f3{animation:sn-float 3.2s ease-in-out .6s infinite}
        .sn-f4{animation:sn-float 3.2s ease-in-out .45s infinite}
        .sn-f5{animation:sn-float 3.2s ease-in-out .15s infinite}
      `}</style>

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Header — samengevoegd met de "WIJ CODEREN HET."-sectie: code-first pitch */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-[10px] font-mono text-[#25D366]">&lt;/&gt;</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
              Software & Development
            </span>
          </div>
          <h2 className="font-black uppercase tracking-tighter text-white leading-none text-4xl md:text-6xl">
            WAT WIJ BOUWEN, <span className="text-[#25D366]">CODEREN WE ZELF.</span>
          </h2>
          <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
            Marketing zonder techniek is half werk. Daarom coderen wij alles zelf: maatwerk software,
            webapps, je website, CRM, content en ads. Eén team voor strategie, creatie én code,
            samen in 1 overzichtelijke AI chat.
          </p>
        </div>

        {/* ===== Bento-grid (exacte port) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 py-10">
          {/* Tile 1 — Publiceer overal tegelijk */}
          <div className="sn-warp-tile p-8 rounded-xl group lg:col-span-2">
            <h3 className="text-lg font-semibold text-white py-2">Content: elke dag posten</h3>
            <p className="text-sm font-normal text-neutral-400 max-w-sm">
              Elke dag content op al je kanalen, volledig uit handen: Reels, TikTok, LinkedIn en meer.
            </p>
            <div className="h-[20rem] rounded-xl z-40 bg-[rgba(40,40,40,0.30)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]">
              <div className="p-8 overflow-hidden h-full">
                <div className="flex flex-col gap-4 items-center justify-center h-full relative">
                  <div className="flex gap-4 items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="105" viewBox="0 0 62 105" fill="none" className="absolute left-1/2 -translate-x-[60px] -top-10 text-neutral-600">
                      <path d="M1.00001 -69L1 57.5C1 64.1274 6.37258 69.5 13 69.5H49C55.6274 69.5 61 74.8726 61 81.5L61 105" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M1.00001 -69L1 57.5C1 64.1274 6.37258 69.5 13 69.5H49C55.6274 69.5 61 74.8726 61 81.5L61 105" stroke="url(#beam1)" strokeWidth="1.5" />
                      <defs>
                        <linearGradient id="beam1" x1="78.65637%" y1="70.79073%" x2="94.38764%" y2="94.38764%">
                          <stop stopColor="#001AFF" stopOpacity="0" /><stop offset="1" stopColor="#6DD4F5" /><stop offset="1" stopColor="#6DD4F5" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg width="128" height="69" viewBox="0 0 128 69" fill="none" className="absolute left-1/2 translate-x-4 -bottom-2 text-neutral-600">
                      <path d="M1.00002 0.5L1.00001 29.5862C1 36.2136 6.37259 41.5862 13 41.5862H115C121.627 41.5862 127 46.9588 127 53.5862L127 75" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M1.00002 0.5L1.00001 29.5862C1 36.2136 6.37259 41.5862 13 41.5862H115C121.627 41.5862 127 46.9588 127 53.5862L127 75" stroke="url(#beam2)" strokeWidth="1.5" />
                      <defs>
                        <linearGradient id="beam2" x1="88.25835%" y1="79.43251%" x2="105.91001%" y2="105.91001%">
                          <stop stopColor="#001AFF" stopOpacity="0" /><stop offset="1" stopColor="#6DD4F5" /><stop offset="1" stopColor="#6DD4F5" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {row1.map((Icon, i) => (
                      <IconBox key={i}><Icon /></IconBox>
                    ))}
                  </div>
                  <div className="flex gap-4 items-center justify-center flex-shrink-0 ml-8">
                    {row2.map((Icon, i) => (
                      <IconBox key={i}><Icon /></IconBox>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tile 2 — Analytics voor alles */}
          <div className="sn-warp-tile p-8 rounded-xl group">
            <div className="h-[20rem] rounded-xl z-40 max-w-[16rem] mx-auto bg-[rgba(40,40,40,0.30)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]">
              <div className="p-8 overflow-hidden h-full">
                <div className="flex flex-col gap-4 items-center justify-center h-full relative">
                  <div className="absolute left-10 top-10 rounded-full px-4 py-2 bg-[rgba(40,40,40,0.6)] border border-white/10 shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)_inset]">
                    <p className="text-xs text-white">+200 leads</p>
                  </div>
                  <svg width="335" height="163" viewBox="0 0 335 163" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-600">
                    <g opacity="0.75" filter="url(#graph-line)">
                      <path d="M335 151L317.491 36.2214C317.166 34.0879 316.477 32.0245 315.57 30.0659C307.713 13.0898 308.853 1 284 1C257.738 1 244.262 37.1622 218 37.1622C191.738 37.1622 195.262 67.5 169 67.5C142.738 67.5 141.262 37.1622 115 37.1622C88.7381 37.1622 88.7141 76.5675 62.4522 76.5675C36.1902 76.5675 36.1902 54.6756 9.9283 54.6756H0" stroke="currentColor" strokeWidth="1.5" />
                    </g>
                    <path d="M335 151L317.491 36.2214C317.166 34.0879 316.477 32.0245 315.57 30.0659C307.713 13.0898 308.853 1 284 1C257.738 1 244.262 37.1622 218 37.1622C191.738 37.1622 195.262 67.5 169 67.5C142.738 67.5 141.262 37.1622 115 37.1622C88.7381 37.1622 88.7141 76.5675 62.4522 76.5675C36.1902 76.5675 36.1902 54.6756 9.9283 54.6756H0" stroke="url(#graph-grad)" strokeWidth="1.5" />
                    <defs>
                      <filter id="graph-line" x="-8" y="0.25" width="351.741" height="190.863" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feMorphology radius="16" operator="erode" in="SourceAlpha" result="effect1_dropShadow" />
                        <feOffset dy="32" /><feGaussianBlur stdDeviation="12" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
                        <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset /><feGaussianBlur stdDeviation="4" />
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.972549 0 0 0 0 0.972549 0 0 0 0 0.972549 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
                      </filter>
                      <linearGradient id="graph-grad" x1="52.80671%" y1="0%" x2="63.36806%" y2="0%">
                        <stop stopColor="#001AFF" stopOpacity="0" /><stop offset="1" stopColor="#6DD4F5" /><stop offset="1" stopColor="#6DD4F5" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <svg width="335" height="162" viewBox="0 0 335 162" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -left-[4.4rem] top-12">
                    <path opacity="0.1" d="M62.4522 74.8549C36.1902 74.8549 36.1902 53.1412 9.9283 53.1412H0V162H335V148.682L317.457 36.1367C316.834 32.1397 314.854 28.4689 313.175 24.7886C308.579 14.7151 307.984 0 286 0C259.738 0 247.762 35.7703 221.5 35.7703C195.238 35.7703 196.762 66.5 170.5 66.5C144.238 66.5 141.262 35.7704 115 35.7704C88.7381 35.7704 88.7141 74.8549 62.4522 74.8549Z" fill="url(#area-grad)" />
                    <defs>
                      <linearGradient id="area-grad" x1="167.5" y1="148.4" x2="183.302" y2="-107.424" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" stopOpacity="0" /><stop offset="0.571573" stopColor="white" stopOpacity="0.9" /><stop offset="1" stopColor="white" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <svg width="36" height="320" viewBox="0 0 36 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-x-0 -top-2 h-full w-full">
                    <path opacity="0.1" d="M18.75 4.5C18.75 4.08579 18.4142 3.75 18 3.75C17.5858 3.75 17.25 4.08579 17.25 4.5L18.75 4.5ZM17.25 4.5L17.25 8.56522L18.75 8.56522L18.75 4.5L17.25 4.5ZM17.25 16.6957L17.25 24.8261L18.75 24.8261L18.75 16.6957L17.25 16.6957ZM17.25 32.9565L17.25 41.087L18.75 41.087L18.75 32.9565L17.25 32.9565ZM17.25 49.2174L17.25 57.3478L18.75 57.3478L18.75 49.2174L17.25 49.2174ZM17.25 65.4783L17.25 73.6087L18.75 73.6087L18.75 65.4783L17.25 65.4783ZM17.25 81.7391L17.25 89.8696L18.75 89.8696L18.75 81.7391L17.25 81.7391ZM17.25 98L17.25 106.13L18.75 106.13L18.75 98L17.25 98ZM17.25 114.261L17.25 122.391L18.75 122.391L18.75 114.261L17.25 114.261ZM17.25 130.522L17.25 138.652L18.75 138.652L18.75 130.522L17.25 130.522ZM17.25 146.783L17.25 154.913L18.75 154.913L18.75 146.783L17.25 146.783ZM17.25 163.043L17.25 171.174L18.75 171.174L18.75 163.043L17.25 163.043ZM17.25 179.304L17.25 187.435L18.75 187.435L18.75 179.304L17.25 179.304ZM17.25 195.565L17.25 203.696L18.75 203.696L18.75 195.565L17.25 195.565ZM17.25 211.826L17.25 219.956L18.75 219.956L18.75 211.826L17.25 211.826ZM17.25 228.087L17.25 236.217L18.75 236.217L18.75 228.087L17.25 228.087ZM17.25 244.348L17.25 252.478L18.75 252.478L18.75 244.348L17.25 244.348ZM17.25 260.609L17.25 268.739L18.75 268.739L18.75 260.609L17.25 260.609ZM17.25 276.87L17.25 285L18.75 285L18.75 276.87L17.25 276.87ZM17.25 293.13L17.25 301.261L18.75 301.261L18.75 293.13L17.25 293.13ZM17.25 309.391L17.25 317.522L18.75 317.522L18.75 309.391L17.25 309.391ZM17.25 325.652L17.25 333.783L18.75 333.783L18.75 325.652L17.25 325.652ZM17.25 341.913L17.25 350.043L18.75 350.043L18.75 341.913L17.25 341.913ZM17.25 358.174L17.25 366.304L18.75 366.304L18.75 358.174L17.25 358.174ZM17.25 374.435L17.25 378.5L18.75 378.5L18.75 374.435L17.25 374.435Z" fill="#F8F8F8" />
                    <g filter="url(#dot-glow)">
                      <circle cx="18" cy="154" r="10" fill="#F8F8F8" fillOpacity="0.01" />
                      <circle cx="18" cy="154" r="10" fill="#121212" fillOpacity="0.3" />
                      <circle cx="18" cy="154" r="9.5" stroke="url(#dot-grad)" strokeOpacity="0.25" />
                    </g>
                    <circle cx="18" cy="154" r="5" fill="#F8F8F8" />
                    <defs>
                      <filter id="dot-glow" x="-4" y="132" width="44" height="72" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feGaussianBlur in="BackgroundImageFix" stdDeviation="6" />
                        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feMorphology radius="16" operator="erode" in="SourceAlpha" result="effect2_dropShadow" />
                        <feOffset dy="32" /><feGaussianBlur stdDeviation="12" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
                        <feBlend mode="multiply" in2="effect1_backgroundBlur" result="effect2_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset /><feGaussianBlur stdDeviation="4" />
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.972549 0 0 0 0 0.972549 0 0 0 0 0.972549 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="shape" result="effect3_innerShadow" />
                      </filter>
                      <linearGradient id="dot-grad" x1="18" y1="144" x2="26.7004" y2="165.962" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" stopOpacity="0.4" /><stop offset="0.4" stopColor="white" stopOpacity="0.01" /><stop offset="0.6" stopColor="white" stopOpacity="0.01" /><stop offset="1" stopColor="white" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 translate-x-4 m-auto h-4 w-4">
                    <path d="M3.08365 1.18326C2.89589 1.11581 2.70538 1.04739 2.54453 1.00558C2.39192 0.965918 2.09732 0.900171 1.78145 1.00956C1.41932 1.13497 1.13472 1.41956 1.00932 1.78169C0.899927 2.09756 0.965674 2.39216 1.00533 2.54477C1.04714 2.70562 1.11557 2.89613 1.18301 3.0839L5.9571 16.3833C6.04091 16.6168 6.12128 16.8408 6.2006 17.0133C6.26761 17.1591 6.42 17.4781 6.75133 17.6584C7.11364 17.8555 7.54987 17.8612 7.91722 17.6737C8.25317 17.5021 8.41388 17.1873 8.48469 17.0433C8.56852 16.8729 8.65474 16.6511 8.74464 16.4198L10.8936 10.8939L16.4196 8.74489C16.6509 8.655 16.8726 8.56879 17.043 8.48498C17.187 8.41416 17.5018 8.25346 17.6734 7.91751C17.8609 7.55016 17.8552 7.11392 17.6581 6.75162C17.4778 6.42029 17.1589 6.2679 17.0131 6.20089C16.8405 6.12157 16.6165 6.0412 16.383 5.9574L3.08365 1.18326Z" fill="var(--blue-900)" stroke="var(--blue-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white py-2">Advertenties die renderen</h3>
            <p className="text-sm font-normal text-neutral-400 max-w-sm">
              Meta &amp; Google campagnes, gestuurd op data. Je ziet elke euro terug.
            </p>
          </div>

          {/* Tile 3 — AI in de kern */}
          <div className="sn-warp-tile p-8 rounded-xl group">
            <div className="h-[20rem] rounded-xl z-40 bg-[rgba(40,40,40,0.30)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]">
              <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
                <div className="flex flex-row flex-shrink-0 justify-center items-center gap-2">
                  <div className="rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] h-8 w-8 sn-f1">
                    <AiClaude />
                  </div>
                  <div className="rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] h-12 w-12 sn-f2">
                    <AiBot />
                  </div>
                  <div className="h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] sn-f3">
                    <AiOpenAI />
                  </div>
                  <div className="rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] h-12 w-12 sn-f4">
                    <AiMeta />
                  </div>
                  <div className="rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] h-8 w-8 sn-f5">
                    <AiGemini />
                  </div>
                </div>
                <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-[#25D366] to-transparent sn-animate-move" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white py-2">Alles in één AI chat</h3>
            <p className="text-sm font-normal text-neutral-400 max-w-sm">
              Vraag, stuur bij en zie resultaat: je hele marketing in 1 overzichtelijke chat.
            </p>
            <div className="pt-3">
              <GenerateButton onClick={onOpenBooking} />
            </div>
          </div>

          {/* Tile 4 — Moeiteloos samenwerken */}
          <div className="sn-warp-tile p-8 rounded-xl group">
            <div className="h-[20rem] rounded-xl z-40 max-w-[16rem] mx-auto">
              <div className="p-8 overflow-hidden h-full relative flex flex-col group">
                <div className="absolute inset-0 h-full w-full flex flex-row gap-4 justify-center flex-shrink-0">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <VLine key={i} i={i} />
                  ))}
                </div>
                <div className="p-0.5 rounded-lg border border-neutral-600 w-fit mt-10 ml-4">
                  <div className="h-10 text-xs px-2 text-neutral-400 rounded-[5px] flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]">
                    Social post
                  </div>
                </div>
                <div className="p-0.5 rounded-lg border border-neutral-600 w-fit mt-4 ml-10 group-hover:border-[#25D366] transition duration-200 group-hover:scale-[1.02]">
                  <div className="h-10 text-xs px-2 text-neutral-400 rounded-[5px] flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]">
                    E-mail campagne
                  </div>
                </div>
                <div className="p-0.5 rounded-lg border border-neutral-600 w-fit mt-4 ml-4">
                  <div className="h-10 text-xs px-2 text-neutral-400 rounded-[5px] flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]">
                    Nieuwsbrief
                  </div>
                </div>
                <div className="absolute h-4 w-4 transition-all duration-200 top-20 left-40 group-hover:left-32">
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M3.08365 1.18326C2.89589 1.11581 2.70538 1.04739 2.54453 1.00558C2.39192 0.965918 2.09732 0.900171 1.78145 1.00956C1.41932 1.13497 1.13472 1.41956 1.00932 1.78169C0.899927 2.09756 0.965674 2.39216 1.00533 2.54477C1.04714 2.70562 1.11557 2.89613 1.18301 3.0839L5.9571 16.3833C6.04091 16.6168 6.12128 16.8408 6.2006 17.0133C6.26761 17.1591 6.42 17.4781 6.75133 17.6584C7.11364 17.8555 7.54987 17.8612 7.91722 17.6737C8.25317 17.5021 8.41388 17.1873 8.48469 17.0433C8.56852 16.8729 8.65474 16.6511 8.74464 16.4198L10.8936 10.8939L16.4196 8.74489C16.6509 8.655 16.8726 8.56879 17.043 8.48498C17.187 8.41416 17.5018 8.25346 17.6734 7.91751C17.8609 7.55016 17.8552 7.11392 17.6581 6.75162C17.4778 6.42029 17.1589 6.2679 17.0131 6.20089C16.8405 6.12157 16.6165 6.0412 16.383 5.9574L3.08365 1.18326Z" fill="var(--blue-900)" stroke="var(--blue-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="absolute top-3 left-3 p-1 rounded-md text-[10px] whitespace-pre text-neutral-500 transition duration-200 group-hover:text-[#25D366]">Niels Groen</div>
                </div>
                <div className="absolute h-4 w-4 transition-all duration-200 top-60 left-12 group-hover:left-32 group-hover:top-44">
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M3.08365 1.18326C2.89589 1.11581 2.70538 1.04739 2.54453 1.00558C2.39192 0.965918 2.09732 0.900171 1.78145 1.00956C1.41932 1.13497 1.13472 1.41956 1.00932 1.78169C0.899927 2.09756 0.965674 2.39216 1.00533 2.54477C1.04714 2.70562 1.11557 2.89613 1.18301 3.0839L5.9571 16.3833C6.04091 16.6168 6.12128 16.8408 6.2006 17.0133C6.26761 17.1591 6.42 17.4781 6.75133 17.6584C7.11364 17.8555 7.54987 17.8612 7.91722 17.6737C8.25317 17.5021 8.41388 17.1873 8.48469 17.0433C8.56852 16.8729 8.65474 16.6511 8.74464 16.4198L10.8936 10.8939L16.4196 8.74489C16.6509 8.655 16.8726 8.56879 17.043 8.48498C17.187 8.41416 17.5018 8.25346 17.6734 7.91751C17.8609 7.55016 17.8552 7.11392 17.6581 6.75162C17.4778 6.42029 17.1589 6.2679 17.0131 6.20089C16.8405 6.12157 16.6165 6.0412 16.383 5.9574L3.08365 1.18326Z" fill="var(--blue-900)" stroke="var(--blue-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="absolute top-3 left-3 p-1 rounded-md text-[10px] whitespace-pre text-neutral-500 transition duration-200 group-hover:text-white">Albert Deltour</div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white py-2">CRM &amp; opvolging</h3>
            <p className="text-sm font-normal text-neutral-400 max-w-sm">
              Elke lead automatisch opgevolgd. Niets valt meer tussen wal en schip.
            </p>
          </div>

          {/* Tile 5 — Ken je publiek */}
          <div className="sn-warp-tile p-8 rounded-xl group">
            <div className="h-[20rem] rounded-xl z-40 bg-[rgba(40,40,40,0.30)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]">
              <div className="p-8 overflow-hidden h-full relative flex items-start justify-center">
                <div className="sn-bento-flip-a flex absolute inset-0 flex-col group-hover:-translate-y-80 transition duration-200 items-center justify-center">
                  <div className="h-20 w-20 rounded-lg flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]">
                    <img
                      src={`${import.meta.env.BASE_URL}images/Niels-Groen.webp`}
                      alt="Niels Groen"
                      className="h-16 w-16 rounded-md object-cover"
                      loading="lazy"
                      decoding="async"
                      width="64"
                      height="64"
                    />
                  </div>
                  <p className="mt-4 text-sm text-neutral-400 font-bold">Niels Groen</p>
                  <div className="flex items-center gap-2 text-xs mt-4 text-neutral-400">
                    <p>Meeste engagement</p>
                    <div className="h-1 w-1 rounded-full bg-neutral-400" />
                    <p>69.420</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="336" height="126" viewBox="0 0 336 126" fill="none">
                    <path d="M0 1C9.88235 1 9.88235 64.1698 19.7647 64.1698C29.6471 64.1698 29.6471 108.623 39.5294 108.623C49.4118 108.623 49.4118 125 59.2941 125C69.1765 125 69.1765 50.1321 79.0588 50.1321C88.9412 50.1321 88.9412 94.5849 98.8235 94.5849C108.706 94.5849 108.706 73.5283 118.588 73.5283C128.471 73.5283 128.471 85.2264 138.353 85.2264C148.235 85.2264 148.235 61.8302 158.118 61.8302C168 61.8302 168 57.1509 177.882 57.1509C187.765 57.1509 187.765 52.4717 197.647 52.4717C207.529 52.4717 207.529 92.2453 217.412 92.2453C227.294 92.2453 227.294 96.9245 237.176 96.9245C247.059 96.9245 247.059 113.302 256.941 113.302C266.824 113.302 266.824 101.604 276.706 101.604C286.588 101.604 286.588 38.434 296.471 38.434C306.353 38.434 306.353 103.943 316.235 103.943C326.118 103.943 326.118 103.943 336 103.943" stroke="#25D366" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="sn-bento-flip-b flex absolute inset-0 flex-col translate-y-80 group-hover:translate-y-0 transition duration-200 items-center justify-center">
                  <div className="h-20 w-20 rounded-lg flex items-center justify-center bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]">
                    <img
                      src={`${import.meta.env.BASE_URL}images/66ed2e6a48aae627d6698e31-Albert-Deltour.webp`}
                      alt="Albert Deltour"
                      className="h-16 w-16 rounded-md object-cover"
                      loading="lazy"
                      decoding="async"
                      width="64"
                      height="64"
                    />
                  </div>
                  <p className="mt-4 text-sm text-neutral-400 font-bold">Albert Deltour</p>
                  <div className="flex items-center gap-2 text-xs mt-4 text-neutral-400">
                    <p>Meeste engagement</p>
                    <div className="h-1 w-1 rounded-full bg-neutral-400" />
                    <p>8.008</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="336" height="126" viewBox="0 0 336 126" fill="none">
                    <path d="M0 1C9.88235 1 9.88235 64.1698 19.7647 64.1698C29.6471 64.1698 29.6471 108.623 39.5294 108.623C49.4118 108.623 49.4118 125 59.2941 125C69.1765 125 69.1765 50.1321 79.0588 50.1321C88.9412 50.1321 88.9412 94.5849 98.8235 94.5849C108.706 94.5849 108.706 73.5283 118.588 73.5283C128.471 73.5283 128.471 85.2264 138.353 85.2264C148.235 85.2264 148.235 61.8302 158.118 61.8302C168 61.8302 168 57.1509 177.882 57.1509C187.765 57.1509 187.765 52.4717 197.647 52.4717C207.529 52.4717 207.529 92.2453 217.412 92.2453C227.294 92.2453 227.294 96.9245 237.176 96.9245C247.059 96.9245 247.059 113.302 256.941 113.302C266.824 113.302 266.824 101.604 276.706 101.604C286.588 101.604 286.588 38.434 296.471 38.434C306.353 38.434 306.353 103.943 316.235 103.943C326.118 103.943 326.118 103.943 336 103.943" stroke="#25D366" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white py-2">Website die verkoopt</h3>
            <p className="text-sm font-normal text-neutral-400 max-w-sm">
              Razendsnel, AI-chatbot aan boord en gebouwd om bezoekers klant te maken.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoFeaturesSection;
