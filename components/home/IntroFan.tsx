"use client";

/**
 * IntroFan — the Intro headshot, scrubbed by scroll. The circle grows into the
 * rounded photo card from the Figma "Main Content" frame (node 587:1795) and
 * four more photos fan out from underneath it, staying centred the whole time.
 * Scroll back up and it folds away again.
 *
 * Geometry is copied 1:1 from Figma, in Figma units (`u`). The 448px headshot
 * box is 298.67u wide (the Figma frame is a 2/3-scale of the 1920 layout), so
 * every card scales with the headshot at any width. Each card's photo is
 * counter-rotated inside its tilted card, exactly as in the file, so the photo
 * stays level while the card edge tilts.
 *
 * Phones (<640px) get a carousel instead: the five photos don't fit side by
 * side at a readable size, so the headshot is the big "main" card with one
 * photo peeking out on each side (the other two wait hidden behind). Once the
 * scroll-in lands, the main photo auto-advances (tap to skip ahead); scroll
 * back up and it returns to the headshot before folding away.
 *
 * Tuning knobs are right below.
 */

import gsap from "gsap";
import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ knobs */

/** Scroll window, as the headshot's centre position in the viewport (0 = top,
 *  1 = bottom). The scene is folded at FAN_START and fully fanned at FAN_END. */
export const FAN_START = 0.92;
export const FAN_END = 0.42;

/** Size of the whole block (circle and fan together) vs the Intro layout's
 *  448px headshot box. Scales around the centre, so nothing shifts. Desktop
 *  only — on phones Intro.tsx sizes the box so the full fan fits the screen. */
export const BLOCK_SIZE = 0.85;

/** Size of the fanned-out scene vs the circle (1 = the Figma proportions). The
 *  circle settles into the card at this scale. */
export const FAN_SIZE = 0.9;

/** Where each card starts, tucked behind the headshot. */
export const CARD_START_SCALE = 0.72;

/** Hover once fully fanned: the photo leans toward the cursor as if its weight
 *  pressed that corner in, the same tilt as the presentation-page slides. */
export const HOVER_TILT_DEG = 8;
const HOVER_PERSPECTIVE = "perspective(700px)";

/** Phone carousel: how long each photo is the main one, and the slide time
 *  (keep CAROUSEL_SLIDE_MS in sync with globals.css → .fan[data-carousel]). */
export const CAROUSEL_HOLD_MS = 2600;
const CAROUSEL_SLIDE_MS = 850;
/** Left → right, as in the Figma fan; the main photo advances rightward. */
const RING = ["dog", "blazer", "kyle", "scooter", "beach"] as const;
const PHONE = "(max-width: 639.98px)";

/** Slot (-2…2) of each photo when ring[(2 + index) % 5] is the main one. */
const slotOf = (key: string, index: number) => {
  const r = RING.indexOf(key as (typeof RING)[number]);
  return ((((r - 2 - index) % 5) + 7) % 5) - 2;
};

/** Phases of the 0→1 scroll progress: [start, end] for each part. */
const PHASES = {
  shape: [0, 0.55], // circle → rounded card
  zoom: [0, 0.7], // photo zooms out from the tight circle crop to the card crop
  halo: [0, 0.35], // the soft blurred halo fades away
  inner: [0.12, 0.72], // blazer + scooter cards
  outer: [0.25, 1], // dog + beach cards
} as const;

/* ------------------------------------------------------------------- data */

type Card = {
  key: string;
  src: string;
  alt: string;
  group: "inner" | "outer";
  /** visible card size, u */
  w: number;
  h: number;
  /** card centre relative to the headshot centre, u */
  dx: number;
  dy: number;
  /** card tilt, deg */
  rot: number;
  /** corner radius, u */
  r: number;
  shadow: boolean;
  /** the photo inside the card, % of the card box */
  img: { left: number; top: number; w: number; h: number; flip?: boolean };
  /** u from the card's left edge that can ever be seen (the rest is always
   *  under the headshot); the photo only needs to cover from here */
  visibleFrom?: number;
};

// Bottom → top, in Figma's stacking order.
const CARDS: Card[] = [
  {
    key: "dog",
    src: "/images/intro/dog.jpg",
    alt: "Kyle and his dog",
    group: "outer",
    w: 277.256,
    h: 277.256,
    dx: -382.945,
    dy: 17.205,
    rot: -2.68,
    r: 30.246,
    shadow: true,
    img: { left: -2.134, top: -25.115, w: 103.065, h: 137.42 },
  },
  {
    key: "beach",
    src: "/images/intro/beach.jpg",
    alt: "Kyle and his dog on a beach at sunset",
    group: "outer",
    w: 257,
    h: 257,
    dx: 373.81,
    dy: 51.4,
    rot: -2.3,
    r: 28.036,
    shadow: true,
    // mirrored in the Figma file
    img: { left: -1.899, top: -20.696, w: 106.53, h: 141.245, flip: true },
  },
  {
    key: "scooter",
    src: "/images/intro/scooter.jpg",
    alt: "Kyle with a scooter on a tropical road",
    group: "inner",
    w: 257,
    h: 233.524,
    dx: 187.57,
    dy: 13.98,
    rot: 3.21,
    r: 28.036,
    shadow: false,
    // Figma places this photo from 43u in; the card's first ~92u sit under the
    // headshot, so the uncovered strip is never seen
    img: { left: 16.95, top: -16.95, w: 93.0, h: 136.17 },
    visibleFrom: 60,
  },
  {
    key: "blazer",
    src: "/images/intro/blazer.jpg",
    alt: "Kyle in a blazer by the sea at sunset",
    group: "inner",
    w: 210.643,
    h: 223.091,
    dx: -209.85,
    dy: 17.3,
    rot: -1.33,
    r: 28.036,
    shadow: false,
    img: { left: -8.329, top: -25.546, w: 124.38, h: 156.89 },
  },
];

/**
 * Each photo is counter-rotated inside its tilted card (as in Figma), which can
 * leave a sliver of a card corner uncovered — the dog card shows a pale wedge
 * in the file itself. Scale each photo up just enough to cover all 4 corners.
 */
function coverScale(c: Card) {
  const iw = (c.img.w / 100) * c.w;
  const ih = (c.img.h / 100) * c.h;
  const cx = ((c.img.left + c.img.w / 2) / 100) * c.w;
  const cy = ((c.img.top + c.img.h / 2) / 100) * c.h;
  const a = (c.rot * Math.PI) / 180; // photo is rotated by -rot; undo it
  const x0 = c.visibleFrom ?? 0;
  let s = 1;
  for (const [x, y] of [[x0, 0], [c.w, 0], [x0, c.h], [c.w, c.h]]) {
    const dx = x - cx;
    const dy = y - cy;
    const lx = dx * Math.cos(a) - dy * Math.sin(a);
    const ly = dx * Math.sin(a) + dy * Math.cos(a);
    s = Math.max(s, (2 * Math.abs(lx)) / iw, (2 * Math.abs(ly)) / ih);
  }
  return s > 1 ? s * 1.004 : 1; // hairline of slack against AA seams
}

/* -------------------------------------------------------------- component */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function IntroFan({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const set = (vars: Record<string, number>) => {
      for (const k in vars) el.style.setProperty(`--fan-${k}`, vars[k].toFixed(4));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set({ shape: 1, zoom: 1, halo: 1, inner: 1, outer: 1 });
      el.dataset.fanned = "";
      return;
    }

    /* ---- Phone carousel ---- */
    const phone = window.matchMedia(PHONE);
    const items = [...el.querySelectorAll<HTMLElement>("[data-fan-item]")];
    let index = 0;
    let fanned = false;
    let inView = true;
    let tick: number | undefined;
    let settle: number | undefined;
    const apply = () =>
      items.forEach((it) => (it.dataset.slot = String(slotOf(it.dataset.fanItem!, index))));
    const stop = () => window.clearInterval(tick);
    const start = () => {
      stop();
      if (phone.matches && fanned && inView) tick = window.setInterval(advance, CAROUSEL_HOLD_MS);
    };
    function advance() {
      index = (index + 1) % RING.length;
      apply();
    }
    // Carousel runs once everything has landed; scrolling back up first slides
    // the headshot home (transitions still on), then hands back to the scrub.
    const setFanned = (v: boolean) => {
      if (v === fanned) return;
      fanned = v;
      window.clearTimeout(settle);
      if (v) {
        el.dataset.carousel = "";
        start();
      } else {
        stop();
        const wasAway = index !== 0;
        index = 0;
        apply();
        if (wasAway) settle = window.setTimeout(() => delete el.dataset.carousel, CAROUSEL_SLIDE_MS);
        else delete el.dataset.carousel;
      }
    };
    const onTap = () => {
      if (!phone.matches || !fanned) return;
      advance();
      start(); // full hold on the photo you picked
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(el);
    el.addEventListener("click", onTap);
    phone.addEventListener("change", start);

    const inOut = gsap.parseEase("power2.inOut");
    const out = gsap.parseEase("power2.out");
    const phase = (p: number, [a, b]: readonly [number, number]) =>
      clamp01((p - a) / (b - a));

    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const centre = (r.top + r.height / 2) / vh;
      const p = clamp01((FAN_START - centre) / (FAN_START - FAN_END));
      set({
        shape: inOut(phase(p, PHASES.shape)),
        zoom: inOut(phase(p, PHASES.zoom)),
        halo: phase(p, PHASES.halo),
        inner: out(phase(p, PHASES.inner)),
        outer: out(phase(p, PHASES.outer)),
      });
      // Hover tilt (desktop) and the carousel (phones) only once it's landed.
      if (p >= 1) el.dataset.fanned = "";
      else delete el.dataset.fanned;
      setFanned(p >= 1);
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
      stop();
      window.clearTimeout(settle);
      io.disconnect();
      el.removeEventListener("click", onTap);
      phone.removeEventListener("change", start);
    };
  }, []);

  // Tilt: the edge under the cursor sinks away, the rest of the photo reacts.
  // Only once the fan is fully open (data-fanned), and only for a real mouse.
  const onTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (!el.closest(".fan[data-fanned]")) return;
    if (window.matchMedia(`(hover: none), (prefers-reduced-motion: reduce), ${PHONE}`).matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 (left) … 0.5 (right)
    const py = (e.clientY - r.top) / r.height - 0.5; // -0.5 (top) … 0.5 (bottom)
    const rx = (-py * 2 * HOVER_TILT_DEG).toFixed(2); // top cursor → top recedes
    const ry = (px * 2 * HOVER_TILT_DEG).toFixed(2);
    el.style.transform = `${HOVER_PERSPECTIVE} rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  };
  const tilt = { onMouseMove: onTiltMove, onMouseLeave: onTiltLeave };

  return (
    <div
      ref={ref}
      className={`fan relative ${className}`}
      style={
        {
          "--fan-block": BLOCK_SIZE,
          "--fan-size": FAN_SIZE,
          "--fan-start-scale": CARD_START_SCALE,
        } as React.CSSProperties
      }
    >
      {/* Soft halo behind the circle (Ellipse 27063); fades as it fans out */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/headshot.png"
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="fan-halo absolute inset-0 size-full rounded-full object-cover blur-[1.04vw]"
      />

      {CARDS.map((c) => (
        <div
          key={c.key}
          className={`fan-card${c.shadow ? " fan-card--shadow" : ""}`}
          data-fan-item={c.key}
          data-slot={slotOf(c.key, 0)}
          style={
            {
              "--w": c.w,
              "--h": c.h,
              "--dx": c.dx,
              "--dy": c.dy,
              "--rot": c.rot,
              "--r": c.r,
              "--k": `var(--fan-${c.group})`,
            } as React.CSSProperties
          }
        >
          <div className="fan-tilt fan-card-face" {...tilt}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.src}
              alt={c.alt}
              loading="lazy"
              decoding="async"
              className="fan-card-img"
              data-flip={c.img.flip ? "" : undefined}
              style={{
                left: `${c.img.left}%`,
                top: `${c.img.top}%`,
                width: `${c.img.w}%`,
                height: `${c.img.h}%`,
                transform: `rotate(${-c.rot}deg) scale(${coverScale(c).toFixed(4)})${
                  c.img.flip ? " scaleX(-1)" : ""
                }`,
              }}
            />
          </div>
        </div>
      ))}

      {/* The headshot itself: circle → card (tilt outside, morph inside) */}
      <div
        className="fan-tilt fan-hero-slot absolute inset-0"
        data-fan-item="kyle"
        data-slot={0}
        {...tilt}
      >
        <div className="fan-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/intro/kyle.jpg"
            alt="Kyle Burgess"
            loading="lazy"
            decoding="async"
            className="fan-hero-img"
          />
        </div>
      </div>
    </div>
  );
}
