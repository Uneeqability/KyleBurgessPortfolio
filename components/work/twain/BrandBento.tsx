"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

/**
 * Brand bento (Figma 601:2172): the twain wordmark panel (left, flat export),
 * three colour swatches (middle), and the iOS app-dock mockup (right, on a
 * #F7ECD9 card — the export's own baked background was made transparent so this
 * shows). On scroll-in each element reveals on its own: the wordmark first, then
 * the three swatches fade in top-to-bottom, then the app-dock card. Respects
 * prefers-reduced-motion.
 */
export default function BrandBento() {
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

  const rev = (delay: number) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : "translateY(0.7vw)",
    transitionDelay: `${delay}ms`,
  });
  const TR =
    "transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <div ref={ref} className="absolute inset-0">
      {/* ---- Left: logo panel (flat export) ---- */}
      <div
        className={`absolute left-0 top-0 h-full w-[41.67%] overflow-hidden rounded-[1.15vw] ${TR}`}
        style={rev(0)}
      >
        <img
          src="/images/twain/bento-left.png"
          alt="twain brand mark — vibes go live"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </div>

      {/* ---- Middle: colour swatches (fade in top → bottom) ---- */}
      <div className="absolute left-[42.99%] top-0 h-full w-[9.26%]">
        <div
          className={`absolute left-0 top-0 flex h-[32.39%] w-full items-center justify-center rounded-t-[0.78vw] rounded-b-[0.26vw] bg-[#48654E] ${TR}`}
          style={rev(300)}
        >
          <span className="font-serif text-[0.83vw] font-medium tracking-[0.05em] text-[#FBF4E6]">
            #48654E
          </span>
        </div>
        <div
          className={`absolute left-0 top-[33.9%] flex h-[32.2%] w-full items-center justify-center bg-[#373228] ${TR}`}
          style={rev(450)}
        >
          <span className="font-serif text-[0.83vw] font-medium tracking-[0.05em] text-[#FBF4E6]">
            #373228
          </span>
        </div>
        <div
          className={`absolute left-0 top-[67.61%] flex h-[32.39%] w-full items-center justify-center rounded-b-[0.78vw] rounded-t-[0.26vw] bg-[#EFE7D5] ${TR}`}
          style={rev(600)}
        >
          <span className="font-serif text-[0.83vw] font-medium tracking-[0.05em] text-[#373228]">
            #EFE7D5
          </span>
        </div>
      </div>

      {/* ---- Right: iOS app-dock mockup (on the #F7ECD9 card) ---- */}
      <div
        className={`absolute left-[53.51%] top-0 h-full w-[46.5%] overflow-hidden rounded-[1.15vw] bg-[#F7ECD9] ${TR}`}
        style={rev(900)}
      >
        <img
          src="/images/twain/app-dock.png"
          alt="The twain app icon on an iOS home-screen dock"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </div>
  );
}
