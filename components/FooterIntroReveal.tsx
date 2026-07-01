"use client";

import { useEffect, useRef } from "react";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The home-page footer intro ("Thanks for scrolling…"). The brown gradient block
 * sits BEHIND the "Let's Connect" portrait panel (which renders after it in the
 * DOM). On scroll it's pushed down so it's fully hidden behind that panel, then
 * rises up and emerges from behind the panel's top edge as the footer comes into
 * view — with a slight parallax drift on the paragraph for depth.
 *
 * Static on reduced-motion and on mobile (where a pinned reveal is fussier).
 */
export default function FooterIntroReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 639px)")
        .matches
    ) {
      return; // rest state, no transform
    }
    const portrait = el.nextElementSibling as HTMLElement | null;
    if (!portrait) return;
    const para = el.querySelector("p");

    let raf = 0;
    const update = () => {
      // Layout distance from the block's top to the portrait's top — i.e. how far
      // to push the block down so it's completely tucked behind the panel.
      const D = Math.max(0, portrait.offsetTop - el.offsetTop);
      const vh = window.innerHeight;
      // Progress off the portrait's viewport position (it never transforms, so
      // this is a stable driver — no feedback from the block's own transform).
      const pTop = portrait.getBoundingClientRect().top;
      const p = clamp((vh - pTop) / (vh * 0.8), 0, 1);
      const e = easeOut(p);
      el.style.transform = `translate3d(0, ${((1 - e) * D).toFixed(1)}px, 0)`;
      if (para)
        para.style.transform = `translate3d(0, ${((1 - e) * 40).toFixed(1)}px, 0)`;
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

  return (
    <div
      ref={ref}
      className="relative z-0 rounded-t-[40px] bg-[linear-gradient(106.65deg,#A08971_30.75%,#917E6A_59.92%,#7F6E5C_94.73%)] px-6 pb-[clamp(7rem,17vw,327px)] pt-[clamp(3rem,6.6vw,127px)] text-center will-change-transform sm:rounded-t-[60px]"
    >
      {children}
    </div>
  );
}
