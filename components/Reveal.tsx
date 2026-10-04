"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper — fades + slides its content up the first time it
 * enters the viewport. Pairs with the Lenis smooth scroll for a premium feel.
 * Pass `className` for layout (incl. absolute positioning) and `delay` to
 * stagger neighbouring reveals. Respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  blur = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** soft blur-in instead of the default fade + rise */
  blur?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        // Also count it once it's above the viewport: a fast phone flick can
        // carry it past between frames, and it would otherwise stay hidden.
        if (e.intersectionRatio >= 0.12 || e.boundingClientRect.bottom < 0) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: [0, 0.12], rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const base = blur ? "reveal-blur" : "reveal";
  const inCls = blur ? "reveal-blur-in" : "reveal-in";
  return (
    <div
      ref={ref}
      className={`${base}${shown ? ` ${inCls}` : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
