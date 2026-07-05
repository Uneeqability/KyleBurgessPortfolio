"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";

/**
 * The closing keynote card (Figma 607:2263) — the seven model symbols as chips
 * that slowly revolve along the ORIGINAL designed orbit line (607:2260), a faint
 * organic loop. The chips ride the exact path via SVG getPointAtLength(), so they
 * follow the real curve (not an approximated ellipse). Each chip is only
 * translated — never rotated — so its icon stays upright. Subtle depth, a
 * one-time fade+scale entrance on scroll-in, and a static reduced-motion
 * fallback. No animation libraries.
 */

const ICONS = [
  { src: "/images/build/keynote/sym-twoflower.png", alt: "MAI image model symbol" },
  { src: "/images/build/keynote/sym-flower.png", alt: "MAI image model symbol" },
  { src: "/images/build/keynote/sym-braces.png", alt: "MAI code model symbol" },
  { src: "/images/build/keynote/sym-waveform.png", alt: "MAI voice model symbol" },
  { src: "/images/build/keynote/sym-blob-bottom.png", alt: "MAI model symbol" },
  { src: "/images/build/keynote/sym-blob-left.png", alt: "MAI model symbol" },
  { src: "/images/build/keynote/sym-topleft.png", alt: "MAI model symbol" },
];
const N = ICONS.length;
const PERIOD = 50; // seconds per full revolution

// The orbit line's own coordinate system + its placement within the 1412×834 card
// (Figma frame 607:2260). Path points map linearly into this box.
const VBW = 883.715;
const VBH = 696.649;
// Desktop keeps the exact Figma placement. On mobile the card is small, so the
// loop's central "eye" is too tight for legible text — we blow the orbit up
// (it overflows the card edges, clipped, so chips drift in/out of frame) which
// opens the eye enough for a readable center statement. Kept centered on the
// same point as the desktop box.
const BOX = { left: 18.0, top: 7.79, w: 62.54, h: 83.49 }; // % of the card (desktop)
const BOX_MOBILE = { left: -0.6, top: -4.7, w: 99.8, h: 108.5 }; // enlarged: ~1.6× wide, 1.3× tall

// VISIBLE_ORBIT is the exact Figma vector (607:2260), rendered as-is — including
// the decorative overlap tail at the top-left. MOTION_ORBIT is the same line but
// with that tail replaced by a smooth close back to the start (the tail points
// "away" from the start, so it can't be traversed as a loop); the chips ride this
// invisible closed copy so they never jump. They share the whole visible loop and
// differ only in the small top closing region.
const VISIBLE_ORBIT =
  "M313.996 113.226C162.329 138.036 24.5271 206.401 3.57489 304.254C-28.4888 453.912 185.204 614.442 370.14 644.337C601.852 681.78 880.568 529.025 883.338 365.839C886.042 206.319 625.248 28.0381 395.133 72.4251C163.861 117.057 -16.3345 382.743 51.8822 545.978C95.7416 650.906 236.818 700.526 345.131 696.011C624.482 684.372 856.895 305.607 770.023 132.542C728.852 50.5169 591.591 14.1777 475.181 35.4991C432.071 43.3886 291.66 117.171 269.681 132.542";
const MOTION_ORBIT =
  "M313.996 113.226C162.329 138.036 24.5271 206.401 3.57489 304.254C-28.4888 453.912 185.204 614.442 370.14 644.337C601.852 681.78 880.568 529.025 883.338 365.839C886.042 206.319 625.248 28.0381 395.133 72.4251C163.861 117.057 -16.3345 382.743 51.8822 545.978C95.7416 650.906 236.818 700.526 345.131 696.011C624.482 684.372 856.895 305.607 770.023 132.542C728.852 50.5169 591.591 14.1777 475.181 35.4991C386.6 51.7 353.5 106.8 313.996 113.226";

export default function KeynoteCard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || !path) return;
    const len = path.getTotalLength();
    // Mobile uses the enlarged orbit so the center statement fits the eye.
    const box = root.clientWidth < 640 ? BOX_MOBILE : BOX;

    // Position one chip at path-fraction f (0..1). Outer carries the orbit
    // translate (no rotation); inner carries depth + entrance scale/opacity.
    const place = (i: number, f: number, entrance: number, w: number, h: number) => {
      const outer = outerRefs.current[i];
      const inner = innerRefs.current[i];
      if (!outer || !inner) return;
      const pt = path.getPointAtLength((((f % 1) + 1) % 1) * len);
      const x = ((box.left + (pt.x / VBW) * box.w) / 100) * w;
      const y = ((box.top + (pt.y / VBH) * box.h) / 100) * h;
      outer.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      const depth = Math.min(1, Math.max(0, pt.y / VBH)); // 0 back (top) .. 1 front (bottom)
      outer.style.zIndex = String(10 + Math.round(depth * 10));
      inner.style.transform = `scale(${(0.9 + 0.16 * depth) * (0.6 + 0.4 * entrance)})`;
      inner.style.opacity = String((0.72 + 0.28 * depth) * entrance);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const w = root.clientWidth, h = root.clientHeight;
      for (let i = 0; i < N; i++) place(i, i / N, 1, w, h);
      return;
    }

    // Pre-entrance: hidden in place so nothing flashes before scroll-in.
    {
      const w = root.clientWidth, h = root.clientHeight;
      for (let i = 0; i < N; i++) place(i, i / N, 0, w, h);
    }

    let raf = 0, startT = 0, active = false;
    const entranceDur = 0.9, stagger = 0.09;
    const tick = (now: number) => {
      if (!startT) startT = now;
      const t = (now - startT) / 1000;
      const w = root.clientWidth, h = root.clientHeight;
      for (let i = 0; i < N; i++) {
        const e = Math.min(1, Math.max(0, (t - i * stagger) / entranceDur));
        place(i, i / N + t / PERIOD, 1 - (1 - e) * (1 - e), w, h);
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (ents) => {
        if (ents[0].isIntersecting && !active) {
          active = true;
          raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(root);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-keynote-card
      className="relative size-full overflow-hidden rounded-[3.19cqw] bg-[#F7ECD9] [container-type:inline-size]"
    >
      {/* The exact Figma orbit line (607:2260), drawn as-is. A second, invisible
          copy is the closed path the chips actually ride (getPointAtLength). */}
      <svg
        className="pointer-events-none absolute left-[-0.6%] top-[-4.7%] h-[108.5%] w-[99.8%] overflow-visible sm:left-[18%] sm:top-[7.79%] sm:h-[83.49%] sm:w-[62.54%]"
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
      >
        <path
          d={VISIBLE_ORBIT}
          stroke="#5D524B"
          strokeOpacity="0.6"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path ref={pathRef} d={MOTION_ORBIT} stroke="none" fill="none" />
      </svg>

      {/* Revolving chips */}
      {ICONS.map((ic, i) => (
        <div
          key={i}
          ref={(el) => {
            outerRefs.current[i] = el;
          }}
          data-keynote-chip={i}
          className="absolute left-0 top-0 h-[8cqw] w-[8cqw] will-change-transform sm:h-[9.5cqw] sm:w-[9.5cqw]"
        >
          <div
            ref={(el) => {
              innerRefs.current[i] = el;
            }}
            className="flex h-full w-full items-center justify-center rounded-full border border-[#3b230e]/15 bg-[#F7ECD9] opacity-0 will-change-transform"
          >
            <img src={ic.src} alt={ic.alt} loading="lazy" decoding="async" className="h-[62%] w-[62%] object-contain" />
          </div>
        </div>
      ))}

      {/* Center statement (static — never moves) */}
      <p
        data-keynote-text
        className="absolute left-1/2 top-[42.4%] z-20 flex h-[15.14%] w-[46%] -translate-x-1/2 items-center justify-center text-center font-roboto text-[clamp(9px,3cqw,15px)] leading-[1.3] text-[#353536] sm:w-[25.81%] sm:text-[1.56cqw] sm:leading-[1.35]"
      >
        The keynote wasn&rsquo;t just built for the stage. It became the
        throughline for the whole release, and the releases still to come.
      </p>
    </div>
  );
}
