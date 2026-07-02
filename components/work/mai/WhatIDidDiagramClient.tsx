"use client";

import { useEffect, useRef } from "react";

/**
 * Animates the exact Figma "What I did" diagram (inlined SVG — artwork untouched)
 * as it scrolls into view:
 *   1. the "Me" tag grows/pops in from its position
 *   2. the four dashed lines grow outward along their paths from Me (revealed by
 *      a clip-circle expanding from Me's centre)
 *   3. each role tag pops in the moment its line reaches it
 * Scroll-scrubbed (reverses on scroll up); static on reduced-motion.
 */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const C1 = 1.70158;
const C3 = C1 + 1;
const easeOutBack = (t: number) =>
  1 + C3 * Math.pow(t - 1, 3) + C1 * Math.pow(t - 1, 2);

const BUBBLE_IDS = [
  "Comment cursor",
  "Comment cursor_2",
  "Comment cursor_3",
  "Comment cursor_4",
];
const LINE_IDS = ["Vector 4", "Vector 5", "Vector 6", "Vector 7"];
const SVG_NS = "http://www.w3.org/2000/svg";

export default function WhatIDidDiagramClient({
  svg,
  className = "",
}: {
  svg: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const svgEl = root.querySelector("svg");
    if (!svgEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Runs the whole setup; returns a teardown, or null if this copy is hidden
    // (display:none → getBBox is empty). Re-run on resize so whichever of the
    // desktop/mobile copies is visible always animates.
    const setup = (): (() => void) | null => {
    const me = svgEl.querySelector<SVGGraphicsElement>('[id="Group 10"]');
    const bubbles = BUBBLE_IDS.map((id) =>
      svgEl.querySelector<SVGGraphicsElement>(`[id="${id}"]`),
    );
    const lines = LINE_IDS.map((id) =>
      svgEl.querySelector<SVGElement>(`[id="${id}"]`),
    );
    if (!me || bubbles.some((b) => !b) || lines.some((l) => !l)) return null;

    // No transforms in the SVG, so getBBox() is already in viewBox coordinates.
    let meBox: DOMRect;
    try {
      meBox = me.getBBox();
    } catch {
      return null;
    }
    if (!meBox.width) return null; // hidden copy — skip

    const center = (el: SVGGraphicsElement) => {
      const b = el.getBBox();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    };
    const meC = center(me);
    const dists = bubbles.map((b) => {
      const c = center(b!);
      return Math.hypot(c.x - meC.x, c.y - meC.y);
    });
    const POP = 55; // radius window over which a tag pops once its line arrives
    const rMax = Math.max(...dists) + POP + 12;

    // Clip the lines with a circle that expands from Me → reveals them outward.
    // Unique id + full teardown so React StrictMode's double-mount can't leave a
    // stale duplicate clipPath behind.
    const clipId = `wid-reveal-${Math.random().toString(36).slice(2)}`;
    let defs = svgEl.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS(SVG_NS, "defs");
      svgEl.insertBefore(defs, svgEl.firstChild);
    }
    const clip = document.createElementNS(SVG_NS, "clipPath");
    clip.setAttribute("id", clipId);
    clip.setAttribute("clipPathUnits", "userSpaceOnUse");
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", String(meC.x));
    circle.setAttribute("cy", String(meC.y));
    circle.setAttribute("r", "0");
    clip.appendChild(circle);
    defs.appendChild(clip);
    lines.forEach((l) => l!.setAttribute("clip-path", `url(#${clipId})`));

    const prep = (el: SVGGraphicsElement) => {
      el.style.transformBox = "fill-box";
      el.style.transformOrigin = "center";
      el.style.willChange = "transform, opacity";
    };
    prep(me);
    bubbles.forEach((b) => prep(b!));

    let raf = 0;
    let running = true;
    const update = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Start later (block well into view) and spread over more scroll so the
      // sequence isn't over too early/fast: p=0 when the block top is ~71% down
      // the viewport, reaching 1 over ~1.15 viewport-heights of scroll.
      const p = clamp((0.71 * vh - rect.top) / (1.15 * vh), 0, 1);

      // 1. Me grows/pops in
      const pm = clamp(p / 0.18, 0, 1);
      const em = easeOutBack(pm);
      me.style.transform = `scale(${(0.3 + 0.7 * em).toFixed(3)})`;
      me.style.opacity = clamp(pm * 1.6, 0, 1).toFixed(3);

      // 2. lines grow outward from Me
      const pr = clamp((p - 0.15) / 0.57, 0, 1);
      const r = rMax * easeOut(pr);
      circle.setAttribute("r", r.toFixed(1));

      // 3. each tag pops as its line reaches it
      bubbles.forEach((b, i) => {
        const pb = clamp((r - dists[i]) / POP, 0, 1);
        const eb = easeOutBack(pb);
        b!.style.transform = `scale(${(0.3 + 0.7 * eb).toFixed(3)})`;
        b!.style.opacity = clamp(pb * 1.6, 0, 1).toFixed(3);
      });

      if (running) raf = requestAnimationFrame(update);
    };
    update();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clip.remove();
      lines.forEach((l) => l!.removeAttribute("clip-path"));
      [me, ...bubbles].forEach((el) => {
        el!.style.transform = "";
        el!.style.opacity = "";
        el!.style.willChange = "";
      });
    };
    };

    let teardown = setup();
    const reinit = () => {
      teardown?.();
      teardown = setup();
    };
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(reinit, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      teardown?.();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`[&>svg]:h-auto [&>svg]:w-full ${className}`}
      role="img"
      aria-label="Kyle at the centre coordinating product managers, designers, web developers and copywriters"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
