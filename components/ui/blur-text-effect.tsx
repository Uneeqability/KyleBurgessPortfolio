"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export type BlurSegment = { text: string; className?: string };

interface BlurTextEffectProps {
  /** plain string content */
  children?: string;
  /** styled segments (e.g. an italic run) — preferred for mixed styling */
  segments?: BlurSegment[];
  className?: string;
  /** play on mount instead of when scrolled into view */
  immediate?: boolean;
}

/**
 * Per-character blur-in. Each character starts blurred + offset and resolves
 * with a stagger. Triggers when the element scrolls into view (so titles below
 * the fold animate on arrival), splits on word boundaries so words never break
 * mid-line, and supports styled segments + reduced motion.
 */
export const BlurTextEffect: React.FC<BlurTextEffectProps> = ({
  children,
  segments,
  className = "",
  immediate = false,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const segs: BlurSegment[] = segments ?? (children ? [{ text: children }] : []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>(".bt-char");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(chars, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    gsap.set(chars, { opacity: 0, y: 12, filter: "blur(8px)" });
    const play = () =>
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.018,
        clearProps: "filter,transform,opacity",
      });

    if (immediate) {
      play();
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          obs.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, JSON.stringify(segments)]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {segs.map((seg, si) =>
        seg.text.split(/(\s+)/).map((token, ti) => {
          if (token === "") return null;
          if (/^\s+$/.test(token))
            return <span key={`${si}-${ti}`}> </span>;
          return (
            <span
              key={`${si}-${ti}`}
              className={`inline-block whitespace-nowrap ${seg.className ?? ""}`}
            >
              {token.split("").map((ch, ci) => (
                <span key={ci} className="bt-char inline-block">
                  {ch}
                </span>
              ))}
            </span>
          );
        }),
      )}
    </span>
  );
};
