import Reveal from "@/components/Reveal";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";
import ChallengePhones from "./ChallengePhones";
import FannedPhones from "./FannedPhones";
import BrandBento from "./BrandBento";

/**
 * Twain case-study body. A centered flex column with one uniform gap, so every
 * text section has equal padding above and below (and equal spacing between all
 * cards). The mockup cards keep their own internal %-based layouts. Desktop.
 */
const eyebrow =
  "font-mono text-[min(1.5625vw,30px)] font-bold uppercase tracking-[0.1em] text-[#141414]";
const body = "font-roboto text-[min(0.9375vw,18px)] leading-[1.33] text-[#353536]";

/** A centered heading + paragraph section (blur-in eyebrow, fade-up body). */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="w-[50.47vw] text-center">
      <h2 className={eyebrow}>
        <BlurTextEffect>{label}</BlurTextEffect>
      </h2>
      <Reveal className="mt-[1.5vw]" delay={120}>
        <p className={body}>{children}</p>
      </Reveal>
    </div>
  );
}

export default function TwainBody() {
  return (
    <>
      <BodyMobile />
      <BodyDesktop />
    </>
  );
}

/* ---------------------------------------------------------------- desktop -- */

function BodyDesktop() {
  return (
    <section className="hidden sm:block">
      <div className="mx-auto flex w-full flex-col items-center gap-[8vw] pb-[8vw] pt-[8vw]">
        {/* The Role */}
        <Section label="The Role:">
          Creative Director. Brand, product design, pitch, and prototype, start
          to finish.
        </Section>

        {/* The challenge — card with left text + right phones */}
        <div className="relative h-[38.44vw] w-[73.54vw] rounded-[1.15vw] bg-[#F7ECD9]">
          <div className="absolute left-[3.4vw] top-[8.9vw] w-[21.1vw]">
            <h2 className={eyebrow}>
              <BlurTextEffect>The challenge:</BlurTextEffect>
            </h2>
            <Reveal className="mt-[2vw]" delay={120}>
              <p className={body}>
                Dating apps optimize for the wrong thing. They front-load photos
                and bios, the signals that don&rsquo;t predict chemistry, and
                gatekeep the one that does: actually talking. The challenge I set
                myself was to fix that at the root, and turn the fix into
                something real, a product, a brand, and a business coherent enough
                to survive an investor&rsquo;s scrutiny and a designer&rsquo;s
                craft bar at once. No brief, no team, no client. Just the idea and
                the discipline to carry it all the way.
              </p>
            </Reveal>
          </div>
          <ChallengePhones />
        </div>

        {/* What I did */}
        <Section label="What I did:">
          I built Twain end to end. The strategic premise, the brand identity,
          the investor pitch, the go-to-market, and the technical build path,
          every surface, solo. The bet: replace endless texting with 60-second
          live calls between two people who are both online right now. By the end
          you each answer one question, feeling it? Mutual yes opens the
          conversation. The whole product runs on one principle, honest clarity
          over false hope.
        </Section>

        {/* UI slide — 5 fanned phones */}
        <div className="relative h-[41.09vw] w-[73.54vw] overflow-hidden rounded-[1.15vw] bg-[#F7ECD9]">
          <FannedPhones />
        </div>

        {/* The idea behind it */}
        <Section label="The idea behind it:">
          Every choice had to be defensible twice, as design and as strategy. The
          brand is the deliberate opposite of the category: no reds, no flames, no
          neon. Sage, beige, and cream, a romantic serif, a calm confidence that
          reads as the grown-up in a loud room. Even the name carries the thesis,
          &ldquo;tw&amp;in,&rdquo; the ampersand standing in for two people
          connected, extended across the whole system. The restraint is the
          differentiation.
        </Section>

        {/* Brand bento */}
        <div className="relative h-[27.66vw] w-[78.75vw]">
          <BrandBento />
        </div>

        {/* What I built */}
        <Section label="What I built:">
          A complete body of work from a single idea: a 12-screen iOS system
          designed for one specific human behavior, a full brand identity,
          marketing and poster concepts, a 28-slide investor deck that opens on
          emotion and lands on market data, and a scoped, buildable tech stack.
        </Section>

        {/* Urban billboard */}
        <Reveal blur className="relative h-[39.79vw] w-[78.75vw] overflow-hidden rounded-[1.15vw]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/twain/urban-billboard.jpg"
            alt="twain billboard on a city storefront — 'skip to the part that matters'"
            loading="lazy"
            decoding="async"
            className="absolute left-[-0.04%] top-[-30.39%] h-[131.34%] w-full max-w-none object-cover"
          />
        </Reveal>

        {/* The Quick Pitch */}
        <Section label="The Quick Pitch:">
          Here&rsquo;s the idea, start to finish, in my own voice. (Excuse the bad
          hair cut)
        </Section>

        {/* Explainer video */}
        <Reveal blur className="relative h-[44.27vw] w-[78.75vw] overflow-hidden rounded-[0.83vw]">
          <video
            controls
            playsInline
            preload="metadata"
            poster="/images/twain/explainer-poster.png"
            className="size-full object-cover"
          >
            <source src="/videos/twain-explainer.mp4" type="video/mp4" />
          </video>
        </Reveal>

        {/* The outcome */}
        <Section label="The outcome:">
          A complete vision, ready to build. One insight carried across brand,
          product, narrative, business, and a real technical path, produced solo
          and unbriefed. It&rsquo;s a concept I&rsquo;m actively bringing to life,
          the full arc of creative direction, with the next step being a
          real-world test in LA.
        </Section>

        {/* Golden-hour billboard */}
        <Reveal blur className="relative h-[35.52vw] w-[72.24vw] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/twain/golden-billboard.jpg"
            alt="twain highway billboard at golden hour — 'from 60 seconds to something real'"
            loading="lazy"
            decoding="async"
            className="absolute left-[-5.94%] top-[-3.91%] h-[107.18%] w-[107.15%] max-w-none object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- mobile -- */

const mEyebrow =
  "font-mono text-base font-bold uppercase tracking-[0.12em] text-[#141414]";
const mBody = "font-roboto text-[0.9rem] leading-relaxed text-[#353536]";

function MSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <h2 className={mEyebrow}>
        <BlurTextEffect>{label}</BlurTextEffect>
      </h2>
      <Reveal className="mt-3" delay={120}>
        <p className={mBody}>{children}</p>
      </Reveal>
    </div>
  );
}

/**
 * Mobile stack: one column, readable rem text, full-width cards. The composed
 * cards reuse the same %-based mockup components at their desktop aspect ratios
 * so the internal layouts stay intact; the challenge card is cropped to its
 * phones (its text is shown as a normal section above instead of inside it).
 */
function BodyMobile() {
  return (
    <section className="flex flex-col gap-14 px-5 py-14 sm:hidden">
      <MSection label="The Role:">
        Creative Director. Brand, product design, pitch, and prototype, start to
        finish.
      </MSection>

      <MSection label="The challenge:">
        Dating apps optimize for the wrong thing. They front-load photos and
        bios, the signals that don&rsquo;t predict chemistry, and gatekeep the
        one that does: actually talking. The challenge I set myself was to fix
        that at the root, and turn the fix into something real, a product, a
        brand, and a business coherent enough to survive an investor&rsquo;s
        scrutiny and a designer&rsquo;s craft bar at once. No brief, no team, no
        client. Just the idea and the discipline to carry it all the way.
      </MSection>
      {/* challenge phones — cropped to the phones half of the desktop card */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[5vw] bg-[#F7ECD9]">
        <div className="absolute left-[-86%] top-[-3.1%] aspect-[1412/738] w-[200%]">
          <ChallengePhones />
        </div>
      </div>

      <MSection label="What I did:">
        I built Twain end to end. The strategic premise, the brand identity, the
        investor pitch, the go-to-market, and the technical build path, every
        surface, solo. The bet: replace endless texting with 60-second live calls
        between two people who are both online right now. By the end you each
        answer one question, feeling it? Mutual yes opens the conversation. The
        whole product runs on one principle, honest clarity over false hope.
      </MSection>

      {/* UI slide */}
      <div className="relative aspect-[1412/789] w-full overflow-hidden rounded-[4vw] bg-[#F7ECD9]">
        <FannedPhones />
      </div>

      <MSection label="The idea behind it:">
        Every choice had to be defensible twice, as design and as strategy. The
        brand is the deliberate opposite of the category: no reds, no flames, no
        neon. Sage, beige, and cream, a romantic serif, a calm confidence that
        reads as the grown-up in a loud room. Even the name carries the thesis,
        &ldquo;tw&amp;in,&rdquo; the ampersand standing in for two people
        connected, extended across the whole system. The restraint is the
        differentiation.
      </MSection>

      {/* Brand bento */}
      <div className="relative aspect-[1512/531] w-full">
        <BrandBento />
      </div>

      <MSection label="What I built:">
        A complete body of work from a single idea: a 12-screen iOS system
        designed for one specific human behavior, a full brand identity,
        marketing and poster concepts, a 28-slide investor deck that opens on
        emotion and lands on market data, and a scoped, buildable tech stack.
      </MSection>

      {/* Urban billboard */}
      <Reveal blur className="relative aspect-[1512/764] w-full overflow-hidden rounded-[4vw]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/twain/urban-billboard.jpg"
          alt="twain billboard on a city storefront — 'skip to the part that matters'"
          loading="lazy"
          decoding="async"
          className="absolute left-[-0.04%] top-[-30.39%] h-[131.34%] w-full max-w-none object-cover"
        />
      </Reveal>

      <MSection label="The Quick Pitch:">
        Here&rsquo;s the idea, start to finish, in my own voice. (Excuse the bad
        hair cut)
      </MSection>

      {/* Explainer video */}
      <Reveal blur className="relative aspect-[1512/850] w-full overflow-hidden rounded-[3vw]">
        <video
          controls
          playsInline
          preload="metadata"
          poster="/images/twain/explainer-poster.png"
          className="size-full object-cover"
        >
          <source src="/videos/twain-explainer.mp4" type="video/mp4" />
        </video>
      </Reveal>

      <MSection label="The outcome:">
        A complete vision, ready to build. One insight carried across brand,
        product, narrative, business, and a real technical path, produced solo
        and unbriefed. It&rsquo;s a concept I&rsquo;m actively bringing to life,
        the full arc of creative direction, with the next step being a real-world
        test in LA.
      </MSection>

      {/* Golden-hour billboard */}
      <Reveal blur className="relative aspect-[1387/682] w-full overflow-hidden rounded-[3vw]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/twain/golden-billboard.jpg"
          alt="twain highway billboard at golden hour — 'from 60 seconds to something real'"
          loading="lazy"
          decoding="async"
          className="absolute left-[-5.94%] top-[-3.91%] h-[107.18%] w-[107.15%] max-w-none object-cover"
        />
      </Reveal>
    </section>
  );
}
