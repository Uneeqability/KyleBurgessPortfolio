"use client";

/**
 * Hero "caught mid-edit" layer. The joke: Kyle is gazing at his own name like a
 * designer judging the kerning — and you've walked in on him still working on
 * it, live, in a shared Figma file.
 *
 *   KYLE (multiplayer collaborator, purple)
 *   • His named cursor grips the mis-kerned "g" of "Burgess"; his selection
 *     (outline, handles, real size in design px) sits on the word.
 *   • Idle loop — he drags "Burgess" off the smart guide, hesitates, lets it
 *     snap back (the red guide flashes), then fiddles with the g and changes
 *     his mind. The hero is never quite still.
 *   • The red smart guide snaps the TOP EDGE of the selection to the nose tip.
 *   • Each snap moves the "portfolio" filename on a version (portfolio_v2 →
 *     … → portfolio_v9_FINAL_final → back to portfolio).
 *
 *   YOU (desktop mouse) — you get your own Figma name tag
 *   • Hover = you interrupted him: the g lands, everything snaps home, his
 *     chrome fades — and the file is yours. Every layer is editable: "Kyle",
 *     "Burgess", the "portfolio" label, and the photo (picked by its actual
 *     pixels, so you can grab Kyle himself). Hover shows Figma's blue outline;
 *     click/drag to select + move; corners scale proportionally (like the K
 *     tool), edges stretch; arrows nudge (Shift = 10px); Esc deselects. Red
 *     smart guides snap to the other layers, each layer's original spot, the
 *     page centre and the nose.
 *   • Leave and Kyle takes it back: everything glides home, he gets back to work.
 *
 *   Touch: a tap "commits" briefly, then he resumes. Reduced motion: the static
 *   mid-edit frame only.
 *
 * Kyle's chrome must draw ABOVE the portrait while the words sit BEHIND it, so
 * each word has an invisible, pixel-identical "ghost" in a top layer. Real word
 * and ghost read the same transform vars, so they never drift apart.
 * Styles: app/globals.css → "Hero mid-edit".
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ====================== TUNING KNOBS (edit these) ======================= */

/** Kyle's multiplayer colour — his cursor, name tag and selection. */
export const KYLE_COLOR = "#A259FF";
/** YOUR colour when you take over — selection, handles, your name tag. */
export const SELECT_COLOR = "#0D99FF";
/** Smart guides / snapping — Figma's red. */
export const GUIDE_COLOR = "#F24E1E";
/** Name tag on Kyle's cursor. */
export const CURSOR_NAME = "Kyle";
/** Your tag. A riff on Figma's guest naming ("Anonymous <animal>") — on a
 *  portfolio, we can guess who's viewing. */
export const VISITOR_NAME = "Anonymous Recruiter";

/**
 * Nose smart guide (desktop), % of the hero frame so it holds at any width. It
 * runs along the TOP EDGE of the "Burgess" selection — the edge that
 * "snapped" — from the nose tip to the box's right edge.
 *   NOSE_X_PCT    ← where it starts: slide it onto the tip of the nose
 *   GUIDE_TOP_PCT ← its height: the box's top edge (measured; nudge if needed)
 */
export const NOSE_X_PCT = 36.1;
export const GUIDE_TOP_PCT = 36.03;
export const GUIDE_TO_PCT = 83.48;

/** Same, for the mobile frame. */
export const NOSE_X_PCT_MOBILE = 30.3;
export const GUIDE_TOP_PCT_MOBILE = 45.77;
export const GUIDE_TO_PCT_MOBILE = 88.36;
export const SHOW_GUIDE_ON_MOBILE = true;

/** How far the "g" is out of place at rest (em of the word ≈ 5px @1440). */
export const G_DROP_EM = 0.036;
export const G_ROTATE_DEG = -3;

/** "Still working on it" idle loop. */
export const IDLE_START_DELAY_S = 2.6; // after the intro
export const IDLE_REST_S = 2.2; // breather between moves
export const IDLE_DRIFT_PX = { x: 5, y: -3 }; // how far he drags "Burgess" off

/** Interaction timing (ms). */
export const SNAP_MS = 250; // the g springs into place
export const RESTORE_DELAY_MS = 1200; // you leave → Kyle takes it back
export const TAP_REVERT_MS = 2200; // touch: how long the commit holds

/** Takeover (desktop). */
export const SNAP_THRESHOLD_PX = 6;
export const MIN_SCALE = 0.35;
export const MAX_SCALE = 2.5;

/** Hover shimmer on the name: angle of the band of light, and how closely it
 *  trails your cursor (0–1; lower = silkier, more lag; 1 = locked to cursor). */
export const SHIMMER_ANGLE_DEG = 110; // keep in sync with globals.css
export const SHIMMER_FOLLOW = 0.14;

/** "portfolio" filename gag. The label moves on to the next version each time
 *  Kyle snaps "Burgess" back onto the guide (so it changes because he edits,
 *  not on its own timer), and types itself back to the first entry when you
 *  take over. After the last version it loops back to plain "portfolio". */
export const LABEL_VARIANTS = [
  "portfolio",
  "portfolio_v2",
  "portfolio_v3b",
  "portfolio_v4_final",
  "portfolio_v7_FINAL",
  "portfolio_v9_FINAL_final",
];
export const LABEL_TYPE_MS = 25; // per character, backspace and retype
export const LABEL_CARET_LINGER_MS = 700; // caret blinks this long after typing
/** Skip a filename that would land within this many px of the hero's edge
 *  (narrow screens drop the longer ones). */
export const LABEL_EDGE_MARGIN_PX = 8;

/** Events the controller sends the label (on the hero section). */
const LABEL_NEXT_EVENT = "me:label-next";
const LABEL_RESET_EVENT = "me:label-reset";

/* ======================================================================== */

type Item = "kyle" | "burgess" | "portfolio" | "photo";
const ITEMS: Item[] = ["kyle", "burgess", "portfolio", "photo"];
const PREFIX: Record<Item, string> = { kyle: "k", burgess: "b", portfolio: "p", photo: "i" };

/** Starting custom properties for the hero section (colours + transforms). */
export const midEditVars = {
  "--me-kyle": KYLE_COLOR,
  "--me-select": SELECT_COLOR,
  "--me-guide": GUIDE_COLOR,
  "--me-g-drop": `${G_DROP_EM}em`,
  "--me-g-rot": `${G_ROTATE_DEG}deg`,
  ...Object.fromEntries(
    ITEMS.flatMap((it) => [
      [`--me-${PREFIX[it]}x`, "0px"],
      [`--me-${PREFIX[it]}y`, "0px"],
      [`--me-${PREFIX[it]}sx`, "1"],
      [`--me-${PREFIX[it]}sy`, "1"],
    ]),
  ),
  "--me-iox": "50%",
  "--me-ioy": "50%",
} as React.CSSProperties;

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------- shimmer -------------------------------- */

/**
 * Pointer handlers for a word's shimmer. Put them on the word's box: they light
 * every `.hero-shimmer` piece inside it (so "Bur", "g" and "ess" share one band
 * of light). Hover only: the band appears where your cursor enters and trails
 * it with a little easing; it fades out when you leave.
 */
export const shimmerHandlers = (() => {
  const rad = (SHIMMER_ANGLE_DEG * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  /** Light every piece at a screen point (band positions line up in px). */
  const light = (host: HTMLElement, x: number, y: number, glow: string) => {
    host.querySelectorAll<HTMLElement>(".hero-shimmer").forEach((el) => {
      const r = el.getBoundingClientRect();
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!r.width || !w) return;
      // Screen → the element's own (unscaled) px, then project onto the
      // gradient line (CSS gradient-line maths for the band's angle).
      const lx = ((x - r.left) * w) / r.width;
      const ly = ((y - r.top) * h) / r.height;
      const len = Math.abs(w * dx) + Math.abs(h * dy);
      const sp = (lx - w / 2) * dx + (ly - h / 2) * dy + len / 2;
      el.style.setProperty("--sp", `${sp}px`);
      el.style.setProperty("--glow", glow);
    });
  };
  // Per-word follow state: where the light is vs. where the cursor is.
  type Follow = { x: number; y: number; tx: number; ty: number; raf: number };
  const follows = new WeakMap<HTMLElement, Follow>();
  const step = (host: HTMLElement, f: Follow) => {
    f.x += (f.tx - f.x) * SHIMMER_FOLLOW;
    f.y += (f.ty - f.y) * SHIMMER_FOLLOW;
    light(host, f.x, f.y, "1");
    // Keep easing until the light has caught up with the cursor.
    f.raf =
      Math.abs(f.tx - f.x) + Math.abs(f.ty - f.y) > 0.3
        ? requestAnimationFrame(() => step(host, f))
        : 0;
  };
  return {
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
      const host = e.currentTarget;
      const prev = follows.get(host);
      if (prev) cancelAnimationFrame(prev.raf);
      // Appear right under the cursor (the glow fades in via CSS).
      const f = { x: e.clientX, y: e.clientY, tx: e.clientX, ty: e.clientY, raf: 0 };
      follows.set(host, f);
      light(host, f.x, f.y, "1");
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      const host = e.currentTarget;
      const f = follows.get(host);
      if (!f) return;
      f.tx = e.clientX;
      f.ty = e.clientY;
      if (reducedMotion() || SHIMMER_FOLLOW >= 1) {
        f.x = f.tx;
        f.y = f.ty;
        return light(host, f.x, f.y, "1");
      }
      if (!f.raf) f.raf = requestAnimationFrame(() => step(host, f));
    },
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
      const host = e.currentTarget;
      const f = follows.get(host);
      if (f) cancelAnimationFrame(f.raf);
      follows.delete(host);
      host
        .querySelectorAll<HTMLElement>(".hero-shimmer")
        .forEach((el) => el.style.setProperty("--glow", "0"));
    },
  };
})();

/* ------------------------------ components ------------------------------ */

/** Wraps a real layer so it can be moved/scaled (shares vars with its ghost).
 *  Extra props (e.g. `shimmerHandlers`) land on the wrapper, which hugs the word. */
export function WordXf({
  word,
  children,
  ...rest
}: { word: Item; children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`me-xf me-xf-${word}`} data-me-word={word} {...rest}>
      {children}
    </span>
  );
}

/** Kyle's Figma multiplayer cursor: coloured arrow + name tag. */
function KyleCursor() {
  return (
    <span className="me-cursor me-kyle-chrome">
      {/* Figma's collaborator pointer: a tailless arrowhead, white rim */}
      <svg className="me-cursor-arrow" viewBox="0 0 15 19" aria-hidden="true">
        <path
          d="M1.5 1.5v15.2l4.2-3.9h6.6z"
          fill="var(--me-kyle)"
          stroke="#fff"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
      <span className="me-cursor-name">{CURSOR_NAME}</span>
    </span>
  );
}

/**
 * "Burgess" as Bur | g | ess, with the mis-kerned "g" in its own span. The g
 * must NOT sit inside another piece's background-clip:text: with a transformed
 * ancestor (the move/scale wrapper) and a transformed child (the tilted g),
 * Chrome stamps the g's glyph at the wrong spot. So each piece clips its own
 * text: the caller wraps "Bur"/"ess" via `segment` (the shimmer for the real
 * word, plain inline-blocks for the ghost) and passes `gClassName` to give the
 * g the same treatment. Same boxes either way, so real + ghost stay identical.
 * The ghost copy carries Kyle's cursor, so it drags (and snaps) with the g.
 */
export function BurgessGlyphs({
  segment = (text) => text,
  gClassName = "",
  withCursor = false,
}: {
  segment?: (text: string) => React.ReactNode;
  gClassName?: string;
  withCursor?: boolean;
}) {
  return (
    <>
      {segment("Bur")}
      <span className={`me-g ${gClassName}`}>
        g
        {withCursor && <KyleCursor />}
      </span>
      {segment("ess")}
    </>
  );
}

/** Ghost segments: plain inline-blocks matching the shimmer pieces' boxes. */
export const ghostSegment = (text: string) => (
  <span className="inline-block">{text}</span>
);

const HANDLES: [string, string][] = [
  ["0%", "0%"],
  ["50%", "0%"],
  ["100%", "0%"],
  ["100%", "50%"],
  ["100%", "100%"],
  ["50%", "100%"],
  ["0%", "100%"],
  ["0%", "50%"],
];

/**
 * Invisible copy of a word in the top layer. Pass the SAME box className/style
 * as the real word. Its box is the Figma text box (advance width × line
 * height); with `kyle` it also wears Kyle's selection chrome.
 */
export function GhostWord({
  word,
  className,
  style,
  kyle = false,
  tag = "top-right",
  children,
}: {
  word: Item;
  className: string;
  style?: React.CSSProperties;
  kyle?: boolean;
  tag?: "bottom" | "top-right";
  children: React.ReactNode;
}) {
  return (
    <span className={className} style={style}>
      <span className={`me-xf me-xf-${word}`} data-me-ghost={word}>
        <span className="me-ghost relative inline-block leading-[1.25]">
          {children}
          <span
            className={kyle ? "me-box me-box--kyle me-kyle-chrome" : "me-box"}
            data-me-measure
          >
            {kyle && (
              <>
                {HANDLES.map(([left, top]) => (
                  <span
                    key={left + top}
                    className="me-handle me-handle--kyle"
                    style={{ left, top }}
                  />
                ))}
                <span className="me-tag me-tag--kyle" data-pos={tag} data-me-dims />
              </>
            )}
          </span>
        </span>
      </span>
    </span>
  );
}

/** Wraps the desktop portrait so the photo is a movable layer too. The inner
 *  box is sized at runtime to Kyle's actual pixels (the cutout's bounds). */
export function PhotoLayer({ children }: { children: React.ReactNode }) {
  return (
    <div className="me-xf-photo pointer-events-none absolute inset-0 z-20" data-me-photo>
      {children}
      <span className="absolute" data-me-photo-box />
    </div>
  );
}

/** The nose smart guide (red, with Figma's "x" snap markers). */
export function SmartGuide({ top, from, to }: { top: number; from: number; to: number }) {
  return (
    <span
      className="me-guide"
      style={{ top: `${top}%`, left: `${from}%`, width: `${to - from}%` }}
    >
      <span className="me-x" style={{ left: 0 }} />
      <span className="me-x" style={{ left: "100%" }} />
    </span>
  );
}

const USER_HANDLES: { id: string; left: string; top: string }[] = [
  { id: "nw", left: "0%", top: "0%" },
  { id: "n", left: "50%", top: "0%" },
  { id: "ne", left: "100%", top: "0%" },
  { id: "e", left: "100%", top: "50%" },
  { id: "se", left: "100%", top: "100%" },
  { id: "s", left: "50%", top: "100%" },
  { id: "sw", left: "0%", top: "100%" },
  { id: "w", left: "0%", top: "50%" },
];

/** YOUR editor chrome for the takeover (desktop): hover outline, selection,
 *  live size, snap guides and your name tag. Positioned by the controller. */
export function TakeoverChrome() {
  return (
    <>
      <span className="me-uhover" data-me-uhover />
      <span className="me-usel" data-me-usel>
        {USER_HANDLES.map((h) => (
          <span
            key={h.id}
            className="me-handle me-handle--user"
            data-handle={h.id}
            style={{ left: h.left, top: h.top }}
          />
        ))}
        <span className="me-tag me-tag--user" data-me-udims />
      </span>
      <span className="me-snap me-snap--h" data-me-snap="h">
        <span className="me-x" style={{ left: 0 }} />
        <span className="me-x" style={{ left: "100%" }} />
      </span>
      <span className="me-snap me-snap--v" data-me-snap="v">
        <span className="me-x" style={{ top: 0, left: 0 }} />
        <span className="me-x" style={{ top: "100%", left: 0 }} />
      </span>
      <span className="me-visitor" data-me-visitor />
    </>
  );
}

/* ------------------------------ controller ------------------------------ */

const HANDLE_DIRS: Record<string, [number, number]> = {
  nw: [-1, -1],
  n: [0, -1],
  ne: [1, -1],
  e: [1, 0],
  se: [1, 1],
  s: [0, 1],
  sw: [-1, 1],
  w: [-1, 0],
};

type Rect = { l: number; t: number; r: number; b: number; w: number; h: number };
type Xf = { x: number; y: number; sx: number; sy: number };
type Target = { v: number; a: number; b: number }; // line + perpendicular extent

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const shift = (r: Rect, dx: number, dy: number): Rect => ({
  ...r,
  l: r.l + dx,
  r: r.r + dx,
  t: r.t + dy,
  b: r.b + dy,
});

/**
 * Drives everything: live size tags, Kyle's idle loop, commit/restore, and the
 * desktop takeover. Writes state as attributes on the hero section
 * (data-edit / data-guide / data-takeover) — no React re-renders.
 */
export function useMidEdit(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const offs: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(
      el: HTMLElement | Window,
      type: K,
      fn: (e: HTMLElementEventMap[K]) => void,
      opts?: AddEventListenerOptions,
    ) => {
      el.addEventListener(type, fn as EventListener, opts);
      offs.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    /* Live size tags, in design-file px (the frame's Figma width), like a real
       file: constant across viewport sizes. */
    const designK = (frame: HTMLElement) =>
      Number(frame.dataset.meFrame) / (frame.offsetWidth || 1);
    const updateDims = () => {
      root.querySelectorAll<HTMLElement>("[data-me-ghost]").forEach((ghost) => {
        const box = ghost.querySelector<HTMLElement>("[data-me-measure]");
        const tag = ghost.querySelector<HTMLElement>("[data-me-dims]");
        const frame = ghost.closest<HTMLElement>("[data-me-frame]");
        if (!box || !tag || !frame || !frame.offsetWidth) return;
        const k = designK(frame);
        tag.textContent = `${Math.round(box.offsetWidth * k)} × ${Math.round(box.offsetHeight * k)}`;
      });
    };
    updateDims();
    const ro = new ResizeObserver(() => {
      updateDims();
      render();
    });
    ro.observe(root);
    // A frame flipping hidden → shown (crossing the breakpoint) also re-measures.
    root.querySelectorAll<HTMLElement>("[data-me-frame]").forEach((f) => ro.observe(f));
    offs.push(() => ro.disconnect());

    // Takeover pieces live in the desktop frame only.
    const frame = root.querySelector<HTMLElement>('[data-me-frame="1920"]');
    const ui = frame && {
      hover: frame.querySelector<HTMLElement>("[data-me-uhover]")!,
      sel: frame.querySelector<HTMLElement>("[data-me-usel]")!,
      dims: frame.querySelector<HTMLElement>("[data-me-udims]")!,
      snapH: frame.querySelector<HTMLElement>('[data-me-snap="h"]')!,
      snapV: frame.querySelector<HTMLElement>('[data-me-snap="v"]')!,
      visitor: frame.querySelector<HTMLElement>("[data-me-visitor]")!,
    };
    let selected: Item | null = null;
    let hovered: Item | null = null;

    const measureEl = (it: Item): HTMLElement | null => {
      if (!frame) return null;
      if (it === "kyle" || it === "burgess")
        return frame.querySelector(`[data-me-ghost="${it}"] [data-me-measure]`);
      if (it === "portfolio") return frame.querySelector('[data-me-word="portfolio"]');
      return frame.querySelector("[data-me-photo-box]");
    };
    const rel = (r: DOMRect): Rect => {
      const f = frame!.getBoundingClientRect();
      return {
        l: r.left - f.left,
        t: r.top - f.top,
        r: r.right - f.left,
        b: r.bottom - f.top,
        w: r.width,
        h: r.height,
      };
    };
    const boxRect = (it: Item) => rel(measureEl(it)!.getBoundingClientRect());
    const place = (el: HTMLElement, r: Pick<Rect, "l" | "t" | "w" | "h">) => {
      el.style.left = `${r.l}px`;
      el.style.top = `${r.t}px`;
      el.style.width = `${r.w}px`;
      el.style.height = `${r.h}px`;
    };
    const show = (el: HTMLElement, v: boolean) => el.toggleAttribute("data-on", v);

    function render() {
      if (!ui || !frame?.offsetWidth) return;
      if (selected) {
        const r = boxRect(selected);
        place(ui.sel, r);
        const k = designK(frame);
        ui.dims.textContent = `${Math.round(r.w * k)} × ${Math.round(r.h * k)}`;
      }
      show(ui.sel, !!selected);
      if (hovered && hovered !== selected) place(ui.hover, boxRect(hovered));
      show(ui.hover, !!hovered && hovered !== selected);
    }

    /* ---- The photo as a layer: find Kyle's actual pixels (alpha map) so it
       can be picked like Figma does, and size its box to the cutout. ---- */
    const photoWrap = frame?.querySelector<HTMLElement>("[data-me-photo]") ?? null;
    const photoImg =
      photoWrap?.querySelector<HTMLImageElement>('[data-hero-portrait="sharp"]') ?? null;
    const photoBox = frame?.querySelector<HTMLElement>("[data-me-photo-box]") ?? null;
    let alpha: { data: Uint8ClampedArray; w: number; h: number; nw: number; nh: number } | null =
      null;
    // Layout px (untransformed, wrapper space) ↔ the image's natural px.
    const cover = () => {
      const img = photoImg!;
      const c = Math.max(img.offsetWidth / alpha!.nw, img.offsetHeight / alpha!.nh);
      return {
        c,
        ox: img.offsetLeft + (img.offsetWidth - alpha!.nw * c) / 2,
        oy: img.offsetTop + (img.offsetHeight - alpha!.nh * c) / 2,
      };
    };
    const buildAlpha = () => {
      if (!photoImg?.naturalWidth || !photoWrap || !photoBox || alpha) return;
      const w = 320;
      const h = Math.round((w * photoImg.naturalHeight) / photoImg.naturalWidth);
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(photoImg, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      alpha = { data, w, h, nw: photoImg.naturalWidth, nh: photoImg.naturalHeight };
      // Bounds of the opaque pixels → the photo's selection box (in % of the
      // wrapper, so it holds at any width) + its scale origin.
      let x0 = w, y0 = h, x1 = 0, y1 = 0;
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++)
          if (data[(y * w + x) * 4 + 3] > 40) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
      const { c, ox, oy } = cover();
      const W = photoWrap.offsetWidth;
      const H = photoWrap.offsetHeight;
      const L = clamp(ox + (x0 / w) * alpha.nw * c, 0, W);
      const T = clamp(oy + (y0 / h) * alpha.nh * c, 0, H);
      const R = clamp(ox + ((x1 + 1) / w) * alpha.nw * c, 0, W);
      const B = clamp(oy + ((y1 + 1) / h) * alpha.nh * c, 0, H);
      Object.assign(photoBox.style, {
        left: `${(L / W) * 100}%`,
        top: `${(T / H) * 100}%`,
        width: `${((R - L) / W) * 100}%`,
        height: `${((B - T) / H) * 100}%`,
      });
      root.style.setProperty("--me-iox", `${(((L + R) / 2) / W) * 100}%`);
      root.style.setProperty("--me-ioy", `${(((T + B) / 2) / H) * 100}%`);
    };
    if (photoImg) {
      if (photoImg.complete) buildAlpha();
      else on(photoImg, "load", buildAlpha);
    }

    // Reduced motion: the static mid-edit frame (sizes still filled in).
    if (reducedMotion()) {
      return () => offs.forEach((f) => f());
    }

    const readXf = (it: Item): Xf => {
      const cs = getComputedStyle(root);
      const p = PREFIX[it];
      const n = (k: string, d: number) => {
        const v = parseFloat(cs.getPropertyValue(`--me-${p}${k}`));
        return Number.isFinite(v) ? v : d;
      };
      return { x: n("x", 0), y: n("y", 0), sx: n("sx", 1), sy: n("sy", 1) };
    };
    const writeXf = (it: Item, t: Xf) => {
      const p = PREFIX[it];
      root.style.setProperty(`--me-${p}x`, `${t.x}px`);
      root.style.setProperty(`--me-${p}y`, `${t.y}px`);
      root.style.setProperty(`--me-${p}sx`, `${t.sx}`);
      root.style.setProperty(`--me-${p}sy`, `${t.sy}`);
    };
    /** Photo scale origin (frame px). */
    const photoOrigin = () => {
      const cs = getComputedStyle(root);
      return {
        x: (parseFloat(cs.getPropertyValue("--me-iox")) / 100) * frame!.offsetWidth,
        y: (parseFloat(cs.getPropertyValue("--me-ioy")) / 100) * frame!.offsetHeight,
      };
    };
    /** Is this screen point on one of Kyle's actual pixels? */
    const photoHit = (cx: number, cy: number) => {
      if (!alpha || !photoImg || !frame) return false;
      const f = frame.getBoundingClientRect();
      const t = readXf("photo");
      const o = photoOrigin();
      // Undo the photo layer's transform → wrapper px → natural px.
      const lx = (cx - f.left - o.x - t.x) / t.sx + o.x;
      const ly = (cy - f.top - o.y - t.y) / t.sy + o.y;
      const { c, ox, oy } = cover();
      const nx = (lx - ox) / c;
      const ny = (ly - oy) / c;
      if (nx < 0 || ny < 0 || nx >= alpha.nw || ny >= alpha.nh) return false;
      const ax = Math.floor((nx / alpha.nw) * alpha.w);
      const ay = Math.floor((ny / alpha.nh) * alpha.h);
      return alpha.data[(ay * alpha.w + ax) * 4 + 3] > 40;
    };

    let guideTimer: number | undefined;
    const setGuide = (s: "on" | "off" | "flash") => {
      window.clearTimeout(guideTimer);
      root.setAttribute("data-guide", s);
    };

    /* ---- Kyle's idle loop: drag off the guide, hesitate, snap back; then
       nearly fix the g… and change his mind. ---- */
    const { x: dx, y: dy } = IDLE_DRIFT_PX;
    const idle = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "power2.inOut" } });
    idle
      .call(() => setGuide("off"), [], IDLE_REST_S)
      .to(root, { "--me-bx": `${dx}px`, "--me-by": `${dy}px`, duration: 0.45 }, IDLE_REST_S)
      .to(root, { "--me-bx": `${dx * 0.55}px`, "--me-by": `${dy * 1.4}px`, duration: 0.3 }, ">+0.35")
      .to(root, { "--me-bx": "0px", "--me-by": "0px", duration: 0.14, ease: "power3.in" }, ">+0.45")
      .call(() => {
        setGuide("flash");
        root.dispatchEvent(new Event(LABEL_NEXT_EVENT)); // the filename moves on a version
      })
      .to(root, { "--me-g-drop": `${G_DROP_EM * 0.35}em`, "--me-g-rot": `${G_ROTATE_DEG * 0.35}deg`, duration: 0.4 }, ">+1.1")
      .to(root, { "--me-g-drop": `${G_DROP_EM * 1.3}em`, "--me-g-rot": `${G_ROTATE_DEG * 1.4}deg`, duration: 0.45 }, ">+0.6")
      .to(root, { "--me-g-drop": `${G_DROP_EM}em`, "--me-g-rot": `${G_ROTATE_DEG}deg`, duration: 0.35 }, ">+0.5")
      .to({}, { duration: 0.6 });

    let state: "editing" | "committed" = "editing";
    let idleReady = false;
    let inView = true;
    const resumeIdle = () => {
      if (idleReady && state === "editing" && inView) idle.play();
    };
    const startIdle = gsap.delayedCall(IDLE_START_DELAY_S, () => {
      idleReady = true;
      resumeIdle();
    });
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) resumeIdle();
      else idle.pause();
    });
    io.observe(root);
    offs.push(() => io.disconnect());

    /* ---- Takeover state (+ a frame loop that keeps your chrome glued to
       layers that change on their own, e.g. the typing label). ---- */
    let takeover = false;
    let raf = 0;
    const loop = () => {
      render();
      raf = requestAnimationFrame(loop);
    };
    const setTakeover = (v: boolean) => {
      takeover = v;
      root.setAttribute("data-takeover", v ? "on" : "off");
      cancelAnimationFrame(raf);
      if (v) raf = requestAnimationFrame(loop);
      else {
        selected = hovered = null;
        if (ui) show(ui.visitor, false);
        render();
      }
    };
    offs.push(() => cancelAnimationFrame(raf));

    /* ---- Commit: you interrupted him. ---- */
    const commit = () => {
      if (state === "committed") return;
      state = "committed";
      idle.pause();
      gsap.to(root, { "--me-bx": "0px", "--me-by": "0px", duration: 0.18, ease: "power3.out", overwrite: "auto" });
      gsap.to(root, { "--me-g-drop": "0em", "--me-g-rot": "0deg", duration: SNAP_MS / 1000, ease: "back.out(2.4)", overwrite: "auto" });
      root.setAttribute("data-edit", "committed");
      setGuide("flash");
      guideTimer = later(() => root.setAttribute("data-guide", "off"), 320);
      root.dispatchEvent(new Event(LABEL_RESET_EVENT)); // you have the file now
    };

    /* ---- Restore: Kyle takes it back. ---- */
    const isDefault = (t: Xf) => !t.x && !t.y && t.sx === 1 && t.sy === 1;
    const restore = () => {
      if (state !== "committed" || dragging) return;
      setTakeover(false);
      const moved = ITEMS.some((it) => !isDefault(readXf(it)));
      const home: Record<string, string | number> = {};
      ITEMS.forEach((it) => {
        const p = PREFIX[it];
        home[`--me-${p}x`] = "0px";
        home[`--me-${p}y`] = "0px";
        home[`--me-${p}sx`] = 1;
        home[`--me-${p}sy`] = 1;
      });
      gsap
        .timeline()
        .to(root, { ...home, duration: moved ? 0.75 : 0.01, ease: "power3.inOut", overwrite: "auto" })
        .call(() => {
          state = "editing";
          root.setAttribute("data-edit", "editing");
          setGuide("flash");
        })
        .to(root, { "--me-g-drop": `${G_DROP_EM}em`, "--me-g-rot": `${G_ROTATE_DEG}deg`, duration: 0.45, ease: "power2.inOut" }, "+=0.15")
        .call(() => {
          idle.restart();
          if (!idleReady || !inView) idle.pause();
        });
    };

    /* ---- Hover / tap ---- */
    const canTakeover = () =>
      !!frame && frame.offsetParent !== null && window.matchMedia("(pointer: fine)").matches;
    let restoreTimer: number | undefined;
    let lastPointer = "mouse";
    let dragging = false;
    on(root, "pointerdown", (e) => (lastPointer = e.pointerType), { capture: true });
    on(root, "pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      window.clearTimeout(restoreTimer);
      commit();
      if (canTakeover()) setTakeover(true);
    });
    on(root, "pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      if (ui) show(ui.visitor, false);
      if (dragging) return;
      window.clearTimeout(restoreTimer);
      restoreTimer = later(restore, RESTORE_DELAY_MS);
    });
    on(root, "click", () => {
      if (lastPointer === "mouse") return;
      window.clearTimeout(restoreTimer);
      commit();
      restoreTimer = later(restore, TAP_REVERT_MS);
    });

    /* ---- Takeover (desktop mouse) ---- */
    if (frame && ui) {
      ui.visitor.textContent = VISITOR_NAME;

      type Drag =
        | { kind: "move"; it: Item; px: number; py: number; t0: Xf; r0: Rect; xs: Target[]; ys: Target[] }
        | { kind: "resize"; it: Item; px: number; py: number; t0: Xf; r0: Rect; dir: [number, number] };
      let drag: Drag | null = null;
      let lastSnap = "";

      const select = (it: Item | null) => {
        selected = it;
        render();
      };
      const measurable = (it: Item) => {
        const el = measureEl(it);
        return !!el && el.getBoundingClientRect().width > 0;
      };
      /** Topmost layer under a point: the photo (on its pixels) sits above
       *  the words, like the real layer order. */
      const hitTest = (e: PointerEvent): Item | null => {
        if (photoHit(e.clientX, e.clientY)) return "photo";
        const t = e.target;
        const w = t instanceof Element ? t.closest<HTMLElement>("[data-me-word]") : null;
        return (w?.dataset.meWord as Item) ?? null;
      };

      const snapTo = (lines: number[], targets: Target[]) => {
        let best: { d: number; t: Target } | null = null;
        for (const l of lines)
          for (const t of targets) {
            const d = t.v - l;
            if (Math.abs(d) <= SNAP_THRESHOLD_PX && (!best || Math.abs(d) < Math.abs(best.d))) best = { d, t };
          }
        return best;
      };

      const startMove = (e: PointerEvent, it: Item) => {
        const t0 = readXf(it);
        const r0 = boxRect(it);
        const home = shift(r0, -t0.x, -t0.y);
        const fw = frame.offsetWidth;
        const fh = frame.offsetHeight;
        const xs: Target[] = [{ v: fw / 2, a: 0, b: fh }];
        const ys: Target[] = [];
        const add = (o: Rect) => {
          xs.push(...[o.l, (o.l + o.r) / 2, o.r].map((v) => ({ v, a: o.t, b: o.b })));
          ys.push(...[o.t, (o.t + o.b) / 2, o.b].map((v) => ({ v, a: o.l, b: o.r })));
        };
        add(home);
        ITEMS.filter((o) => o !== it && measurable(o)).forEach((o) => add(boxRect(o)));
        if (it !== "photo") {
          // The nose, wherever the photo layer currently is.
          const ph = readXf("photo");
          const o = photoOrigin();
          const nx = o.x + ph.sx * ((NOSE_X_PCT / 100) * fw - o.x) + ph.x;
          const ny = o.y + ph.sy * ((GUIDE_TOP_PCT / 100) * fh - o.y) + ph.y;
          ys.push({ v: ny, a: nx, b: nx });
        }
        drag = { kind: "move", it, px: e.clientX, py: e.clientY, t0, r0, xs, ys };
        dragging = true;
      };

      const startResize = (e: PointerEvent, handle: string) => {
        if (!selected) return;
        drag = {
          kind: "resize",
          it: selected,
          px: e.clientX,
          py: e.clientY,
          t0: readXf(selected),
          r0: boxRect(selected),
          dir: HANDLE_DIRS[handle],
        };
        dragging = true;
      };

      const showSnap = (el: HTMLElement, key: string, r: Pick<Rect, "l" | "t" | "w" | "h"> | null) => {
        if (!r) return show(el, false);
        place(el, r);
        show(el, true);
        if (key !== lastSnap) {
          el.removeAttribute("data-flash");
          void el.offsetWidth; // restart the flash
          el.setAttribute("data-flash", "");
        }
      };

      const onMove = (e: PointerEvent) => {
        // Your name tag follows your cursor while you have the file.
        if (takeover) {
          const f = frame.getBoundingClientRect();
          ui.visitor.style.transform = `translate(${e.clientX - f.left}px, ${e.clientY - f.top}px)`;
          const inside =
            e.clientX >= f.left && e.clientX <= f.right && e.clientY >= f.top && e.clientY <= f.bottom;
          show(ui.visitor, inside);
          if (!drag) {
            const h = inside ? hitTest(e) : null;
            if (h !== hovered) {
              hovered = h;
              render();
            }
          }
        }
        if (!drag) return;
        const { t0, r0 } = drag;
        if (drag.kind === "move") {
          let mx = e.clientX - drag.px;
          let my = e.clientY - drag.py;
          const r = shift(r0, mx, my);
          const sx = snapTo([r.l, (r.l + r.r) / 2, r.r], drag.xs);
          const sy = snapTo([r.t, (r.t + r.b) / 2, r.b], drag.ys);
          if (sx) mx += sx.d;
          if (sy) my += sy.d;
          // Keep the layer's centre on the hero.
          const c = shift(r0, mx, my);
          const cx = clamp((c.l + c.r) / 2, 0, frame.offsetWidth);
          const cy = clamp((c.t + c.b) / 2, 0, frame.offsetHeight);
          mx += cx - (c.l + c.r) / 2;
          my += cy - (c.t + c.b) / 2;
          writeXf(drag.it, { ...t0, x: t0.x + mx, y: t0.y + my });
          const f = shift(r0, mx, my);
          let key = "";
          if (sy) {
            const a = Math.min(sy.t.a, f.l);
            showSnap(ui.snapH, (key += `h${sy.t.v}`), { l: a, t: sy.t.v, w: Math.max(sy.t.b, f.r) - a, h: 1 });
          } else show(ui.snapH, false);
          if (sx) {
            const a = Math.min(sx.t.a, f.t);
            showSnap(ui.snapV, (key += `v${sx.t.v}`), { l: sx.t.v, t: a, w: 1, h: Math.max(sx.t.b, f.b) - a });
          } else show(ui.snapV, false);
          lastSnap = key;
        } else {
          const [ddx, ddy] = drag.dir;
          const w0 = r0.w / t0.sx;
          const h0 = r0.h / t0.sy;
          const W = r0.w + ddx * (e.clientX - drag.px);
          const H = r0.h + ddy * (e.clientY - drag.py);
          let sx = t0.sx;
          let sy = t0.sy;
          if (ddx && ddy) {
            // Corners scale proportionally (Figma's K tool).
            const k = Math.abs(W / r0.w - 1) > Math.abs(H / r0.h - 1) ? W / r0.w : H / r0.h;
            const kk = clamp(k, MIN_SCALE / Math.min(t0.sx, t0.sy), MAX_SCALE / Math.max(t0.sx, t0.sy));
            sx = t0.sx * kk;
            sy = t0.sy * kk;
          } else if (ddx) sx = clamp(W / w0, MIN_SCALE, MAX_SCALE);
          else sy = clamp(H / h0, MIN_SCALE, MAX_SCALE);
          // Pin the opposite edge/corner (relative to the layer's own centre).
          writeXf(drag.it, {
            sx,
            sy,
            x: t0.x + (ddx * (w0 * (sx - t0.sx))) / 2,
            y: t0.y + (ddy * (h0 * (sy - t0.sy))) / 2,
          });
        }
        render();
      };

      const onUp = (e: PointerEvent) => {
        if (!drag) return;
        drag = null;
        dragging = false;
        lastSnap = "";
        show(ui.snapH, false);
        show(ui.snapV, false);
        const r = root.getBoundingClientRect();
        const outside =
          e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        if (outside) restoreTimer = later(restore, RESTORE_DELAY_MS);
      };

      on(frame, "pointerdown", (e) => {
        if (!takeover || e.button !== 0 || !(e.target instanceof Element)) return;
        const tgt = e.target;
        const handle = tgt.closest<HTMLElement>("[data-handle]")?.dataset.handle;
        if (handle && selected) {
          e.preventDefault();
          return startResize(e, handle);
        }
        // Inside the current selection's bounds → drag the selection.
        if (tgt.closest("[data-me-usel]") && selected) {
          e.preventDefault();
          return startMove(e, selected);
        }
        const hit = hitTest(e);
        if (hit) {
          e.preventDefault();
          select(hit);
          startMove(e, hit);
        } else select(null);
      });
      on(window, "pointermove", onMove);
      on(window, "pointerup", onUp);
      on(window, "keydown", (e) => {
        if (!takeover || !selected) return;
        if (e.key === "Escape") return select(null);
        const step = e.shiftKey ? 10 : 1;
        const delta: Record<string, [number, number]> = {
          ArrowLeft: [-step, 0],
          ArrowRight: [step, 0],
          ArrowUp: [0, -step],
          ArrowDown: [0, step],
        };
        const m = delta[e.key];
        if (!m) return;
        e.preventDefault();
        const t = readXf(selected);
        writeXf(selected, { ...t, x: t.x + m[0], y: t.y + m[1] });
        render();
      });
    }

    return () => {
      offs.forEach((f) => f());
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(restoreTimer);
      window.clearTimeout(guideTimer);
      startIdle.kill();
      idle.kill();
      gsap.killTweensOf(root);
    };
  }, [rootRef]);
}

/* ------------------------------ label gag ------------------------------- */

/**
 * The "portfolio" label. It sits still until Kyle edits: each time he snaps
 * "Burgess" back onto the guide (LABEL_NEXT_EVENT) it backspaces to the shared
 * prefix and types the next version, caret blinking while it's being edited;
 * when you take over (LABEL_RESET_EVENT) it types back to plain "portfolio".
 * Anchored on the left, grows right; versions that wouldn't fit before the
 * hero's edge are skipped. Static under reduced motion (Kyle doesn't edit).
 */
export function PortfolioLabel() {
  const [text, setText] = useState(LABEL_VARIANTS[0]);
  const [caret, setCaret] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    const measure = measureRef.current;
    const hero = el?.closest("section");
    if (!el || !measure || !hero || reducedMotion()) return;

    let alive = true;
    let busy = false;
    let idx = 0;
    let current = LABEL_VARIANTS[0];
    let target = current;
    let timer: number | undefined;
    let caretTimer: number | undefined;
    const sleep = (ms: number) =>
      new Promise<void>((r) => (timer = window.setTimeout(r, ms)));

    const fits = (s: string) => {
      if (el.offsetParent === null) return false; // the hidden layout
      measure.textContent = s;
      const right = el.getBoundingClientRect().left + measure.offsetWidth;
      measure.textContent = "";
      return right <= hero.getBoundingClientRect().right - LABEL_EDGE_MARGIN_PX;
    };

    // Type from the current filename to the latest target (a newer target
    // arriving mid-edit is picked up when the current one finishes).
    const run = async () => {
      if (busy) return;
      busy = true;
      window.clearTimeout(caretTimer);
      setCaret(true);
      while (alive && current !== target) {
        const goal = target;
        let p = 0; // shared prefix
        while (p < current.length && p < goal.length && current[p] === goal[p]) p++;
        for (let n = current.length - 1; n >= p && alive; n--) {
          setText(current.slice(0, n));
          await sleep(LABEL_TYPE_MS);
        }
        for (let n = p + 1; n <= goal.length && alive; n++) {
          setText(goal.slice(0, n));
          await sleep(LABEL_TYPE_MS);
        }
        current = goal;
      }
      busy = false;
      if (alive) caretTimer = window.setTimeout(() => setCaret(false), LABEL_CARET_LINGER_MS);
    };

    const onNext = () => {
      let next = (idx + 1) % LABEL_VARIANTS.length;
      while (next !== 0 && !fits(LABEL_VARIANTS[next])) {
        next = (next + 1) % LABEL_VARIANTS.length;
      }
      idx = next;
      target = LABEL_VARIANTS[next];
      run();
    };
    const onReset = () => {
      idx = 0;
      target = LABEL_VARIANTS[0];
      run();
    };
    hero.addEventListener(LABEL_NEXT_EVENT, onNext);
    hero.addEventListener(LABEL_RESET_EVENT, onReset);

    return () => {
      alive = false;
      window.clearTimeout(timer);
      window.clearTimeout(caretTimer);
      hero.removeEventListener(LABEL_NEXT_EVENT, onNext);
      hero.removeEventListener(LABEL_RESET_EVENT, onReset);
    };
  }, []);

  return (
    <span className="relative whitespace-nowrap">
      <span ref={textRef}>{text}</span>
      {caret && <span className="me-caret" />}
      <span
        ref={measureRef}
        className="pointer-events-none invisible absolute left-0 top-0"
      />
    </span>
  );
}
