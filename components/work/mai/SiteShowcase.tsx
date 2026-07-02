"use client";

import { useEffect, useRef } from "react";

/**
 * Outcome showcase (Figma frame 2147265586): the live MAI-Transcribe-1.5 page in
 * a big rounded browser window, with a "See the site. Click here!" caption
 * centred in the empty-left area and an arrow that draws along its path toward
 * the browser as the block scrolls into view (static on reduced-motion).
 */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function SiteShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const curve = curveRef.current;
    const head = headRef.current;
    if (!root || !curve || !head) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const len = curve.getTotalLength();
    curve.style.strokeDasharray = String(len);
    curve.style.strokeDashoffset = String(len);
    head.style.opacity = "0";

    let raf = 0;
    let running = true;
    const update = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = clamp((0.82 * vh - rect.top) / (0.6 * vh), 0, 1);
      // curve draws over the first 70%, then the arrowhead fades in
      curve.style.strokeDashoffset = String(len * (1 - easeOut(clamp(p / 0.7, 0, 1))));
      head.style.opacity = clamp((p - 0.62) / 0.18, 0, 1).toFixed(3);
      if (running) raf = requestAnimationFrame(update);
    };
    update();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      curve.style.strokeDasharray = "";
      curve.style.strokeDashoffset = "";
      head.style.opacity = "";
    };
  }, []);

  return (
    <div ref={rootRef} className="relative aspect-[1372/718] w-full">
      <img
        src="/images/mai/site.png"
        alt="The live MAI-Transcribe-1.5 page on microsoft.ai"
        className="absolute inset-0 h-full w-full object-contain"
      />

      {/* Caption — centred in the empty-left area (between the card edge and the
          browser, which starts at ~26%). */}
      <a
        href="https://microsoft.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-[2.5%] top-[31%] w-[21%] text-center font-roboto text-[2vw] leading-snug text-[#353536] underline-offset-4 hover:underline sm:left-[4%] sm:top-[37%] sm:w-[18.1%] sm:text-[min(1.02vw,20px)] sm:leading-[1.09]"
      >
        See the site. Click here!
      </a>
      <svg
        viewBox="0 0 160 200"
        className="absolute left-[9%] top-[10%] w-[12%] sm:left-[11%] sm:top-[13%] sm:w-[13%]"
        fill="none"
        aria-hidden
      >
        <path
          ref={curveRef}
          d="M14 150 L14 66 C 14 38 72 38 150 48"
          stroke="#867F72"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          ref={headRef}
          d="M150 48 L 132 39 M150 48 L 135 61"
          stroke="#867F72"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
