/* eslint-disable @next/next/no-img-element */
import DeckCard from "./DeckCard";

/**
 * Presentation & Narrative Design body (Figma 60:834). A column of deck blocks:
 * each is a #EFE2D1 media card holding several individual slide snapshots
 * (kept as separate positioned images — data-deck-slide — so they can be animated
 * later) above a CLIENT / PROJECT / RESULT bar with the client logo. vw ÷19.2.
 */

const P = "/images/presentation";

type Slot = { file: string; left: string; top: string; w: string; h: string; r: string };

// Slot layouts (% of the 1412×739 media card), in Figma z-order.
const LAYOUT_A: Slot[] = [
  { file: "1.jpg", left: "62.61%", top: "54.26%", w: "24.55%", h: "26.39%", r: "0.5vw" },
  { file: "2.jpg", left: "41.93%", top: "19.22%", w: "24.58%", h: "26.41%", r: "0.5vw" },
  { file: "3.jpg", left: "41.71%", top: "47.36%", w: "24.8%", h: "26.66%", r: "0.62vw" },
  { file: "big.jpg", left: "10.62%", top: "29.63%", w: "35.27%", h: "37.91%", r: "0.86vw" },
  { file: "4.jpg", left: "62.54%", top: "24.9%", w: "24.58%", h: "26.41%", r: "0.5vw" },
];
const LAYOUT_BHASKAR: Slot[] = [
  { file: "1.jpg", left: "44.19%", top: "20.16%", w: "24.37%", h: "26.19%", r: "0.5vw" },
  { file: "2.jpg", left: "62.75%", top: "53.86%", w: "24.36%", h: "26.18%", r: "0.5vw" },
  { file: "3.jpg", left: "43.98%", top: "47.77%", w: "24.58%", h: "26.41%", r: "0.61vw" },
  { file: "big.jpg", left: "12.82%", top: "28.82%", w: "35.28%", h: "37.92%", r: "0.86vw" },
  { file: "4.jpg", left: "62.56%", top: "25.51%", w: "24.57%", h: "26.4%", r: "0.5vw" },
];
const LAYOUT_FLIP: Slot[] = [
  { file: "1.jpg", left: "62.46%", top: "55.62%", w: "24.79%", h: "26.66%", r: "0.47vw" },
  { file: "2.jpg", left: "43.98%", top: "47.09%", w: "24.58%", h: "26.41%", r: "0.5vw" },
  { file: "3.jpg", left: "44.12%", top: "17.86%", w: "24.42%", h: "26.25%", r: "0.5vw" },
  { file: "big.jpg", left: "12.75%", top: "28.15%", w: "35.25%", h: "37.89%", r: "0.88vw" },
  { file: "4.jpg", left: "62.46%", top: "26.52%", w: "24.58%", h: "26.41%", r: "0.5vw" },
];
// Fox card ("The Scout"). 5.jpg sits at the upper-right; the old 2.jpg slot sat
// directly under it (same spot) and only ever peeked through during the staggered
// reveal, so it's removed — the settled layout is unchanged.
const LAYOUT_FOX: Slot[] = [
  { file: "1.jpg", left: "62.54%", top: "55.62%", w: "24.68%", h: "26.52%", r: "0.5vw" },
  { file: "3.jpg", left: "44.26%", top: "48.85%", w: "24.17%", h: "25.98%", r: "0.49vw" },
  { file: "4.jpg", left: "44.19%", top: "19.22%", w: "24.36%", h: "26.18%", r: "0.5vw" },
  { file: "big.jpg", left: "12.82%", top: "29.9%", w: "35.25%", h: "37.89%", r: "0.86vw" },
  { file: "5.jpg", left: "62.54%", top: "25.57%", w: "24.63%", h: "26.47%", r: "0.61vw" },
];
const LAYOUT_STUDIO: Slot[] = [
  { file: "1.jpg", left: "62.54%", top: "55.62%", w: "24.68%", h: "26.52%", r: "0.62vw" },
  { file: "2.jpg", left: "44.26%", top: "48.85%", w: "24.17%", h: "25.98%", r: "0.62vw" },
  { file: "3.jpg", left: "44.19%", top: "19.22%", w: "24.36%", h: "26.18%", r: "0.62vw" },
  { file: "big.jpg", left: "12.82%", top: "29.9%", w: "35.25%", h: "37.89%", r: "1vw" },
  { file: "4.jpg", left: "63.95%", top: "25.44%", w: "24.63%", h: "26.47%", r: "0.62vw" },
];

const label =
  "font-sans text-[min(1.04vw,20px)] font-bold uppercase tracking-[0.02em] text-[#3b230e]";
const value =
  "font-serif text-[min(0.885vw,17px)] italic leading-tight text-[#3b230e]";
const HDivider = () => <div className="h-[4.5vw] w-px shrink-0 bg-[#3b230e]/25" />;

function Col({ head, val }: { head: string; val: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[0.5vw] px-[1vw] text-center">
      <span className={label}>{head}</span>
      <span className={value}>{val}</span>
    </div>
  );
}

function Row({
  logo,
  logoClass = "max-h-[2.4vw] max-w-[9vw]",
  client,
  project,
  result,
}: {
  logo?: string;
  logoClass?: string;
  client: string;
  project: string;
  result: string;
}) {
  return (
    <div className="mt-[2vw] flex h-[6.3vw] w-full items-center rounded-[1.04vw] bg-[#F7ECD9]">
      <div className="flex w-[24.8%] items-center justify-center px-[1.5vw]">
        {logo && <img src={logo} alt={client} loading="lazy" decoding="async" className={`${logoClass} w-auto object-contain`} />}
      </div>
      <HDivider />
      <Col head="Client" val={client} />
      <HDivider />
      <Col head="Project" val={project} />
      <HDivider />
      <Col head="Result" val={result} />
    </div>
  );
}

type Project = {
  slug: string;
  layout: Slot[];
  logo?: string;
  logoClass?: string;
  /** mobile logo height (px) — hand-balanced so each reads at a similar weight */
  mLogoH?: number;
  client: string;
  project: string;
  result: string;
};

const PROJECTS: Project[] = [
  { slug: "bhaskar", layout: LAYOUT_BHASKAR, logo: `${P}/logos/accenture.svg`, logoClass: "max-h-[1.9vw] max-w-[9vw]", mLogoH: 22.8, client: "Michael Bhaskar", project: "Agentic Shift Keynote Speech", result: "Presented at Accenture's leading in the agentic age conference" },
  { slug: "ceo-summit", layout: LAYOUT_A, logo: `${P}/logos/microsoft.svg`, logoClass: "max-h-[1.8vw] max-w-[9vw]", mLogoH: 21.6, client: "Microsoft CEO Summit", project: "Mustafa Suleyman CEO Summit Talk", result: "Presented at 2026 Microsoft CEO Summit" },
  { slug: "town-hall-mai", layout: LAYOUT_A, logo: `${P}/logos/mai-wordmark.svg`, logoClass: "max-h-[1.5vw] max-w-[9.5vw]", mLogoH: 21.6, client: "Microsoft AI", project: "Company-wide Town Hall", result: "Presented at internal town hall for 12,000+ employees" },
  { slug: "town-hall-copilot", layout: LAYOUT_A, logo: `${P}/logos/copilot.svg`, logoClass: "max-h-[1.9vw] max-w-[9vw]", mLogoH: 21.6, client: "Microsoft Copilot", project: "Company-wide Town Hall", result: "Presented at internal town hall for 12,000+ employees" },
  { slug: "flip4good", layout: LAYOUT_FLIP, logo: `${P}/logos/flip4good.svg`, logoClass: "max-h-[3.2vw] max-w-[4vw]", mLogoH: 26.4, client: "Flip4Good", project: "Charity Pitch Deck", result: "Helped secure donor funding" },
  { slug: "lampoon", layout: LAYOUT_A, logo: `${P}/logos/lampoon.svg`, logoClass: "max-h-[2.4vw] max-w-[9.5vw]", mLogoH: 21.6, client: "National Lampoon", project: "Coffee is a Joke", result: "Secured VC Investment for concept coffee shop with iconic comedy brand" },
  { slug: "greys", layout: LAYOUT_A, logo: `${P}/logos/hollywood.svg`, logoClass: "max-h-[2.3vw] max-w-[9vw]", mLogoH: 24, client: "Hollywood Records", project: "The Greys", result: "Secured single deal with Hollywood Records" },
  { slug: "problematix", layout: LAYOUT_A, logo: `${P}/logos/problematix.svg`, logoClass: "max-h-[3vw] max-w-[6vw]", mLogoH: 25.2, client: "Universal Music Publishing", project: "The Problematix EPK", result: "Electronic Press Kit" },
  { slug: "fox", layout: LAYOUT_FOX, logo: `${P}/logos/fox.svg`, logoClass: "max-h-[2.6vw] max-w-[6vw]", mLogoH: 21.6, client: "Fox Entertainment", project: "The Scout", result: "Helped secure development deal at Fox Entertainment Network" },
  { slug: "studio71", layout: LAYOUT_STUDIO, logo: `${P}/logos/studio71.svg`, logoClass: "max-h-[3vw] max-w-[3.4vw]", mLogoH: 24, client: "Studio71", project: "Flight Risk Documentary", result: "Helped secure funding for film" },
];

export default function PresentationBody() {
  return (
    <>
      <BodyDesktop />
      <BodyMobile />
    </>
  );
}

function BodyDesktop() {
  return (
    <section className="hidden w-full pb-[7vw] sm:block">
      <div className="mx-auto flex w-[73.54vw] flex-col gap-[4.5vw] pt-[6vw]">
        {PROJECTS.map((p) => (
          <div key={p.slug} className="w-full">
            <DeckCard slug={p.slug} layout={p.layout} />
            <Row logo={p.logo} logoClass={p.logoClass} client={p.client} project={p.project} result={p.result} />
          </div>
        ))}
      </div>
    </section>
  );
}

function BodyMobile() {
  return (
    <section className="flex flex-col gap-10 px-5 py-12 sm:hidden">
      {PROJECTS.map((p) => (
        <div key={p.slug}>
          <DeckCard slug={p.slug} layout={p.layout} mobile />
          <div className="mt-3 rounded-2xl bg-[#F7ECD9] px-4 pb-4">
            {p.logo && (
              <div className="flex justify-center py-4">
                <img
                  src={p.logo}
                  alt={p.client}
                  style={{ height: `${p.mLogoH ?? 24}px` }}
                  loading="lazy"
                  decoding="async"
                  className="w-auto max-w-[45%] object-contain"
                />
              </div>
            )}
            <div className="grid grid-cols-3 divide-x divide-[#3b230e]/20 text-center">
              {[["Client", p.client], ["Project", p.project], ["Result", p.result]].map(([h, v]) => (
                <div key={h} className="flex flex-col gap-1 px-2">
                  <span className="font-sans text-[0.6rem] font-bold uppercase tracking-wide text-[#3b230e]">{h}</span>
                  <span className="font-serif text-[0.68rem] italic leading-tight text-[#3b230e]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
