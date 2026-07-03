"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

/**
 * UI slide — five fanned iPhones (Figma 508:1297), using the user-provided
 * mockup PNGs (ui-1 far left … ui-3 centre … ui-5 far right) exactly as
 * exported. On scroll-in the phones start fully stacked behind the centre one;
 * the centre reveals first, then (once it's settled) the inner pair slide out
 * from underneath it, then the outer pair — each staying hidden until it begins
 * its slide. `dx` collapses each phone onto the centre. Respects
 * prefers-reduced-motion. Array order = back→front z-order.
 */
const PHONES = [
  { src: "ui-1", alt: "Twain live video call screen", box: "left-[8.52%] top-[17.42%] h-[67.35%] w-[20.81%]", dx: "148%", delay: 1250, dur: 760 },
  { src: "ui-5", alt: "Twain 'feeling it?' screen", box: "left-[71.49%] top-[18.3%] h-[66.84%] w-[20.68%]", dx: "-155%", delay: 1250, dur: 760 },
  { src: "ui-2", alt: "Twain 'go live with you' screen", box: "left-[21.56%] top-[12.28%] h-[77.81%] w-[24.04%]", dx: "67%", delay: 650, dur: 720 },
  { src: "ui-4", alt: "Twain 'Online Now' browse screen", box: "left-[55.26%] top-[12.27%] h-[77.4%] w-[23.94%]", dx: "-73%", delay: 650, dur: 720 },
  { src: "ui-3", alt: "Twain profile screen", box: "left-[39.31%] top-[11.41%] h-[77.43%] w-[20.92%]", dx: "0%", delay: 0, dur: 600 },
];

export default function FannedPhones() {
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
        if (entries[0].isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {PHONES.map((p) => (
        <img
          key={p.src}
          src={`/images/twain/${p.src}.png`}
          alt={p.alt}
          className={`absolute object-contain ${p.box} ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform`}
          style={{
            transform: shown ? "none" : `translateX(${p.dx}) scale(0.9)`,
            opacity: shown ? 1 : 0,
            transitionProperty: "transform, opacity",
            transitionDuration: `${p.dur}ms`,
            transitionDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
