"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

/**
 * The two hero phones (splash + Alyssa profile), shared by the mobile and
 * desktop hero cards. They settle up into place shortly after load — a subtle
 * rise + fade, splash first then profile. Respects prefers-reduced-motion.
 */
export default function HeroPhones() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const t = setTimeout(() => setShown(true), 150);
    return () => clearTimeout(t);
  }, []);

  // The phones rise UP OUT of the frame: a clip wipe reveals each from the
  // bottom (inside the beige card) up past the card's top edge, plus a small
  // rise — so they emerge from within the frame instead of floating over it.
  // Left phone first. (clip-path stays inset within the card during the wipe.)
  const rise = (delay: number) => ({
    clipPath: shown ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
    transform: shown ? "none" : "translateY(2.5vw)",
    transitionDelay: `${delay}ms`,
  });

  return (
    <>
      {/* Left phone — "twain / vibes go live" splash (enters first) */}
      <div
        className="absolute left-[22.95%] top-[-65.62%] h-[165.65%] w-[39.38%] overflow-hidden transition-[transform,clip-path] duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        style={rise(120)}
      >
        <img
          src="/images/twain/hero-splash.png"
          alt="Twain app splash screen"
          loading="lazy"
          decoding="async"
          className="absolute left-0 top-0 h-[127.54%] w-full max-w-none"
        />
      </div>
      {/* Right phone — "Alyssa, 29" profile screen (follows) */}
      <div
        className="absolute left-[41.93%] top-[-30.14%] h-[130.17%] w-[35.77%] overflow-hidden transition-[transform,clip-path] duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        style={rise(520)}
      >
        <img
          src="/images/twain/hero-alyssa.png"
          alt="Twain profile screen — Alyssa, 29"
          loading="lazy"
          decoding="async"
          className="absolute left-[-0.05%] top-0 h-[147.67%] w-[100.11%] max-w-none"
        />
      </div>
    </>
  );
}
