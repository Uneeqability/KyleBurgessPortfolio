/**
 * Microsoft AI Website — case-study hero (Figma section 17:3489 + 17:3692).
 *
 *   #F7ECD9 plate behind the title, then a beige (#E1DBC6) rounded plate holding
 *   a black iPad mockup whose screen autoplays a muted video of the site. The
 *   device is clipped at the frame's bottom edge so it reads as "peeking up".
 *
 * All sizing is vw-mapped from the 1920px Figma frame (px ÷ 19.2) so the whole
 * hero scales 1-to-1 with the viewport, matching the homepage's approach. Each
 * piece is its own positioned element, ready to animate individually later.
 */
import Reveal from "@/components/Reveal";

export default function HeroMAI() {
  return (
    <>
      <HeroMobile />
      <HeroDesktop />
    </>
  );
}

/** Mobile hero (<640px): readable title/subtitle + the video in a device frame. */
function HeroMobile() {
  return (
    <section className="bg-[#F7ECD9] px-5 pb-16 pt-14 text-center sm:hidden">
      <Reveal>
        <h1 className="font-serif text-[2rem] font-normal leading-[1.15] text-espresso">
          Microsoft AI Website
        </h1>
      </Reveal>
      <Reveal className="mt-4" delay={120}>
        <p className="mx-auto max-w-xs font-roboto text-[0.95rem] leading-relaxed text-taupe">
          A site-wide update to microsoft.ai, expanded and shipped for Microsoft
          Build.
        </p>
      </Reveal>
      <div className="mx-auto mt-9 max-w-sm overflow-hidden rounded-2xl border-2 border-white/50 bg-black shadow-[0_12px_30px_rgba(0,0,0,0.15)]">
        <video
          className="aspect-[1131/610] w-full object-cover object-top"
          poster="/images/mai/hero-screen.png"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/mai-hero.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

/** Desktop/tablet hero (≥640px): the pixel-exact vw-scaled iPad layout. */
function HeroDesktop() {
  return (
    <section className="relative hidden h-[60.5vw] w-full overflow-hidden sm:block">
      {/* Pink hero plate (Figma section bg, ends at y=1059) */}
      <div className="absolute inset-x-0 top-0 h-[48.02vw] bg-[#F7ECD9]" />

      {/* Title + subtitle */}
      <div className="absolute inset-x-0 top-[11.98vw] px-6 text-center">
        <Reveal>
          <h1 className="font-serif text-[min(3.125vw,60px)] font-normal leading-[1.2] text-espresso">
            Microsoft AI Website
          </h1>
        </Reveal>
        <Reveal className="mt-[1.04vw]" delay={120}>
          <p className="mx-auto max-w-[38.3vw] font-roboto text-[min(1.25vw,24px)] leading-[1.45] text-taupe">
            A site-wide update to microsoft.ai, expanded and shipped for Microsoft
            Build.
          </p>
        </Reveal>
      </div>

      {/* Hero device — clipped frame (Figma "Header" 17:3692) */}
      <div className="absolute left-1/2 top-[26.25vw] h-[34.22vw] w-[73.54vw] -translate-x-1/2 overflow-hidden">
        {/* Beige plate behind the device */}
        <div className="absolute left-0 top-[28.94%] h-[71.2%] w-full rounded-[1.47vw] bg-[#E1DBC6]" />

        {/* iPad bezel — top + side borders only, bottom cropped by the frame */}
        <div className="absolute left-[8.57%] top-[10.81%] h-[99.85%] w-[82.93%] rounded-t-[1.36vw] border-x-[2px] border-t-[2px] border-white/50 bg-black shadow-[0_-0.23vw_1.13vw_rgba(0,0,0,0.1)]" />

        {/* Inner screen — muted autoplay video (poster until the mp4 lands) */}
        <div className="absolute left-[9.99%] top-[14.16%] h-[86.15%] w-[80.1%] overflow-hidden rounded-t-[0.9vw]">
          <video
            className="h-full w-full object-cover object-top"
            poster="/images/mai/hero-screen.png"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/mai-hero.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
