"use client";

/**
 * Hero — rebuilt against the exact Figma frame (1920×1247). The desktop layer
 * uses `aspect-[1920/1247]` so every element can be placed with the Figma
 * coordinate converted straight to a percentage of the frame (no eyeballing):
 *
 *   frame      1920 × 1247
 *   photo      left -314  top 87.45  size 2048.25 × 1159.39   blur 4.03px
 *   Kyle       left 322.05 top 286.31  box 502.4 × 164.25   181.15px italic 300, centered
 *   Burgess    left 735.89 top 450.56  box 1043.45 × 164.25 181.15px 400, centered
 *   portfolio  left 1355.03 top 614.81 box 195.65 × 52.33   36.23px mono 300
 *   colour     #FBF4E6 (cream)
 *
 * The looping dappled-green video is the background fill. The portrait is a
 * transparent cutout, solid and in front of the wordmark, with a soft blur
 * rising from the bottom (≈ the 4px layer blur, kept off the face).
 *
 * On load a GSAP timeline plays the intro: the wordmark rises + de-blurs word by
 * word, then the portrait "comes into focus" (fade + settle from 1.04 + an
 * overall blur resolving to sharp). A CSS sheen then glints across the name.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

const FRAME_W = 1920;
const FRAME_H = 1247;
const x = (px: number) => `${(px / FRAME_W) * 100}%`;
const y = (px: number) => `${(px / FRAME_H) * 100}%`;
const vw = (px: number) => `${(px / FRAME_W) * 100}vw`;

function Backdrop() {
  return (
    <video
      className="absolute inset-0 -z-10 size-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      poster="/images/hero-bg-green.png"
    >
      <source src="/videos/hero.mp4" type="video/mp4" />
    </video>
  );
}

function Portrait({ className = "" }: { className?: string }) {
  return (
    <>
      <img
        data-hero-portrait="sharp"
        src="/images/hero-kyle.png"
        alt="Kyle Burgess"
        className={`pointer-events-none absolute z-20 max-w-none opacity-0 ${className}`}
      />
      <img
        data-hero-portrait="soft"
        src="/images/hero-kyle.png"
        aria-hidden
        className={`pointer-events-none absolute z-20 max-w-none opacity-0 blur-[5px] [mask-image:linear-gradient(to_bottom,transparent_52%,black_86%)] ${className}`}
      />
    </>
  );
}

/** The cursor-following sheen: an inner span with a roomy line-height so the
 *  background-clip box contains the descenders, plus pointer handlers that drive
 *  the glow's position and intensity. */
function Sheen({ children }: { children: string }) {
  const onGlow = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
    el.style.setProperty("--glow", "1");
  };
  const offGlow = (e: React.PointerEvent<HTMLSpanElement>) => {
    e.currentTarget.style.setProperty("--glow", "0");
  };
  return (
    <span
      className="hero-shimmer inline-block leading-[1.25]"
      onPointerEnter={onGlow}
      onPointerMove={onGlow}
      onPointerLeave={offGlow}
    >
      {children}
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Baseline: BOTH layouts (desktop + mobile) start visible, so shrinking or
    // widening the window past the breakpoint never exposes an un-animated layer
    // still stuck at opacity 0. The entrance below only re-hides + animates
    // whichever layout is on screen at load.
    const allHero = Array.from(
      el.querySelectorAll<HTMLElement>(
        "[data-hero-word], [data-hero-portrait]",
      ),
    );
    gsap.set(allHero, { opacity: 1 });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Animate the currently-rendered layout (desktop or mobile). Fall back to
    // every match if visibility can't be resolved yet.
    const pick = (sel: string) => {
      const all = Array.from(el.querySelectorAll<HTMLElement>(sel));
      const vis = all.filter((n) => n.offsetParent !== null);
      return vis.length ? vis : all;
    };
    const words = pick("[data-hero-word]");
    const portrait = pick("[data-hero-portrait]");
    const sharp = pick('[data-hero-portrait="sharp"]');

    // The mobile portrait centres via -translate-x-1/2, so it only gets the
    // opacity + de-blur; the scale/drift (which writes transform) is desktop-only.
    const isDesktop = window.matchMedia("(min-width: 640px)").matches;
    const portraitFrom = isDesktop
      ? { opacity: 0, y: 18, scale: 1.04 }
      : { opacity: 0 };
    const portraitTo = isDesktop
      ? { opacity: 1, y: 0, scale: 1, clearProps: "transform" }
      : { opacity: 1 };

    const tl = gsap.timeline();
    tl.set(words, { opacity: 0, y: 26, filter: "blur(10px)" })
      .set(portrait, portraitFrom)
      .set(sharp, { filter: "blur(12px)" })
      .to(
        words,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
          clearProps: "filter,transform",
        },
        0,
      )
      .to(
        portrait,
        { ...portraitTo, duration: 1.1, ease: "power3.out" },
        0.25,
      )
      .to(
        sharp,
        {
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power2.out",
          clearProps: "filter",
        },
        0.25,
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative isolate w-full overflow-hidden bg-forest text-cream"
    >
      {/* ---------- Desktop: exact Figma frame ---------- */}
      <div className="relative hidden w-full sm:block sm:aspect-[1920/1247]">
        <Backdrop />

        {/* Portrait, placed by the Figma photo box (left -314, top 87.45, 2048×1159) */}
        <Portrait className="left-[-18.7%] top-[7.013%] h-[92.974%] w-[106.680%] object-cover object-center" />

        {/* Wordmark (z-10, behind the portrait) */}
        <div className="absolute inset-0 z-10 text-cream">
          <span
            data-hero-word
            className="absolute flex items-center justify-center font-serif font-light italic leading-[0.92]"
            style={{
              left: x(322.05),
              top: y(286.31),
              width: x(502.4),
              height: y(164.25),
              fontSize: vw(181.154),
              letterSpacing: "-0.044em",
              opacity: 0,
            }}
          >
            <Sheen>Kyle</Sheen>
          </span>
          <span
            data-hero-word
            className="absolute flex items-center justify-center font-serif font-normal leading-[0.92]"
            style={{
              left: x(735.89 + 26),
              top: y(450.56),
              width: x(1043.45),
              height: y(164.25),
              fontSize: vw(181.154),
              letterSpacing: "-0.044em",
              opacity: 0,
            }}
          >
            <Sheen>Burgess</Sheen>
          </span>
          <span
            data-hero-word
            className="absolute flex items-center font-mono font-light"
            style={{
              left: x(1355.03 + 26),
              top: y(614.81),
              width: x(195.65),
              height: y(52.33),
              fontSize: vw(36.2309),
              opacity: 0,
            }}
          >
            portfolio
          </span>
        </div>
      </div>

      {/* ---------- Mobile: the Figma mobile frame (517×389) ---------- */}
      <div className="relative block aspect-[517/389] w-full overflow-hidden sm:hidden">
        <Backdrop />

        {/* Portrait — framed head-to-chest so the face clears the wordmark. */}
        <Portrait className="left-[17.8%] top-[17%] h-[95%] w-[47.97%] object-cover object-[50%_18%]" />

        {/* Wordmark — in FRONT of the portrait on mobile (per the Figma frame,
            "Burgess" reads over his chest), unlike the desktop layering. */}
        <div className="absolute inset-0 z-30 text-cream">
          <span
            data-hero-word
            className="absolute left-[6.77%] top-[29.05%] font-serif text-[11.6vw] font-light italic leading-[0.92] tracking-[-0.044em] opacity-0"
          >
            <Sheen>Kyle</Sheen>
          </span>
          <span
            data-hero-word
            className="absolute left-[44%] top-[52%] font-serif text-[11.6vw] font-normal leading-[0.92] tracking-[-0.044em] opacity-0"
          >
            <Sheen>Burgess</Sheen>
          </span>
          <span
            data-hero-word
            className="absolute left-[70.5%] top-[66.5%] font-mono text-[2.71vw] font-light text-cream/85 opacity-0"
          >
            portfolio
          </span>
        </div>
      </div>
    </section>
  );
}
