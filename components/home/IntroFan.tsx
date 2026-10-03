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
 * Tuning knobs are right below.
 */

import gsap from "gsap";
import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ knobs */

/** Scroll window, as the headshot's centre position in the viewport (0 = top,
 *  1 = bottom). The scene is folded at FAN_START and fully fanned at FAN_END. */
export const FAN_START = 0.92;
export const FAN_END = 0.42;

/** Size of the fanned-out scene vs the Figma frame (1 = as drawn). The circle
 *  starts at its usual size and settles into the card at this scale. */
export const FAN_SIZE = 0.9;

/** Horizontal spread on phones (1 = the Figma spacing). The cards overlap more
 *  so the outer ones still fit inside a 375px screen. */
export const MOBILE_SPREAD = 0.44;

/** Where each card starts, tucked behind the headshot. */
export const CARD_START_SCALE = 0.72;

/** Phases of the 0→1 scroll progress: [start, end] for each part. */
const PHASES = {
  shape: [0, 0.55], // circle → rounded card
  zoom: [0, 0.7], // photo zooms out from the tight circle crop to the card crop
  halo: [0, 0.35], // the soft blurred halo fades away
  inner: [0.12, 0.72], // waterfall + snow cards
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
    key: "snow",
    src: "/images/intro/snow.jpg",
    alt: "Kyle snowboarding",
    group: "inner",
    w: 257,
    h: 233.524,
    dx: 187.57,
    dy: 13.98,
    rot: 3.21,
    r: 28.036,
    shadow: false,
    img: { left: -1.35, top: -26.863, w: 103.502, h: 140.885 },
  },
  {
    key: "waterfall",
    src: "/images/intro/waterfall.jpg",
    alt: "Kyle at a waterfall",
    group: "inner",
    w: 210.643,
    h: 223.091,
    dx: -209.85,
    dy: 17.3,
    rot: -1.33,
    r: 28.036,
    shadow: false,
    img: { left: -1.215, top: -15.447, w: 103.967, h: 130.888 },
  },
];

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
      return;
    }

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
      className={`fan relative ${className}`}
      style={
        {
          "--fan-size": FAN_SIZE,
          "--fan-spread-mobile": MOBILE_SPREAD,
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.src}
            alt={c.alt}
            loading="lazy"
            decoding="async"
            className="fan-card-img"
            style={{
              left: `${c.img.left}%`,
              top: `${c.img.top}%`,
              width: `${c.img.w}%`,
              height: `${c.img.h}%`,
              transform: `rotate(${-c.rot}deg)${c.img.flip ? " scaleX(-1)" : ""}`,
            }}
          />
        </div>
      ))}

      {/* The headshot itself: circle → card */}
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
  );
}
