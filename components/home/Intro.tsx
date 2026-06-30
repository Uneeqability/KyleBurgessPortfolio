/**
 * Intro — "I'm a designer, producer, editor and all-around creative."
 * Built from the Figma section frame (1920×1556):
 *
 *   headshot   448px circle, left 723 top 307; a 20px-blur copy behind it
 *              forms the soft halo (Ellipse 27063 + 27065)
 *   heading    IBM Plex Serif 60px / 72px, #3B230E, centered
 *   body       Roboto Mono 24px / 145%, #72675B, centered
 *
 * Desktop maps every px to a % of the aspect frame; mobile is a fluid stack.
 */

import Reveal from "@/components/Reveal";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";

const BODY =
  "I lead creative for the moments that carry the most weight, from a CEO’s keynote to a streaming series, to the design standards a whole organization works from. Thirteen years across entertainment and tech, fluent in motion, design, and production, so I can hold the vision and ship the work. Currently? I’m shaping how Microsoft AI shows up to the world.";

function Headshot({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Blurred halo (Ellipse 27063) */}
      <img
        src="/images/headshot.png"
        alt=""
        aria-hidden
        className="absolute inset-0 size-full rounded-full object-cover blur-[1.04vw]"
      />
      {/* Clear circle (Ellipse 27065) */}
      <img
        src="/images/headshot.png"
        alt="Kyle Burgess"
        className="absolute inset-0 size-full rounded-full object-cover"
      />
    </div>
  );
}

function Heading({ className = "" }: { className?: string }) {
  return (
    <h2 className={`font-serif text-espresso ${className}`}>
      <BlurTextEffect
        segments={[
          { text: "I’m a designer, producer, editor and " },
          { text: "all-around creative.", className: "italic" },
        ]}
      />
    </h2>
  );
}

export default function Intro() {
  return (
    <section className="w-full">
      {/* ---------- Desktop: exact 1920×1556 frame ---------- */}
      <div className="relative hidden aspect-[1920/1556] w-full sm:block">
        <Reveal className="absolute left-[37.66%] top-[19.73%] aspect-square w-[23.33%]">
          <Headshot className="size-full" />
        </Reveal>

        <div className="absolute left-[23.54%] top-[54.63%] w-[51.61%]">
          <Heading className="text-center text-[3.125vw] font-normal leading-[1.2]" />
        </div>

        <Reveal
          className="absolute left-[20.83%] top-[63.88%] flex h-[18.45%] w-[57.03%] items-center"
          delay={220}
        >
          <p className="w-full text-center font-[family-name:var(--font-roboto-mono)] text-[1.25vw] font-normal leading-[1.45] text-taupe">
            {BODY}
          </p>
        </Reveal>
      </div>

      {/* ---------- Mobile: fluid stack ---------- */}
      <div className="flex flex-col items-center px-6 py-24 text-center sm:hidden">
        <Reveal>
          <Headshot className="size-44" />
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
