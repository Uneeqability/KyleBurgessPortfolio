/* eslint-disable @next/next/no-img-element */
/**
 * BidBud — case-study hero (Figma 528:656 / lockup 649:486). Same structure and
 * spacing as the other case-study heroes: an #F7ECD9 plate → serif title +
 * subtitle → a beige #E1DBC6 plate with the brand lockup peeking up on it.
 *
 * The lockup is kept as its designed layers (not a flat image) so it can be
 * animated later: the "Bid" and "Bud" wordmark halves are live DM Serif Text,
 * and the dog mascot is its own SVG walking between them. Layout matches the
 * 1090×603 Figma frame; sizing is container-query based so it scales with width.
 */
import Reveal from "@/components/Reveal";

/** The BidBud dog + wordmark lockup — separate, animatable layers. */
function BrandLockup({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[1090/603] [container-type:inline-size] ${className}`}
      data-bidbud-lockup
    >
      <span
        data-bidbud-word="bid"
        className="absolute left-0 top-[35.5%] leading-none text-[26.02cqw] text-[#cc653c]"
        style={{ fontFamily: "var(--font-dm-serif)" }}
      >
        Bid
      </span>
      <span
        data-bidbud-word="bud"
        className="absolute left-[55.6%] top-[35.5%] leading-none text-[26.02cqw] text-[#cc653c]"
        style={{ fontFamily: "var(--font-dm-serif)" }}
      >
        Bud
      </span>
      {/* Looping walk-cycle mascot with a transparent background — HEVC-alpha MP4
          for Safari, VP9-alpha WebM for Chrome/Firefox/Edge. */}
      <video
        data-bidbud-dog
        autoPlay
        loop
        muted
        playsInline
        aria-label="BidBud mascot walking"
        className="absolute left-[27.5%] top-[-2%] w-[38%]"
      >
        <source src="/videos/bidbud-dog.mp4" type='video/mp4; codecs="hvc1"' />
        <source src="/videos/bidbud-dog.webm" type="video/webm" />
      </video>
    </div>
  );
}

export default function HeroBidBud() {
  return (
    <>
      <HeroMobile />
      <HeroDesktop />
    </>
  );
}

function HeroMobile() {
  return (
    <section className="bg-[#F7ECD9] px-5 pb-10 pt-14 text-center sm:hidden">
      <Reveal>
        <h1 className="font-serif text-[2rem] font-normal leading-[1.15] text-espresso">
          BidBud
        </h1>
      </Reveal>
      <Reveal className="mt-4" delay={120}>
        <p className="mx-auto max-w-md font-roboto text-[0.95rem] leading-relaxed text-taupe">
          Contractors can&rsquo;t afford to bid on every job. I&rsquo;m building
          something that fixes that.
        </p>
      </Reveal>
      <BrandLockup className="mx-auto mt-4 w-[82vw]" />
    </section>
  );
}

function HeroDesktop() {
  return (
    <section className="relative hidden h-[49.5vw] w-full overflow-hidden sm:block">
      {/* #F7ECD9 hero plate */}
      <div className="absolute inset-x-0 top-0 h-[40vw] bg-[#F7ECD9]" />

      {/* Title + subtitle */}
      <div className="absolute inset-x-0 top-[7.8vw] px-6 text-center">
        <Reveal>
          <h1 className="font-serif text-[min(3.125vw,60px)] font-normal leading-[1.2] text-espresso">
            BidBud
          </h1>
        </Reveal>
        <Reveal className="mt-[1.3vw]" delay={120}>
          <p className="mx-auto max-w-[46vw] font-roboto text-[min(1.302vw,25px)] leading-[1.4] text-taupe">
            Contractors can&rsquo;t afford to bid on every job. I&rsquo;m building
            something that fixes that.
          </p>
        </Reveal>
      </div>

      {/* Beige plate (Figma "Hero image") */}
      <div className="absolute left-[12.71vw] top-[27vw] h-[20.5vw] w-[74.53vw] rounded-[1.47vw] bg-[#E1DBC6]" />

      {/* Brand lockup, peeking up on the plate */}
      <BrandLockup className="absolute left-1/2 top-[18vw] w-[54vw] -translate-x-1/2" />
    </section>
  );
}
