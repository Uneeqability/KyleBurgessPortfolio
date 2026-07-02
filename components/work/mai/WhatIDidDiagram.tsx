import { readFileSync } from "node:fs";
import { join } from "node:path";
import WhatIDidDiagramClient from "./WhatIDidDiagramClient";

/**
 * The Figma-comment collaboration diagram — the exact Figma SVG (every layer,
 * vector, artwork untouched). Read from disk on the server, then handed to a
 * client component that scroll-animates it. Reused by desktop + mobile layouts.
 */
const diagramSvg = readFileSync(
  join(process.cwd(), "public/images/mai/what-i-did-diagram.svg"),
  "utf8",
)
  .replace(/<svg([^>]*?)\swidth="[^"]*"/, "<svg$1")
  .replace(/<svg([^>]*?)\sheight="[^"]*"/, "<svg$1");

export default function WhatIDidDiagram({
  className = "",
}: {
  className?: string;
}) {
  return <WhatIDidDiagramClient svg={diagramSvg} className={className} />;
}
