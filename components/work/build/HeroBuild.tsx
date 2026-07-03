/**
 * Microsoft Build 2026 — case-study hero (Figma section 6:2654 + Header 60:1053).
 *
 *   #F7ECD9 plate behind the title/subtitle, then a beige (#E1DBC6) rounded plate
 *   holding a near-black iPad mockup whose screen plays the keynote video. The
 *   device peeks up above the plate and is clipped at the frame's bottom edge.
 *
 * All sizing is vw-mapped from the 1920px Figma frame (px ÷ 19.2). Mirrors the
 * Microsoft AI hero; the keynote video attempts sound-on autoplay (see
 * BuildHeroVideo). Each piece is its own positioned element, ready to animate.
 */
import Reveal from "@/components/Reveal";
import BuildHeroVideo from "./BuildHeroVideo";

export default function HeroBuild() {
  return (
    <>
      <HeroMobile />
      <HeroDesktop />
    </>
  );
}

/** Mobile hero (<640px): readable title/subtitle + the keynote video framed. */
function HeroMobile() {
  return (
    <section className="bg-[#F7ECD9] px-5 pb-16 pt-14 text-center sm:hidden">
      <Reveal>
        <h1 className="font-serif text-[2rem] font-normal leading-[1.15] text-espresso">
          Microsoft Build 2026
        </h1>
      </Reveal>
      <Reveal className="mt-4" delay={120}>
        <p className="mx-auto max-w-sm font-roboto text-[0.95rem] leading-relaxed text-taupe">
          Design and motion direction for the Microsoft Build 2026 keynote,
          launching Microsoft AI&rsquo;s new model family
        </p>
      </Reveal>
      <div className="mx-auto mt-9 max-w-sm overflow-hidden rounded-t-2xl border-2 border-white/50 bg-[#191919] shadow-[0_12px_30px_rgba(0,0,0,0.15)]">
        <BuildHeroVideo
          className="aspect-[1018/610] w-full object-cover"
          poster="/images/build/hero-poster.jpg"
          buttonSize="9vw"
        />
      </div>
    </section>
  );
}

/** Desktop/tablet hero (≥640px): the pixel-exact vw-scaled iPad layout. */
function HeroDesktop() {
  return (
    <section className="relative hidden h-[67.66vw] w-full overflow-hidden sm:block">
      {/* #F7ECD9 hero plate (Figma section bg, ends at y=1056) */}
      <div className="absolute inset-x-0 top-0 h-[55vw] bg-[#F7ECD9]" />

      {/* Title + subtitle */}
      <div className="absolute inset-x-0 top-[13vw] px-6 text-center">
        <Reveal>
          <h1 className="font-serif text-[min(3.125vw,60px)] font-normal leading-[1.2] text-espresso">
            Microsoft Build 2026
          </h1>
        </Reveal>
        <Reveal className="mt-[1.04vw]" delay={120}>
          <p className="mx-auto max-w-[38.33vw] font-roboto text-[min(1.25vw,24px)] leading-[1.45] text-taupe">
            Design and motion direction for the Microsoft Build 2026 keynote,
            launching Microsoft AI&rsquo;s new model family
          </p>
        </Reveal>
      </div>

      {/* Hero device — clipped frame (Figma "Header" 60:1053) */}
      <div className="absolute left-1/2 top-[33.39vw] h-[34.27vw] w-[73.54vw] -translate-x-1/2 overflow-hidden">
        {/* Beige plate behind the device */}
        <div className="absolute left-0 top-[28.9%] h-[71.1%] w-full rounded-[2.34vw] bg-[#E1DBC6]" />

        {/* iPad bezel — top + sides only, bottom cropped by the frame */}
        <div className="absolute left-1/2 top-[3.8%] h-[96.2%] w-[74.79%] -translate-x-1/2 overflow-hidden rounded-t-[1.36vw] border-x-[2px] border-t-[2px] border-white/50 bg-[#191919] shadow-[0_-0.23vw_1.13vw_rgba(0,0,0,0.1)]">
          {/* Inner screen — the keynote video. Extends past the frame's bottom
              crop so the video fills to the cut edge (no black bezel sliver). */}
          <div className="absolute left-1/2 top-[3.29%] bottom-[-0.3vw] w-[96.4%] -translate-x-1/2 overflow-hidden rounded-t-[0.9vw]">
            <BuildHeroVideo
              className="h-full w-full object-cover"
              poster="/images/build/hero-poster.jpg"
              buttonSize="2.4vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
