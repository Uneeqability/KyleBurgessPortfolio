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
 *
 * On top sits the decorative "caught mid-edit" layer (selection box, mis-kerned
 * g, smart guide, filename gag) — see ./HeroMidEdit.tsx for it and its tunables.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  BurgessGlyphs,
  GhostWord,
  ghostSegment,
  GUIDE_TO_PCT,
  GUIDE_TO_PCT_MOBILE,
  GUIDE_TOP_PCT,
  GUIDE_TOP_PCT_MOBILE,
  NOSE_X_PCT,
  NOSE_X_PCT_MOBILE,
  PhotoLayer,
  PortfolioLabel,
  shimmerHandlers,
  SHOW_GUIDE_ON_MOBILE,
  SmartGuide,
  TakeoverChrome,
  WordXf,
  midEditVars,
  useMidEdit,
} from "./HeroMidEdit";

const FRAME_W = 1920;
const FRAME_H = 1247;
const x = (px: number) => `${(px / FRAME_W) * 100}%`;
const y = (px: number) => `${(px / FRAME_H) * 100}%`;
const vw = (px: number) => `${(px / FRAME_W) * 100}vw`;

/* Word boxes — shared by each real word and its invisible ghost (in the
   mid-edit layer) so the two always line up exactly. */
const KYLE_D_CLASS =
  "absolute flex items-center justify-center font-serif font-light italic leading-[0.92]";
const KYLE_D_BOX: React.CSSProperties = {
  left: x(322.05),
  top: y(286.31),
  width: x(502.4),
  height: y(164.25),
  fontSize: vw(181.154),
  letterSpacing: "-0.044em",
};
const BURGESS_D_CLASS =
  "absolute flex items-center justify-center font-serif font-normal leading-[0.92]";
const BURGESS_D_BOX: React.CSSProperties = {
  left: x(735.89 + 26),
  top: y(450.56),
  width: x(1043.45),
  height: y(164.25),
  fontSize: vw(181.154),
  letterSpacing: "-0.044em",
};
const BURGESS_M_CLASS =
  "absolute left-[47.2%] top-[43.19%] font-serif text-[11.78vw] font-normal leading-[0.92] tracking-[-0.044em]";

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
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className={`pointer-events-none absolute z-20 max-w-none opacity-0 ${className}`}
      />
      <img
        data-hero-portrait="soft"
        src="/images/hero-kyle.png"
        aria-hidden
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className={`pointer-events-none absolute z-20 max-w-none opacity-0 blur-[5px] [mask-image:linear-gradient(to_bottom,transparent_52%,black_86%)] ${className}`}
      />
    </>
  );
}

/** A shimmer piece: clips the band of light to its glyphs (roomy line-height
 *  for descenders). The pointer handlers live on the word box
 *  (`shimmerHandlers`), so every piece of a word shares one band of light. */
function Sheen({ children }: { children: React.ReactNode }) {
  return <span className="hero-shimmer inline-block leading-[1.25]">{children}</span>;
}

/** "Bur" / "ess" are shimmer pieces; the g gets the same class directly (it
    can't sit inside another piece's text clip — see BurgessGlyphs). */
const sheenSegment = (text: string) => <Sheen>{text}</Sheen>;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useMidEdit(root);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Baseline: BOTH layouts (desktop + mobile) start visible, so shrinking or
    // widening the window past the breakpoint never exposes an un-animated layer
    // still stuck at opacity 0. The entrance below only re-hides + animates
    // whichever layout is on screen at load.
    const allHero = Array.from(
      el.querySelectorAll<HTMLElement>(
        "[data-hero-word], [data-hero-portrait], [data-hero-overlay]",
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
    const overlay = pick("[data-hero-overlay]");

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
      // Editor chrome appears once "Burgess" has landed.
      .set(overlay, { opacity: 0 }, 0)
      .to(overlay, { opacity: 1, duration: 0.5, ease: "power2.out" }, 1.15);

    // The "come into focus" de-blur is desktop-only — the mobile portrait stays
    // crisp (no blur at all).
    if (isDesktop) {
      tl.set(sharp, { filter: "blur(12px)" }, 0).to(
        sharp,
        {
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power2.out",
          clearProps: "filter",
        },
        0.25,
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      data-edit="editing"
      data-guide="on"
      data-takeover="off"
      style={midEditVars}
      className="relative isolate w-full overflow-hidden bg-forest text-cream"
    >
      {/* The visual wordmark below is decorative (split letters, a cycling
          label); this is what assistive tech reads. */}
      <h1 className="sr-only">Kyle Burgess</h1>
      <p className="sr-only">portfolio</p>

      {/* ---------- Desktop: exact Figma frame ---------- */}
      <div
        data-me-frame="1920"
        className="relative hidden w-full sm:block sm:aspect-[1920/1247]"
      >
        <Backdrop />

        {/* Portrait, placed by the Figma photo box (left -314, top 87.45, 2048×1159).
            Wrapped as a movable layer for the takeover. */}
        <PhotoLayer>
          <Portrait className="left-[-18.7%] top-[7.013%] h-[92.974%] w-[106.680%] object-cover object-center" />
        </PhotoLayer>

        {/* Wordmark (z-10, behind the portrait) */}
        <div aria-hidden="true" className="absolute inset-0 z-10 text-cream">
          <span
            data-hero-word
            className={KYLE_D_CLASS}
            style={{ ...KYLE_D_BOX, opacity: 0 }}
          >
            <WordXf word="kyle" {...shimmerHandlers}>
              <Sheen>Kyle</Sheen>
            </WordXf>
          </span>
          <span
            data-hero-word
            className={BURGESS_D_CLASS}
            style={{ ...BURGESS_D_BOX, opacity: 0 }}
          >
            <WordXf word="burgess" {...shimmerHandlers}>
              <BurgessGlyphs segment={sheenSegment} gClassName="hero-shimmer" />
            </WordXf>
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
            <WordXf word="portfolio">
              <PortfolioLabel />
            </WordXf>
          </span>
        </div>

        {/* Mid-edit layer — above the portrait, like editor UI: Kyle's
            selection + cursor on a ghost of "Burgess", the nose guide, and
            your takeover chrome. Kyle's size tag sits top-right so it never
            covers the g's descender or crowds the "portfolio" label. */}
        <div
          data-hero-overlay
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30"
          style={{ opacity: 0 }}
        >
          <GhostWord word="kyle" className={KYLE_D_CLASS} style={KYLE_D_BOX}>
            Kyle
          </GhostWord>
          <GhostWord word="burgess" className={BURGESS_D_CLASS} style={BURGESS_D_BOX} kyle>
            <BurgessGlyphs withCursor segment={ghostSegment} />
          </GhostWord>
          <SmartGuide top={GUIDE_TOP_PCT} from={NOSE_X_PCT} to={GUIDE_TO_PCT} />
          <TakeoverChrome />
        </div>
      </div>

      {/* ---------- Mobile: exact replica of the Figma mobile frame (517×389) ---------- */}
      <div
        data-me-frame="517"
        className="relative block aspect-[517/389] w-full overflow-hidden sm:hidden"
      >
        <Backdrop />

        {/* Wordmark — BEHIND the portrait (the cutout body sits in front of it,
            exactly per the Figma layering). Positions are the Figma px coords
            converted to % of the 517×389 frame. */}
        <div aria-hidden="true" className="absolute inset-0 text-cream">
          <span
            data-hero-word
            className="absolute left-[13%] top-[29.05%] font-serif text-[11.78vw] font-light italic leading-[0.92] tracking-[-0.044em] opacity-0"
          >
            <WordXf word="kyle" {...shimmerHandlers}>
              <Sheen>Kyle</Sheen>
            </WordXf>
          </span>
          <span data-hero-word className={`${BURGESS_M_CLASS} opacity-0`}>
            <WordXf word="burgess" {...shimmerHandlers}>
              <BurgessGlyphs segment={sheenSegment} gClassName="hero-shimmer" />
            </WordXf>
          </span>
          <span
            data-hero-word
            className="absolute left-[73.95%] top-[61%] font-mono text-[2.36vw] font-light text-cream/85 opacity-0"
          >
            <PortfolioLabel />
          </span>
        </div>

        {/* Portrait — the oversized TRANSPARENT cutout clipped by the Figma photo
            box, sitting in FRONT of the wordmark. The image offsets/size are the
            exact Figma fill transform; the box carries the Figma's soft blur. */}
        <div className="absolute left-[17.82%] top-[22.88%] h-[89.2%] w-[47.93%] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-hero-portrait="sharp"
            src="/images/hero-kyle.png"
            alt="Kyle Burgess"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="pointer-events-none absolute left-[-109.34%] top-[-12.31%] h-[112.34%] w-[264.13%] max-w-none opacity-0"
          />
        </div>

        {/* Mid-edit chrome — the tag sits top-right here, clear of the label */}
        <div
          data-hero-overlay
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30"
          style={{ opacity: 0 }}
        >
          <GhostWord word="burgess" className={BURGESS_M_CLASS} kyle>
            <BurgessGlyphs withCursor segment={ghostSegment} />
          </GhostWord>
          {SHOW_GUIDE_ON_MOBILE && (
            <SmartGuide
              top={GUIDE_TOP_PCT_MOBILE}
              from={NOSE_X_PCT_MOBILE}
              to={GUIDE_TO_PCT_MOBILE}
            />
          )}
        </div>
      </div>
    </section>
  );
}
