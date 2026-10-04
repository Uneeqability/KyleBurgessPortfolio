/**
 * Intro — "I'm a designer, producer, editor, and all-around creative generalist."
 * Built from the Figma section frame (1920×1556):
 *
 *   headshot   448px circle, left 723 top 307; a 20px-blur copy behind it
 *              forms the soft halo (Ellipse 27063 + 27065). On scroll it
 *              grows into a photo card and fans out four more (IntroFan)
 *   heading    IBM Plex Serif 60px / 72px, #3B230E, centered
 *   body       Roboto Mono 24px / 145%, #72675B, centered
 *
 * Desktop maps every px to a % of the aspect frame; mobile is a fluid stack.
 */

import Reveal from "@/components/Reveal";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";
import IntroFan from "./IntroFan";

const BODY =
  "I lead creative for the things people actually see: a CEO’s keynote, a product launch, a brand campaign, a website, the design standards a whole org builds from. Thirteen years across entertainment, music, and tech, hands in design, editorial, and a little code, so the idea and the finished thing come from the same place. Currently? I’m shaping how Microsoft AI shows up to the world.";

function Heading({ className = "" }: { className?: string }) {
  return (
    <h2 className={`font-serif text-espresso ${className}`}>
      <BlurTextEffect
        segments={[
          { text: "I’m a designer, producer, editor, and " },
          { text: "all-around creative generalist.", className: "italic" },
        ]}
      />
    </h2>
  );
}

export default function Intro() {
  return (
    <section className="w-full overflow-x-clip">
      {/* ---------- Desktop: exact 1920×1556 frame ---------- */}
      <div className="relative hidden aspect-[1920/1556] w-full sm:block">
        <Reveal className="absolute left-[37.66%] top-[19.73%] aspect-square w-[23.33%]">
          <IntroFan className="size-full" />
        </Reveal>

        <div className="absolute left-[23.54%] top-[54.63%] w-[51.61%]">
          <Heading className="text-center text-[3.125vw] font-normal leading-[1.2]" />
        </div>

        {/* Bottom-anchored so the last line always sits 19.73% from the frame
            bottom — matching the headshot's 19.73% top padding (symmetric). */}
        <Reveal
          className="absolute left-[20.83%] top-[63.88%] flex h-[16.39%] w-[57.03%] items-end"
          delay={220}
        >
          <p className="w-full text-center font-[family-name:var(--font-roboto-mono)] text-[1.25vw] font-normal leading-[1.45] text-taupe">
            {BODY}
          </p>
        </Reveal>
      </div>

      {/* ---------- Mobile: fluid stack ---------- */}
      <div className="flex flex-col items-center px-6 py-24 text-center sm:hidden">
        {/* Phone carousel: the side cards reach ~330u from centre (≈ the box
            width at FAN_SIZE 0.9), so this keeps them inside a 16px gutter. */}
        <Reveal>
          <IntroFan className="size-[min(14rem,calc(50vw_-_17px))]" />
        </Reveal>
        <Heading className="mt-12 max-w-md text-[2rem] font-normal leading-tight" />
        <Reveal className="mt-8 max-w-md">
          <p className="font-[family-name:var(--font-roboto-mono)] text-sm font-normal leading-relaxed text-taupe">
            {BODY}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
