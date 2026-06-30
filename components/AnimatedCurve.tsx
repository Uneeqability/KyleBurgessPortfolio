"use client";

import { useEffect, useRef, useState } from "react";

/** The dashed CTA trail (exported from Figma — overflows the viewBox to the
 *  right so its tail runs off the frame). */
const PATH =
  "M0 334.635C376 334.635 430.807 -6.8482 255.199 1.52048C99.3784 8.94616 -49.6801 537.014 546.482 641.08C675.418 664.068 986.188 681.81 1197.78 568.875";

/**
 * The looping dashed trail by "Let's Connect", drawn on along its own path.
 * The visible path keeps its dashes; a thick solid copy used as a mask wipes
 * from the start (just past the word) out to the tail, revealing the dashes in
 * sequence. Triggers when scrolled into view so it draws as the title blurs in.
 */
export default function AnimatedCurve({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="-40 -20 1260 715"
      fill="none"
      aria-hidden
      className={className}
    >
      <defs>
        <mask id="cta-curve-reveal">
          <path
            d={PATH}
            stroke="white"
            strokeWidth="24"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={drawn ? 0 : 1}
            style={{
              transition:
                "stroke-dashoffset 2s cubic-bezier(0.45, 0, 0.25, 1) 0.35s",
            }}
          />
        </mask>
      </defs>
      <path
        d={PATH}
        stroke="#FFFFEB"
        strokeWidth="5"
        strokeDasharray="5 14"
        strokeLinecap="round"
        mask="url(#cta-curve-reveal)"
      />
    </svg>
  );
}
