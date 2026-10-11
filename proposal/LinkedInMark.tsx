export default function LinkedInMark() {
  return (
    <svg
      className="h-linkedin-mark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="15"
      height="15"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="16" height="16" rx="1.2" fill="#0a66c2" />
      <path
        fill="#fff"
        style={{ fill: "#fff" }}
        d="M4.943 13.394V6.169H2.542v7.225h2.401Zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016Zm9.715 8.212V9.251c0-2.219-1.184-3.252-2.763-3.252-1.274 0-1.845.7-2.165 1.193V6.169H6.129c.03.678 0 7.225 0 7.225H8.53V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.663 1.216 1.634v3.865h2.4Z"
      />
    </svg>
  );
}

// 11 oktober 2026 (Marinus, schermafdruk op mobiel): "Marinus / Bergsma [in]" en "Steef Komen / [in]", het icoon stond los
// op een eigen regel. Het laatste woord en het icoon zitten nu samen in één onbreekbaar stuk; de naam breekt alleen tussen
// hele woorden. Proef: scripts/proef-partnertegels.mjs.
export function NaamMetLinkedIn({ naam }: { naam: string }) {
  const woorden = naam.trim().split(/\s+/);
  const laatste = woorden.pop();
  return <>{woorden.length ? `${woorden.join(" ")} ` : ""}<span className="h-naam-eind">{laatste}{" "}<LinkedInMark /></span></>;
}
