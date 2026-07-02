import Reveal from "@/components/Reveal";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";
import LaptopScreens from "./LaptopScreens";
import WhatIDid from "./WhatIDid";
import WhatIDidDiagram from "./WhatIDidDiagram";
import VibeToolCard from "./VibeToolCard";
import VibeVoiceCard from "./VibeVoiceCard";
import VibeChartCard from "./VibeChartCard";
import SiteShowcase from "./SiteShowcase";

/**
 * The Microsoft AI Website case-study body.
 *  - ≥640px: the pixel-exact vw-scaled absolute layout (Figma frame 2147265621).
 *  - <640px: a single-column mobile flow with readable rem text and full-width
 *    graphics (cards use container-query units so they stay legible full-width).
 *
 * Scroll-in animations: section eyebrows blur in (BlurTextEffect), body copy
 * fades up (Reveal), the three Vibe cards soft-blur in (Reveal blur). The
 * laptop collage and the "Me" diagram keep their own bespoke animations.
 */
export default function MaiBody() {
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
const dBody =
  "font-roboto text-[min(1.1458vw,22px)] leading-[1.09] text-[#353536]";

function BodyDesktop() {
  return (
    <section className="hidden w-full pb-[18vw] sm:block">
      <div className="relative mx-auto mt-[7.55vw] h-[278.4vw] w-[73.9vw]">
        {/* The role */}
        <div className="absolute left-1/2 top-0 w-[50vw] -translate-x-1/2 text-center">
          <h2 className={dEyebrow}>
            <BlurTextEffect>The Role:</BlurTextEffect>
          </h2>
          <Reveal className="mt-[0.57vw]" delay={120}>
            <p className={dBody}>
              Producer and DRI, with hands-on design and tooling.
            </p>
          </Reveal>
        </div>

        {/* Role collage — laptop + surrounding screenshots */}
        <div className="absolute left-[0.36vw] top-[12.81vw] w-[73.54vw]">
          <LaptopScreens />
        </div>

        {/* The challenge */}
        <div className="absolute left-1/2 top-[71.51vw] w-[50.47vw] -translate-x-1/2 text-center">
          <h2 className={dEyebrow}>
            <BlurTextEffect>The challenge:</BlurTextEffect>
          </h2>
          <Reveal className="mt-[0.57vw]" delay={120}>
            <p className={dBody}>
              A site-wide update had to land in time for Microsoft Build. New and
              expanded model pages, a restructured nav, eight technical blogs, and
              fresh content across the site, on a hard deadline and without
              dedicated design support for everything coming in.
            </p>
          </Reveal>
        </div>

        {/* What I did + collaboration diagram */}
        <div className="absolute left-[0.36vw] top-[91.09vw] w-[73.54vw]">
          <WhatIDid />
        </div>

        {/* Where I stepped in */}
        <div className="absolute left-1/2 top-[134.84vw] w-[49.58vw] -translate-x-1/2 text-center">
          <h2 className={dEyebrow}>
            <BlurTextEffect>Where I stepped in:</BlurTextEffect>
          </h2>
          <Reveal className="mt-[3.02vw]" delay={120}>
            <p className={dBody}>
              When the resourcing ran short, I filled the gaps myself. I designed
              and laid out all technical blogs in Figma, using a Gemini workflow to
              draft each in MAI&rsquo;s style, then finishing by hand. I recorded
              the voiceover for the transcription model page when there was no time
              to hire an agency. And with model data landing last minute, I built a
              self-serve tool that let PMs enter their own numbers and export
              drop-ready JSON straight to dev, so the charts populated themselves.
            </p>
          </Reveal>
        </div>

        {/* Vibe Code — row 1: self-serve tool + voiceover */}
        <Reveal blur className="absolute left-[0.36vw] top-[156.41vw] w-[40.63vw]">
          <VibeToolCard />
        </Reveal>
        <Reveal
          blur
          delay={140}
          className="absolute left-[41.93vw] top-[156.41vw] w-[31.98vw]"
        >
          <VibeVoiceCard />
        </Reveal>

        {/* Vibe Code — row 2: create-a-chart tool + downloads */}
        <Reveal blur className="absolute left-[0.36vw] top-[188.54vw] w-[73.54vw]">
          <VibeChartCard />
        </Reveal>

        {/* The outcome */}
        <div className="absolute left-1/2 top-[226.2vw] w-[49.58vw] -translate-x-1/2 text-center">
          <h2 className={dEyebrow}>
            <BlurTextEffect>The outcome:</BlurTextEffect>
          </h2>
          <Reveal className="mt-[1.56vw]" delay={120}>
            <p className={dBody}>
              A brand new homepage, 7 model pages, and 9 technical blogs, shipped
              on time at Microsoft Build, the front door for Microsoft AI on its
              highest-visibility day of the year.
            </p>
          </Reveal>
        </div>

        {/* Outcome showcase — live site screenshot */}
        <div className="absolute left-0 top-[241vw] w-[71.46vw]">
          <SiteShowcase />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- mobile -- */

const mEyebrow =
  "font-mono text-base font-bold uppercase tracking-[0.1em] text-[#141414]";
const mBody = "font-roboto text-[0.95rem] leading-relaxed text-[#353536]";

function BodyMobile() {
  return (
    <section className="px-5 pb-16 sm:hidden">
      {/* The role */}
      <div className="pt-12 text-center">
        <h2 className={mEyebrow}>
          <BlurTextEffect>The Role:</BlurTextEffect>
        </h2>
        <Reveal className="mt-3" delay={120}>
          <p className={mBody}>
            Producer and DRI, with hands-on design and tooling.
          </p>
        </Reveal>
      </div>

      {/* Role collage */}
      <div className="mt-10">
        <LaptopScreens />
      </div>

      {/* The challenge */}
      <div className="mt-16 text-center">
        <h2 className={mEyebrow}>
          <BlurTextEffect>The challenge:</BlurTextEffect>
        </h2>
        <Reveal className="mt-3" delay={120}>
          <p className={mBody}>
            A site-wide update had to land in time for Microsoft Build. New and
            expanded model pages, a restructured nav, eight technical blogs, and
            fresh content across the site, on a hard deadline and without dedicated
            design support for everything coming in.
          </p>
        </Reveal>
      </div>

      {/* What I did */}
      <div className="mt-16 text-center">
        <h2 className={mEyebrow}>
          <BlurTextEffect>What I did:</BlurTextEffect>
        </h2>
        <Reveal className="mt-3" delay={120}>
          <p className={mBody}>
            I owned the project end to end, from kickoff through launch, directing
            an external design agency and a development agency and aligning ten
            model PMs across six product categories.
          </p>
        </Reveal>
      </div>
      <WhatIDidDiagram className="mt-8 rounded-2xl bg-[#F7ECD9] p-4" />

      {/* Where I stepped in */}
      <div className="mt-16 text-center">
        <h2 className={mEyebrow}>
          <BlurTextEffect>Where I stepped in:</BlurTextEffect>
        </h2>
        <Reveal className="mt-3" delay={120}>
          <p className={mBody}>
            When the resourcing ran short, I filled the gaps myself. I designed and
            laid out all technical blogs in Figma, using a Gemini workflow to draft
            each in MAI&rsquo;s style, then finishing by hand. I recorded the
            voiceover for the transcription model page when there was no time to
            hire an agency. And with model data landing last minute, I built a
            self-serve tool that let PMs enter their own numbers and export
            drop-ready JSON straight to dev, so the charts populated themselves.
          </p>
        </Reveal>
      </div>

      {/* Vibe Code — stacked */}
      <div className="mt-12 space-y-6">
        <Reveal blur>
          <VibeToolCard />
        </Reveal>
        <Reveal blur delay={100}>
          <VibeVoiceCard />
        </Reveal>
        <Reveal blur delay={200}>
          <VibeChartCard />
        </Reveal>
      </div>

      {/* The outcome */}
      <div className="mt-16 text-center">
        <h2 className={mEyebrow}>
          <BlurTextEffect>The outcome:</BlurTextEffect>
        </h2>
        <Reveal className="mt-3" delay={120}>
          <p className={mBody}>
            A brand new homepage, 7 model pages, and 9 technical blogs, shipped on
            time at Microsoft Build, the front door for Microsoft AI on its
            highest-visibility day of the year.
          </p>
        </Reveal>
      </div>

      {/* Outcome showcase — same composition as desktop (caption + arrow over
          the image's empty-left area), sized for mobile. */}
      <div className="mt-14">
        <SiteShowcase />
      </div>
    </section>
  );
}
