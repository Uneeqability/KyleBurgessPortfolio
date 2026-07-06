import Image from "next/image";

/**
 * Layered image content for each /work card's image area (660×526 in Figma).
 * Every mockup is kept as its own positioned layer — never flattened — so the
 * cards can be animated later. Boxes below are the exact Figma node rectangles
 * expressed as percentages of the 660×526 image area (`overflow-hidden` on the
 * WorkCard image area clips whatever bleeds past the edges, matching the design).
 */

const SIZES = "(max-width: 640px) 90vw, 35vw";

/**
 * One absolutely-positioned image layer inside the card image area. Uses a
 * plain <img> (not next/image) on purpose: the optimizer flattens transparent
 * PNGs — both edge transparency (mockup cut-outs over the tint) and interior
 * cut-outs (the TV screen) — onto an opaque background. Same reason the
 * homepage FullRange section uses plain <img> for its mockups.
 */
function Layer({
  src,
  alt,
  box,
  fit = "object-cover",
  extra = "",
}: {
  src: string;
  alt: string;
  /** Tailwind position/size classes (arbitrary values, literal per call site) */
  box: string;
  fit?: string;
  /** extra classes on the <img> (blend, filter, position) */
  extra?: string;
}) {
  return (
    <div className={`absolute ${box}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" className={`absolute inset-0 size-full ${fit} ${extra}`} />
    </div>
  );
}

/* 1 — Microsoft Build: single keynote photo filling the area. */
export function BuildVisual() {
  return (
    <Layer
      src="/images/work/build-keynote.png"
      alt="Microsoft Build keynote stage"
      box="inset-0"
    />
  );
}

/* 2 — Microsoft.ai relaunch: bg-removed laptop, sized large and bleeding off
   the right edge (Figma: 124.07%×103.8% at 4.18%/-3.8%), over the amber tint. */
export function MaiVisual() {
  return (
    <Layer
      src="/images/work/mai-laptop.png"
      alt="Laptop showing the Microsoft AI homepage"
      box="left-[4.18%] top-[-3.8%] w-[124.07%] h-[103.8%]"
    />
  );
}

/* 3 — Twain: two tilted iPhones over the sage tint (top phone bleeds off-top). */
export function TwainVisual() {
  return (
    <>
      <Layer
        src="/images/work/twain-iphone1.png"
        alt="Twain app splash screen on iPhone"
        box="left-[9.55%] top-[-25.86%] w-[55.15%] h-[123.03%]"
      />
      <Layer
        src="/images/work/twain-iphone2.png"
        alt="Twain app browse screen on iPhone"
        box="left-[35.3%] top-[2.85%] w-[55.15%] h-[123.03%]"
      />
    </>
  );
}

/* 4 — Production: Hollywood hillside (luminosity-blended at 65% over black)
   showing through the retro TV, which is object-cover in an oversized box that
   bleeds off the left/top so the set fills the card (matches Figma 528:655). */
export function ProductionVisual() {
  return (
    <>
      {/* Animated hillside — the same looping footage as the homepage — under
          the TV: black fill + 65% luminosity = B&W, revealed through the TV's
          cut-out screen. */}
      <div className="absolute left-[13.33%] top-[61.22%] h-[41.44%] w-[58.79%] isolate bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/videos/hollywood.webp"
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover opacity-65 mix-blend-luminosity"
        />
      </div>
      <Layer
        src="/images/work/retro-tv.png"
        alt="Retro television set"
        box="left-[-16.52%] top-[-9.89%] w-[133.03%] h-[148.29%]"
      />
    </>
  );
}

/* 5 — Presentation: the fanned deck as five separate rotated slide layers
   (Figma frame 528:639), so the fan can animate open later. Sizes are cqw of
   the deck frame (its own container-query context); positions are the rotated
   cards' centres. Front slide (AGENTIC SHIFT) is last / on top. */
function Slide({
  src,
  wrap,
  card,
}: {
  src: string;
  /** centre position + rotation (literal Tailwind, per call site) */
  wrap: string;
  /** size + radius + shadow (literal Tailwind, per call site) */
  card: string;
}) {
  return (
    <div className={`absolute -translate-x-1/2 -translate-y-1/2 ${wrap}`}>
      <div className={`relative overflow-hidden ${card}`}>
        <Image src={src} alt="" fill sizes={SIZES} className="object-cover" />
      </div>
    </div>
  );
}

export function PresentationVisual() {
  return (
    <div className="absolute left-[18.48%] top-[19.2%] w-[61.9%] [aspect-ratio:408.637/323.996] [container-type:inline-size]">
      <Slide
        src="/images/work/slide1.png"
        wrap="left-[50.87%] top-[33.71%] rotate-[-8.2deg]"
        card="w-[76.43cqw] h-[42.99cqw] rounded-[2.23cqw] shadow-[0.86cqw_0.86cqw_1.71cqw_0px_rgba(0,0,0,0.2)]"
      />
      <Slide
        src="/images/work/slide2.png"
        wrap="left-[50.57%] top-[39.98%] rotate-[-6.27deg]"
        card="w-[81.56cqw] h-[45.88cqw] rounded-[2.19cqw] shadow-[0.86cqw_0.86cqw_1.71cqw_0px_rgba(0,0,0,0.3)]"
      />
      <Slide
        src="/images/work/slide3.png"
        wrap="left-[50.26%] top-[47.23%] rotate-[-4.7deg]"
        card="w-[87.01cqw] h-[48.94cqw] rounded-[2.19cqw] shadow-[0.86cqw_0.86cqw_1.71cqw_0px_rgba(0,0,0,0.3)]"
      />
      <Slide
        src="/images/work/slide4.png"
        wrap="left-[50.29%] top-[54.66%] rotate-[-3.05deg]"
        card="w-[93.12cqw] h-[52.38cqw] rounded-[2.19cqw] shadow-[0.86cqw_0.86cqw_1.71cqw_0px_rgba(0,0,0,0.3)]"
      />
      <Slide
        src="/images/work/slide5.png"
        wrap="left-[50%] top-[64.53%]"
        card="w-[100cqw] h-[56.25cqw] rounded-[3.33cqw] shadow-[1.3cqw_1.3cqw_2.6cqw_0px_rgba(0,0,0,0.2)]"
      />
    </div>
  );
}

/* 6 — BidBud: the full hand-held iPad over the clay tint. The source is wider
   than the image area, so object-cover fills the height (no vertical overflow —
   object-position Y is a no-op); a downward translate drops the iPad ~18% so the
   clay tint shows above it and the device sits lower in the card. */
export function BidBudVisual() {
  return (
    <Layer
      src="/images/work/bidbud-ipad.png"
      alt="Hands holding an iPad showing the BidBud website"
      box="inset-0"
      extra="object-[50%_50%] translate-y-[18%]"
    />
  );
}
