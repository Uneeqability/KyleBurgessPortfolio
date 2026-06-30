"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-driven diagonal blur. Renders its children twice — a sharp base and a
 * blurred copy on top whose mask is a diagonal gradient. As the element scrolls
 * up the viewport the mask wipes the blur away on a diagonal, so the text
 * resolves from soft → sharp with a sense of movement (sharp across ~half the
 * text by mid-scroll). Respects reduced motion.
 */
export default function DiagonalScrollBlur({
  children,
  className = "",
  contentClassName = "",
  maxBlur = 5,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  maxBlur?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2;
      // 0 when the block's centre sits low (85% down), 1 once it reaches ~35%
      const p = 1 - (center - vh * 0.35) / (vh * 0.5);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Sweep a diagonal edge from its resting position (only the right side soft)
  // to fully revealed. The two layers are masked complementarily so they never
  // overlap — the sharp copy shows only in the resolved region, the blurred copy
  // only beyond it. At rest (progress 0) the edge sits past the centre, so just
  // the right ~half is blurred on a diagonal; scrolling wipes it off the rest.
  const sweep = 38 + progress * 92;
  const sharpMask = `linear-gradient(116deg, black ${sweep}%, transparent ${sweep + 24}%)`;
  const blurMask = `linear-gradient(116deg, transparent ${sweep}%, black ${sweep + 24}%)`;

  return (
    <div ref={ref} className={className}>
      <div
        className={`absolute inset-0 ${contentClassName}`}
        style={{ maskImage: sharpMask, WebkitMaskImage: sharpMask }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${contentClassName}`}
        style={{
          filter: `blur(${maxBlur}px)`,
          maskImage: blurMask,
          WebkitMaskImage: blurMask,
        }}
      >
        {children}
      </div>
      {/* invisible copy to give the wrapper its natural height */}
      <div className={`invisible ${contentClassName}`} aria-hidden>
        {children}
      </div>
    </div>
  );
}
