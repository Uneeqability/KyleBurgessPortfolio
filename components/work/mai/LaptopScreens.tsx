"use client";

import { useEffect, useRef } from "react";

/**
 * The "role" collage (Figma frame 2147264233). Layer order, bottom → top, exactly
 * as laid out in Figma:
 *
 *   1. beige (#E1DBC6) card
 *   2. four MAI screenshots peeking from behind the device, clipped by the card
 *   3. a muted, looping video of the "new MAI Models" illustration in the screen
 *   4. the "Building a Hillclimbing Machine…" title banner OVER the video
 *   5. the MacBook frame (transparent screen cutout) on top
 *
 * Scroll animation: the laptop + video stay static; the four surrounding screens
 * start pushed out toward the frame edges (faded, slightly scaled down) and
 * converge into their resting positions as the block scrolls into view, with a
 * gentle clockwise stagger. Driven per-frame off the block's viewport position
 * (robust vs. Lenis). Static on reduced-motion.
 */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const screenBase =
  "absolute w-[38.88%] aspect-[549/357] rounded-[0.71cqw] object-cover shadow-[0.35cqw_0.35cqw_1.06cqw_0.42cqw_rgba(0,0,0,0.07)] will-change-transform";

// dir = the edge each screen converges in FROM; delay = when it starts in the
// scroll (0–1), staggered to match when each screen scrolls into view:
// top first, the two sides ("middle") together, then the bottom last.
const SCREENS = [
  { src: "screen-top", alt: "Model efficiency chart", pos: "left-[30.59%] top-[-14.35%]", dir: "top", delay: 0, dur: 0.4 },
  { src: "screen-right", alt: "Technical blog article", pos: "left-[76.13%] top-[31.03%]", dir: "right", delay: 0.3, dur: 0.4 },
  { src: "screen-left", alt: "MAI model page", pos: "left-[-14.31%] top-[31.03%]", dir: "left", delay: 0.3, dur: 0.4 },
  { src: "screen-bottom", alt: "Related stories cards", pos: "left-[30.88%] top-[76.83%]", dir: "bottom", delay: 0.74, dur: 0.26 },
];

export default function LaptopScreens() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const screens = [
      ...root.querySelectorAll<HTMLElement>("[data-screen]"),
    ];
    let raf = 0;
    let running = true;

    const update = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the block's top hits the viewport bottom → 1 when it hits the top,
      // so the cascade plays over a full viewport-height of scroll.
      const p = clamp((vh - rect.top) / vh, 0, 1);
      const mag = rect.width * 0.13;

      for (const el of screens) {
        const dir = el.dataset.dir;
        const delay = parseFloat(el.dataset.delay || "0");
        const dur = parseFloat(el.dataset.dur || "0.4");
        const pe = clamp((p - delay) / dur, 0, 1);
        const e = easeOut(pe);
        const out = (1 - e) * mag;
        const tx = dir === "left" ? -out : dir === "right" ? out : 0;
        const ty = dir === "top" ? -out : dir === "bottom" ? out : 0;
        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${(0.93 + e * 0.07).toFixed(3)})`;
        el.style.opacity = clamp(e * 1.15, 0, 1).toFixed(3);
      }

      if (running) raf = requestAnimationFrame(update);
    };

    update();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative aspect-[1412/941] w-full overflow-hidden rounded-[8px] bg-[#E1DBC6] [container-type:inline-size] sm:rounded-[1.04vw]"
    >
      {/* Surrounding screenshots — behind the device, animate in on scroll */}
      {SCREENS.map((s) => (
        <img
          key={s.src}
          data-screen
          data-dir={s.dir}
          data-delay={s.delay}
          data-dur={s.dur}
          src={`/images/mai/${s.src}.png`}
          alt={s.alt}
          className={`${screenBase} ${s.pos}`}
        />
      ))}

      {/* Screen content — muted looping video + title banner, revealed through the
          device's transparent screen (the bezel masks the edges) */}
      <div className="absolute left-[30.24%] top-[29.12%] z-[5] aspect-[558/360] w-[39.52%] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/mai-models.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* "Building a Hillclimbing Machine…" title banner (over the video) */}
        <div className="absolute inset-x-[8%] bottom-[6%] rounded-[0.54cqw] bg-[#FEF9ED] px-[1.63cqw] pb-[1.9cqw] pt-[1.22cqw]">
          <h3 className="max-w-[64%] font-serif text-[1.36cqw] font-normal leading-[1.14] text-[#3B230E]">
            Building a Hillclimbing Machine: Launching seven new MAI Models
          </h3>
          <div className="absolute bottom-[0.95cqw] right-[1.63cqw] flex items-center gap-[1.36cqw] font-mono text-[0.63cqw] text-[#5D524B]">
            <span>announcements</span>
            <span>12 minute read</span>
            <svg viewBox="0 0 22 10" className="w-[1.5cqw]" fill="none" aria-hidden>
              <path d="M1 5H20M20 5L16 1.5M20 5L16 8.5" stroke="#5D524B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* MacBook device — transparent bg + screen cutout, on top */}
      <img
        src="/images/mai/laptop-device.png"
        alt="MAI model pages and technical blogs shown on a laptop"
        className="absolute left-[0.35%] top-[0.21%] z-10 w-[99.29%]"
      />
    </div>
  );
}
