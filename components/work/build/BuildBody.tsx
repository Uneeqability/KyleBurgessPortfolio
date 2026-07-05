import Reveal from "@/components/Reveal";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";
import ImpactSplit from "./ImpactSplit";
import KeynoteCard from "./KeynoteCard";

/* eslint-disable @next/next/no-img-element */

/**
 * Microsoft Build 2026 case-study body.
 *  - ≥640px: pixel-exact vw-scaled absolute layout (Figma frame 478:129, ÷19.2).
 *  - <640px: single-column mobile flow, readable rem text, full-width graphics.
 *
 * Section rhythm: eyebrow blurs in (BlurTextEffect), body fades up (Reveal),
 * image cards soft-blur in (Reveal blur). The closing keynote card keeps its own
 * layered structure for a later entrance animation.
 */
export default function BuildBody() {
  return (
    <>
      <BodyDesktop />
      <BodyMobile />
    </>
  );
}

/* ---------------------------------------------------------------- desktop -- */

const dEyebrow =
  "font-mono text-[min(1.5625vw,30px)] font-bold uppercase tracking-[0.1em] text-[#141414]";
const dBody = "font-roboto text-[min(1.1458vw,22px)] leading-[1.5] text-[#353536]";

/** A centered eyebrow + body block. `gap` is the eyebrow→body spacing. */
function DSection({
  label,
  width,
  gap = "1.2vw",
  children,
}: {
  label: string;
  width: string;
  gap?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center" style={{ width }}>
      <h2 className={dEyebrow}>
        <BlurTextEffect>{label}</BlurTextEffect>
      </h2>
      <div style={{ marginTop: gap }}>
        <Reveal delay={120}>
          <p className={dBody}>{children}</p>
        </Reveal>
      </div>
    </div>
  );
}

/**
 * Centered flex column with ONE uniform gap, so every text/title/card is an
 * equal distance apart (the hero→first and last→footer gaps use pt/pb to match).
 * Image cards keep their exact Figma crops; only the spacing rhythm is uniform.
 */
function BodyDesktop() {
  return (
    <section className="hidden w-full pb-[7.5vw] pt-[7.5vw] sm:block">
      <div className="mx-auto flex w-[73.54vw] flex-col items-center gap-[7.5vw]">
        {/* The Role — distinct mono/espresso lead */}
        <div className="w-[44vw] text-center">
          <h2 className="font-mono text-[min(1.5625vw,30px)] font-bold uppercase tracking-[0.1em] text-espresso">
            <BlurTextEffect>The Role:</BlurTextEffect>
          </h2>
          <Reveal className="mt-[0.9vw]" delay={120}>
            <p className="font-mono text-[min(1.302vw,25px)] font-light leading-[1.55] text-espresso">
              Design and motion direction, across multiple external agencies.
            </p>
          </Reveal>
        </div>

        {/* Role image — "Humanist / Superintelligence" */}
        <Reveal
          blur
          className="relative h-[38.28vw] w-[71.46vw] overflow-hidden rounded-[1.44vw]"
        >
          <img
            src="/images/build/role.jpg"
            alt="Mustafa Suleyman on the Build 2026 stage — 'Humanist Superintelligence'"
            loading="lazy"
            decoding="async"
            className="absolute left-0 top-[-8.26%] h-[124.46%] w-full max-w-none object-cover"
          />
        </Reveal>

        {/* The challenge */}
        <DSection label="The challenge:" width="50.47vw">
          Microsoft AI was unveiling its first in-house model family, headlined by
          flagship MAI-Thinking-1, on the keynote stage at Build 2026. A dense
          technical launch had to feel inevitable and exciting to a global
          audience, and the motion across the entire reveal had to move as one
          visual language even with multiple agencies feeding into it.
        </DSection>

        {/* Challenge image — Base Model diagram */}
        <Reveal
          blur
          className="relative h-[37.4vw] w-[71.46vw] overflow-hidden rounded-[1.44vw]"
        >
          <img
            src="/images/build/challenge.jpg"
            alt="Keynote stage showing the model architecture diagram"
            loading="lazy"
            decoding="async"
            className="absolute left-0 top-[-24.35%] h-[127.45%] w-full max-w-none object-cover"
          />
        </Reveal>

        {/* What I did */}
        <DSection label="What I did:" width="50.16vw">
          I designed and directed the keynote, setting the visual approach and
          pulling multiple external agencies toward a single coherent look. I
          shaped how each model was revealed, turning complex capabilities into
          sequences an audience could feel, not just follow.
        </DSection>

        {/* What I did image — model panels */}
        <Reveal
          blur
          className="relative h-[30.26vw] w-[71.46vw] overflow-hidden rounded-[1.27vw]"
        >
          <img
            src="/images/build/whatidid.jpg"
            alt="Keynote stage with the model reveal panels"
            loading="lazy"
            decoding="async"
            className="absolute left-0 top-[-40.52%] h-[157.45%] w-full max-w-none object-cover"
          />
        </Reveal>

        {/* The outcome */}
        <DSection label="The outcome:" width="51.25vw">
          The opening keynote has been viewed over a million times, with the
          motion carrying the visual tone of Microsoft AI&rsquo;s biggest launch
          to date.
        </DSection>

        {/* Outcome image — Microsoft + Mayo Clinic */}
        <Reveal
          blur
          className="relative h-[37.4vw] w-[71.46vw] overflow-hidden rounded-[1.44vw]"
        >
          <img
            src="/images/build/outcome.jpg"
            alt="Keynote stage — Microsoft and Mayo Clinic partnership"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </Reveal>

        {/* The impact */}
        <DSection label="The IMPACT:" width="51.25vw">
          The keynote was the center of the launch, but the work wasn&rsquo;t
          exclusive to the stage. Assets I helped design for it, from the symbols
          for all seven models to graphics like the frontier tuning layer stack,
          were lifted straight into the marketing and social rollout.
        </DSection>

        {/* Impact split — the work / the rollout */}
        <div className="h-[56.41vw] w-[73.54vw]">
          <ImpactSplit />
        </div>

        {/* Closing keynote card */}
        <div className="h-[43.44vw] w-[73.54vw]">
          <KeynoteCard />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- mobile -- */

const mEyebrow =
  "font-mono text-base font-bold uppercase tracking-[0.1em] text-[#141414]";
const mBody = "font-roboto text-[0.95rem] leading-relaxed text-[#353536]";

function MSection({
  label,
  espresso = false,
  children,
}: {
  label: string;
  espresso?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <h2 className={espresso ? mEyebrow.replace("text-[#141414]", "text-espresso") : mEyebrow}>
        <BlurTextEffect>{label}</BlurTextEffect>
      </h2>
      <Reveal className="mt-3" delay={120}>
        <p className={espresso ? "font-mono text-[0.95rem] font-light leading-relaxed text-espresso" : mBody}>
          {children}
        </p>
      </Reveal>
    </div>
  );
}

function MImage({
  src,
  alt,
  ratio,
  rounded = "rounded-[4vw]",
}: {
  src: string;
  alt: string;
  ratio: string;
  rounded?: string;
}) {
  return (
    <Reveal blur className={`relative w-full overflow-hidden ${rounded}`}>
      <div className={ratio}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      </div>
    </Reveal>
  );
}

function BodyMobile() {
  return (
    <section className="flex flex-col gap-12 px-5 py-12 sm:hidden">
      <MSection label="The Role:" espresso>
        Design and motion direction, across multiple external agencies.
      </MSection>
      <MImage src="/images/build/role.jpg" alt="Build 2026 stage — 'Humanist Superintelligence'" ratio="relative aspect-[1372/735]" />

      <MSection label="The challenge:">
        Microsoft AI was unveiling its first in-house model family, headlined by
        flagship MAI-Thinking-1, on the keynote stage at Build 2026. A dense
        technical launch had to feel inevitable and exciting to a global
        audience, and the motion across the entire reveal had to move as one
        visual language even with multiple agencies feeding into it.
      </MSection>
      <MImage src="/images/build/challenge.jpg" alt="Keynote stage showing the model architecture diagram" ratio="relative aspect-[1372/718]" />

      <MSection label="What I did:">
        I designed and directed the keynote, setting the visual approach and
        pulling multiple external agencies toward a single coherent look. I shaped
        how each model was revealed, turning complex capabilities into sequences
        an audience could feel, not just follow.
      </MSection>
      <MImage src="/images/build/whatidid.jpg" alt="Keynote stage with the model reveal panels" ratio="relative aspect-[1372/581]" />

      <MSection label="The outcome:">
        The opening keynote has been viewed over a million times, with the motion
        carrying the visual tone of Microsoft AI&rsquo;s biggest launch to date.
      </MSection>
      <MImage src="/images/build/outcome.jpg" alt="Keynote stage — Microsoft and Mayo Clinic partnership" ratio="relative aspect-[1372/718]" />

      <MSection label="The IMPACT:">
        The keynote was the center of the launch, but the work wasn&rsquo;t
        exclusive to the stage. Assets I helped design for it, from the symbols
        for all seven models to graphics like the frontier tuning layer stack,
        were lifted straight into the marketing and social rollout.
      </MSection>

      {/* Impact — work stills + rollout clips, stacked as pairs */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-center font-roboto text-sm text-[#353536]">the work</p>
          <div className="flex flex-col gap-4">
            <MImage src="/images/build/work-frontier.jpg" alt="Keynote still — Microsoft Frontier Tuning layer stack" ratio="relative aspect-[670/447]" />
            <MImage src="/images/build/work-models.jpg" alt="Keynote still — 7 New Microsoft AI Models" ratio="relative aspect-[670/447]" />
          </div>
        </div>
        <div>
          <p className="mb-2 text-center font-roboto text-sm text-[#353536]">the rollout</p>
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[687/456] w-full overflow-hidden rounded-[4vw] bg-[#E7E0CF]">
              <video className="size-full object-cover" autoPlay muted loop playsInline preload="metadata">
                <source src="/videos/build-frontier-tuning.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="relative aspect-[687/447] w-full overflow-hidden rounded-[4vw] bg-[#E7E0CF]">
              <video className="size-full object-cover" autoPlay muted loop playsInline preload="metadata">
                <source src="/videos/build-models.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>

      {/* Closing keynote card — taller aspect than desktop so the orbit stretches
          vertically and the center statement has room to stay legible. */}
      <div className="relative aspect-[1412/1080] w-full">
        <KeynoteCard />
      </div>
    </section>
  );
}
