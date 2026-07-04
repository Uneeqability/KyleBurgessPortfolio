/**
 * Production page hero (Figma section 60:133 + TVHead 537:2588).
 *
 *   #F7ECD9 plate behind the title/subtitle, then a beige (#E1DBC6) rounded plate
 *   with the transparent "TV-head" figure looping above it (it peeks up over the
 *   plate and its transparent areas reveal both the plate and the page below —
 *   hence the alpha video). Cross-browser transparency: HEVC-alpha MP4 for Safari,
 *   VP9-alpha WebM for Chrome/Firefox/Edge.
 *
 * vw-mapped from the 1920px Figma frame (px ÷ 19.2). Mirrors the other heroes.
 */
import Reveal from "@/components/Reveal";
import ProdVideo from "./ProdVideo";

const TVHEAD_SOURCES = [
  { src: "/videos/prod/tvhead.mp4", type: 'video/mp4; codecs="hvc1"' },
  { src: "/videos/prod/tvhead.webm", type: "video/webm" },
];

export default function HeroProd() {
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
          Production, Series Creation &amp; Editing
        </h1>
      </Reveal>
      <Reveal className="mt-4" delay={120}>
        <p className="mx-auto max-w-sm font-roboto text-[0.95rem] leading-relaxed text-taupe">
          Original series and campaigns for the brands and networks you already
          know.
        </p>
      </Reveal>
      <div className="relative mx-auto mt-6 h-[92vw] w-[74vw]">
        <div className="absolute inset-x-0 bottom-0 top-[24%] rounded-[3vw] bg-[#E1DBC6]" />
        <div className="absolute inset-0">
          <ProdVideo
            sources={TVHEAD_SOURCES}
            className="size-full object-contain object-bottom"
            controls={false}
          />
        </div>
      </div>
    </section>
  );
}

function HeroDesktop() {
  return (
    <section className="relative hidden h-[58.16vw] w-full overflow-hidden sm:block">
      {/* #F7ECD9 hero plate (section bg) */}
      <div className="absolute inset-x-0 top-0 h-[45.55vw] bg-[#F7ECD9]" />

      {/* Title + subtitle — a touch below the nav→video centerline */}
      <div className="absolute inset-x-0 top-[9.4vw] px-6 text-center">
        <Reveal>
          <h1 className="font-serif text-[min(3.125vw,60px)] font-normal leading-[1.2] text-espresso">
            Production, Series Creation &amp; Editing
          </h1>
        </Reveal>
        <Reveal className="mt-[1.3vw]" delay={120}>
          <p className="mx-auto max-w-[52.3vw] font-roboto text-[min(1.302vw,25px)] leading-[1.4] text-taupe">
            Original series and campaigns for the brands and networks you already
            know.
          </p>
        </Reveal>
      </div>

      {/* Beige plate (Figma "Hero image" 70:1189) */}
      <div className="absolute left-[12.71vw] top-[33.78vw] h-[24.38vw] w-[74.53vw] rounded-[1.47vw] bg-[#E1DBC6]" />

      {/* Transparent TV-head figure (537:2588), peeking up over the plate */}
      <div className="absolute left-[35.89vw] top-[24.25vw] h-[33.91vw] w-[27.19vw]">
        <ProdVideo
          sources={TVHEAD_SOURCES}
          className="size-full object-contain object-bottom"
          controls={false}
        />
      </div>
    </section>
  );
}
