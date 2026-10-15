import React from "react";
import { ArrowUpRight, Pause, Play, Rocket } from "lucide-react";

const icons = new Map([ ["↗", ArrowUpRight], ["▶", Play], ["Ⅱ", Pause], ["🚀", Rocket] ]);
const symbols = /(↗|▶|Ⅱ|🚀)[\uFE0E\uFE0F]?/u;

// iOS and Android can draw text symbols as coloured emoji. Keep translated labels
// intact and replace only their decorative symbols with the site's SVG icons.
export function renderUiSymbols(child: React.ReactNode): React.ReactNode {
  if (Array.isArray(child)) return child.map(renderUiSymbols);
  if (typeof child !== "string" || !symbols.test(child)) return child;
  return child.split(symbols).map((part, index) => {
    const Icon = icons.get(part);
    return Icon ? React.createElement(Icon, {
      key: index,
      "aria-hidden": true,
      focusable: "false",
      className: "sn-ui-symbol",
      size: "1em",
      style: { display: "inline-block", verticalAlign: "-0.15em", flexShrink: 0 },
    }) : part;
  });
}
