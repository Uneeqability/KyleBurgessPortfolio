/**
 * "Creative direction for high-stakes moments." — full-bleed section built from
 * the Figma frame (1920×1059):
 *
 *   sage panel   #A5A894, radius 80px, full width (flush to screen edges)
 *   cream inset  743px tall, radius 64px, linear-gradient(104.44deg,#FBF4E6 42.54%,#DDD3C2 92.77%)
 *   heading      IBM Plex Serif 74.57px, #3B230E, blur(1.657px) over the block
 *   subtitle     IBM Plex Mono Light 29px / 48px, #3B230E
 *   trusted by   IBM Plex Mono 30px, #FFFFEB, letter-spacing -0.96px
 *
 * Desktop scales the whole frame with `aspect-ratio` so every px maps to a %.
 * The logo row is a marquee track (duplicated) ready for the infinite-scroll.
 */

import DiagonalScrollBlur from "@/components/DiagonalScrollBlur";

const TRUSTED_ALT =
  "Trusted by Instagram, NBC, Universal, Netflix, Billboard, FOX, Facebook, Meta, Amazon Music, Microsoft, BBC, National Lampoon, Sony Music, Copilot and Hollywood Records";

/**
 * Infinite logo marquee — two identical strips side by side, the pair sliding
 * left forever. When the first strip has scrolled one full width out, the second
 * sits exactly where it began, so the loop is seamless.
 */
function LogoMarquee({ height }: { height: string }) {
  return (
    <div className="flex w-full overflow-hidden">
      <div className="animate-marquee flex shrink-0">
        <img
          src="/images/trusted-logos.svg"
          alt={TRUSTED_ALT}
          loading="lazy"
          decoding="async"
          className={`${height} w-auto max-w-none shrink-0`}
        />
        <img
          src="/images/trusted-logos.svg"
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className={`${height} w-auto max-w-none shrink-0`}
        />
      </div>
    </div>
  );
}

export default function CreativeDirection() {
  return (
    <section className="relative z-20 -mt-[13vw] w-full sm:-mt-[18.2vw]">
      {/* ---------- Desktop: exact 1920×1059 frame ---------- */}
      <div className="relative hidden aspect-[1920/1059] w-full overflow-hidden rounded-[4.17vw] bg-sage sm:block">
        {/* Cream gradient inset */}
        <div className="absolute inset-x-0 top-0 h-[70.16%] rounded-[3.33vw] bg-[linear-gradient(104.44deg,#FBF4E6_42.54%,#DDD3C2_92.77%)]" />

        {/* Heading + subtitle — soft blur that resolves diagonally on scroll */}
        <DiagonalScrollBlur
          className="absolute inset-x-[14.27%] top-0 h-[70.16%]"
          contentClassName="flex h-full flex-col items-center justify-center text-center"
          maxBlur={5}
        >
          <h2 className="font-serif text-[3.884vw] font-normal leading-none text-espresso">
            <span className="block">Creative direction</span>
            <span className="block italic">for high-stakes moments.</span>
          </h2>
          <p className="mt-[2.45vw] max-w-[46.9vw] font-mono text-[1.51vw] font-light leading-[1.656] text-espresso">
            Executive communication design, motion, and brand systems at
            Microsoft AI.
          </p>
        </DiagonalScrollBlur>

        {/* Trusted by */}
        <p className="absolute inset-x-0 top-[77%] text-center font-mono text-[1.5625vw] tracking-[-0.032em] text-apricot">
          Trusted by:
        </p>

        {/* Logo marquee — scrolls left in unison, infinite loop */}
        <div className="absolute inset-x-0 top-[88%]">
          <LogoMarquee height="h-[3.4vw]" />
        </div>
      </div>

      {/* ---------- Mobile: fluid stack ---------- */}
      <div className="overflow-hidden rounded-[2rem] bg-sage sm:hidden">
        <div className="rounded-[2rem] bg-[linear-gradient(104deg,#FBF4E6_42%,#DDD3C2_93%)] px-6 py-20 text-center">
          <h2 className="font-serif text-[2rem] font-normal leading-tight text-espresso">
            <span className="block">Creative direction</span>
            <span className="block italic">for high-stakes moments.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-sm font-mono text-sm font-light leading-relaxed text-espresso">
            Executive communication design, motion, and brand systems at
            Microsoft AI.
          </p>
        </div>
        <div className="pb-12 pt-8 text-center">
          <p className="font-mono text-lg tracking-tight text-apricot">
            Trusted by:
          </p>
          <div className="mt-6">
            <LogoMarquee height="h-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
