/* eslint-disable @next/next/no-img-element */
import Reveal from "@/components/Reveal";
import ProdVideo from "./ProdVideo";

/**
 * Production page body (Figma 60:131). A centered column of project blocks: each
 * landscape project is a video + a CLIENT/PROJECT/ROLE bar; the Meta and personal
 * blocks pair three vertical clips with a stacked info panel. Every clip is a
 * ProdVideo (autoplay-muted-in-view, restart + unmute controls). vw-mapped ÷19.2.
 */

const V = "/videos/prod";
const L = "/images/prod/logos";

/* --------------------------------------------------------- shared bits ----- */

const label =
  "font-sans text-[min(1.04vw,20px)] font-bold uppercase tracking-[0.02em] text-[#3b230e]";
const value =
  "font-serif text-[min(0.885vw,17px)] italic leading-none text-[#3b230e]";

function Logo({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="flex w-[22%] items-center justify-center px-[1.5vw]">
      {src && (
        <img src={src} alt={alt} loading="lazy" decoding="async" className="max-h-[2.9vw] w-auto max-w-[8.5vw] object-contain" />
      )}
    </div>
  );
}
const HDivider = () => <div className="h-[4.5vw] w-px shrink-0 bg-[#3b230e]/25" />;

function Col({ head, val }: { head: string; val: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[0.5vw] px-[1vw] text-center">
      <span className={label}>{head}</span>
      <span className={value}>{val}</span>
    </div>
  );
}

/** Horizontal CLIENT | PROJECT | ROLE bar (1284×121). */
function Row({
  logo,
  client,
  project,
  role,
}: {
  logo?: string;
  client: string;
  project: string;
  role: string;
}) {
  return (
    <div className="mt-[1.8vw] flex h-[6.3vw] w-full items-center rounded-[1.04vw] bg-[#F7ECD9]">
      <Logo src={logo} alt={client} />
      <HDivider />
      <Col head="Client" val={client} />
      <HDivider />
      <Col head="Project" val={project} />
      <HDivider />
      <Col head="Role" val={role} />
    </div>
  );
}

/**
 * Category / status labels stacked in a clip's top-left corner — the type of work
 * ("Branded Content", "Video Editing") plus any award/status ("Webby Award
 * Nominee", "Optioned by Netflix"). Espresso mono on a frosted-cream pill so they
 * read over any footage.
 */
function BadgeStack({ labels }: { labels: string[] }) {
  return (
    <div className="absolute left-[1.4vw] top-[1.4vw] z-10 flex flex-col items-start gap-[0.5vw]">
      {labels.map((l) => (
        <span
          key={l}
          className="rounded-full bg-black/55 px-[1vw] py-[0.4vw] font-sans text-[min(0.72vw,13px)] font-medium uppercase tracking-[0.08em] text-white backdrop-blur-sm"
        >
          {l}
        </span>
      ))}
    </div>
  );
}
/** Mobile variant (rem-sized). */
function MBadgeStack({ labels }: { labels: string[] }) {
  return (
    <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1">
      {labels.map((l) => (
        <span
          key={l}
          className="rounded-full bg-black/55 px-2 py-0.5 font-sans text-[0.55rem] font-medium uppercase tracking-wide text-white backdrop-blur-sm"
        >
          {l}
        </span>
      ))}
    </div>
  );
}

/** A landscape project: video (with optional badge/note) + info bar. */
function Landscape({
  src,
  aspect,
  badges,
  note,
  client,
  project,
  role,
  logo,
}: {
  src: string;
  aspect: string;
  badges?: string[];
  note?: string;
  client: string;
  project: string;
  role: string;
  logo?: string;
}) {
  return (
    <div className="w-full">
      {note && (
        <p className="mb-[1.2vw] text-right font-serif text-[min(1.17vw,22px)] font-light italic text-espresso">
          {note}
        </p>
      )}
      <Reveal blur className={`relative w-full overflow-hidden rounded-[0.83vw] ${aspect}`}>
        {badges && <BadgeStack labels={badges} />}
        <ProdVideo src={src} />
      </Reveal>
      <Row logo={logo} client={client} project={project} role={role} />
    </div>
  );
}

/** One row of the vertical info panel (label left, value right). */
function VRow({ head, val }: { head: string; val: string }) {
  return (
    <div className="grid grid-cols-[1fr_1.3fr] items-center gap-[0.5vw] px-[1.6vw] py-[1.5vw] text-center">
      <span className={label}>{head}</span>
      <span className={value}>{val}</span>
    </div>
  );
}

/** Vertical info panel for the Meta / personal blocks (logo or heading on top). */
function Panel({
  logo,
  heading,
  client,
  project,
  role,
}: {
  logo?: string;
  heading?: string;
  client: string;
  project: string;
  role: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-[1.04vw] bg-[#F7ECD9]">
      <div className="flex flex-1 items-center justify-center px-[2vw]">
        {logo ? (
          <img src={logo} alt={client} loading="lazy" decoding="async" className="max-h-[4.5vw] w-auto max-w-[9vw] object-contain" />
        ) : (
          <span className="font-serif text-[min(1.77vw,34px)] italic text-espresso">{heading}</span>
        )}
      </div>
      <div className="divide-y divide-[#3b230e]/20 border-t border-[#3b230e]/20">
        <VRow head="Client" val={client} />
        <VRow head="Project" val={project} />
        <VRow head="Role" val={role} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- desktop -- */

function BodyDesktop() {
  return (
    <section className="hidden w-full pb-[7vw] sm:block">
      <div className="mx-auto flex w-[66.875vw] flex-col items-center gap-[6vw] pt-[7.5vw]">
        {/* Intro */}
        <div className="w-[58.9vw] text-center">
          <Reveal>
            <p className="font-serif text-[min(1.77vw,34px)] font-normal leading-[1.35] text-espresso">
              Thirteen years in entertainment, creating and executive producing
              for Fox, NBC, Amazon, Meta, Netflix, and more, from first concept to
              final cut.
            </p>
          </Reveal>
        </div>

        {/* Amazon Alexa */}
        <Landscape
          src={`${V}/prod-alexa.mp4`}
          aspect="aspect-[1284/698]"
          badges={["Branded Content"]}
          note="*Amazon aired this as a national commercial!"
          logo={`${L}/alexa.svg`}
          client="Amazon Alexa"
          project="Alexa Stories"
          role="Executive Producer"
        />

        {/* Meta — 3 vertical clips + panel */}
        <div className="flex h-[24.84vw] w-full items-stretch gap-[1.1vw]">
          {[1, 2, 3].map((n) => (
            <Reveal
              key={n}
              blur
              delay={n * 90}
              className="relative aspect-[265/477] overflow-hidden rounded-[0.83vw]"
            >
              {n === 1 && <BadgeStack labels={["Branded Content"]} />}
              <ProdVideo src={`${V}/prod-meta-${n}.mp4`} />
            </Reveal>
          ))}
          <div className="ml-auto w-[22.3vw]">
            <Panel
              logo={`${L}/meta.svg`}
              client="Meta/Instagram"
              project="IGTV & Reels Product Rollout"
              role="Executive Producer"
            />
          </div>
        </div>

        {/* Amazon Music — The Walk-In */}
        <Landscape
          src={`${V}/prod-amazon-walkin.mp4`}
          aspect="aspect-[1284/693]"
          badges={["Webby Award Nominee"]}
          logo={`${L}/amazonmusic.svg`}
          client="Amazon Music"
          project="The Walk-In (Original Series)"
          role="Co-developer & Executive Producer"
        />

        {/* Amazon Music — The Lead Up */}
        <Landscape
          src={`${V}/prod-amazon-leadup.mp4`}
          aspect="aspect-[1280/691]"
          badges={["Webby Award Nominee"]}
          logo={`${L}/amazonmusic.svg`}
          client="Amazon Music"
          project="The Lead Up w/ Kim Petras"
          role="Developer & Executive Producer"
        />

        {/* Netflix — Showcase */}
        <Landscape
          src={`${V}/prod-netflix.mp4`}
          aspect="aspect-[1280/691]"
          badges={["Optioned by Netflix"]}
          logo={`${L}/netflix.svg`}
          client="Netflix"
          project="Showcase"
          role="Series Creator/Producer & Editor"
        />

        {/* Personal — panel + 3 vertical clips */}
        <div className="flex h-[24.84vw] w-full items-stretch gap-[1.1vw]">
          <div className="mr-auto w-[21.8vw]">
            <Panel
              heading="…life content"
              client="Me, Myself, and I"
              project="Globe trotting"
              role="Editing for fun"
            />
          </div>
          {[1, 2, 3].map((n) => (
            <Reveal
              key={n}
              blur
              delay={n * 90}
              className="relative aspect-[263/477] overflow-hidden rounded-[0.83vw]"
            >
              <ProdVideo src={`${V}/prod-life-${n}.mp4`} />
            </Reveal>
          ))}
        </div>

        {/* Hello Pictures — America Sings! */}
        <Landscape
          src={`${V}/prod-hellopictures.mp4`}
          aspect="aspect-[1280/691]"
          logo={`${L}/hellopictures.png`}
          client="Hello Pictures"
          project="America Sings!"
          role="Series Creator/Producer & Editor"
        />

        {/* Studio71 — Guess Who's Home */}
        <Landscape
          src={`${V}/prod-studio71.mp4`}
          aspect="aspect-[1268/684]"
          logo={`${L}/studio71.svg`}
          client="Studio71"
          project="Guess Who’s Home"
          role="Series Creator/Producer & Editor"
        />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- mobile -- */

function MRow({ logo, client, project, role }: { logo?: string; client: string; project: string; role: string }) {
  return (
    <div className="mt-3 rounded-2xl bg-[#F7ECD9] px-4 py-4">
      {logo && <img src={logo} alt={client} loading="lazy" decoding="async" className="mx-auto mb-3 h-6 w-auto object-contain" />}
      <div className="grid grid-cols-3 divide-x divide-[#3b230e]/20 text-center">
        {[["Client", client], ["Project", project], ["Role", role]].map(([h, v]) => (
          <div key={h} className="flex flex-col gap-1 px-2">
            <span className="font-sans text-[0.62rem] font-bold uppercase tracking-wide text-[#3b230e]">{h}</span>
            <span className="font-serif text-[0.72rem] italic leading-tight text-[#3b230e]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BodyMobile() {
  const landscapes = [
    { src: "prod-alexa", aspect: "aspect-[1284/698]", client: "Amazon Alexa", project: "Alexa Stories", role: "Executive Producer", logo: `${L}/alexa.svg`, badges: ["Branded Content"] },
    { src: "prod-amazon-walkin", aspect: "aspect-[1284/693]", client: "Amazon Music", project: "The Walk-In (Original Series)", role: "Co-developer & Executive Producer", logo: `${L}/amazonmusic.svg`, badges: ["Webby Award Nominee"] },
    { src: "prod-amazon-leadup", aspect: "aspect-[1280/691]", client: "Amazon Music", project: "The Lead Up w/ Kim Petras", role: "Developer & Executive Producer", logo: `${L}/amazonmusic.svg`, badges: ["Webby Award Nominee"] },
    { src: "prod-netflix", aspect: "aspect-[1280/691]", client: "Netflix", project: "Showcase", role: "Series Creator/Producer & Editor", logo: `${L}/netflix.svg`, badges: ["Optioned by Netflix"] },
    { src: "prod-hellopictures", aspect: "aspect-[1280/691]", client: "Hello Pictures", project: "America Sings!", role: "Series Creator/Producer & Editor", logo: `${L}/hellopictures.png`, badges: undefined as string[] | undefined },
    { src: "prod-studio71", aspect: "aspect-[1268/684]", client: "Studio71", project: "Guess Who’s Home", role: "Series Creator/Producer & Editor", logo: `${L}/studio71.svg`, badges: undefined as string[] | undefined },
  ];
  const trio = (prefix: string, badge?: string) => (
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="relative aspect-[265/477] overflow-hidden rounded-xl">
          {n === 1 && badge && <MBadgeStack labels={[badge]} />}
          <ProdVideo src={`${V}/${prefix}-${n}.mp4`} />
        </div>
      ))}
    </div>
  );

  return (
    <section className="flex flex-col gap-10 px-5 py-12 sm:hidden">
      <p className="text-center font-serif text-lg leading-snug text-espresso">
        Thirteen years in entertainment, creating and executive producing for Fox,
        NBC, Amazon, Meta, Netflix, and more, from first concept to final cut.
      </p>

      {/* Alexa */}
      <div>
        <div className="relative aspect-[1284/698] w-full overflow-hidden rounded-2xl">
          <MBadgeStack labels={["Branded Content"]} />
          <ProdVideo src={`${V}/prod-alexa.mp4`} />
        </div>
        <MRow logo={`${L}/alexa.svg`} client="Amazon Alexa" project="Alexa Stories" role="Executive Producer" />
      </div>

      {/* Meta */}
      <div>
        {trio("prod-meta", "Branded Content")}
        <MRow logo={`${L}/meta.svg`} client="Meta/Instagram" project="IGTV & Reels Product Rollout" role="Executive Producer" />
      </div>

      {landscapes.slice(1, 4).map((p) => (
        <div key={p.src}>
          <div className={`relative w-full overflow-hidden rounded-2xl ${p.aspect}`}>
            {p.badges && <MBadgeStack labels={p.badges} />}
            <ProdVideo src={`${V}/${p.src}.mp4`} />
          </div>
          <MRow logo={p.logo} client={p.client} project={p.project} role={p.role} />
        </div>
      ))}

      {/* Personal */}
      <div>
        {trio("prod-life")}
        <MRow client="Me, Myself, and I" project="Globe trotting" role="Editing for fun" />
      </div>

      {landscapes.slice(4).map((p) => (
        <div key={p.src}>
          <div className={`relative w-full overflow-hidden rounded-2xl ${p.aspect}`}>
            {p.badges && <MBadgeStack labels={p.badges} />}
            <ProdVideo src={`${V}/${p.src}.mp4`} />
          </div>
          <MRow logo={p.logo} client={p.client} project={p.project} role={p.role} />
        </div>
      ))}
    </section>
  );
}

export default function ProdBody() {
  return (
    <>
      <BodyMobile />
      <BodyDesktop />
    </>
  );
}
