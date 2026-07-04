"use client";

import { useEffect, useRef } from "react";

/**
 * A single deck block's media card. Each slide image is its own layer so it can
 * animate independently:
 *   • Reveal — desktop slides "depth pop" (scale + 3D tilt) staggered by z-order
 *     as the card scrolls into view; mobile slides do a plain fade + rise.
 *   • Ambient — on desktop, hovering a slide tilts it toward the cursor as if the
 *     cursor's weight pressed that corner in (the edge under the pointer sinks
 *     away). The eased transition gives the lean a heavy, trailing settle. This
 *     is the same tilt the /work cards use, applied per individual slide.
 *
 * The reveal transform lives on the inner .deck-slide; the tilt on the outer
 * wrapper — so the two never overwrite each other's transform.
 */

const P = "/images/presentation";

type Slot = { file: string; left: string; top: string; w: string; h: string; r: string };

const MAX_TILT = 8; // degrees at a slide's edges
const FLAT = "perspective(700px) rotateX(0deg) rotateY(0deg)";

export default function DeckCard({
  slug,
  layout,
  mobile = false,
}: {
  slug: string;
  layout: Slot[];
  mobile?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Reveal: add .is-in to each slide once the card enters view (staggered via CSS delay).
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const slides = card.querySelectorAll<HTMLElement>("[data-deck-slide]");
    const reveal = () => slides.forEach((s) => s.classList.add("is-in"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          reveal();
          obs.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(card);
    return () => obs.disconnect();
  }, []);

  // Tilt: the edge under the cursor sinks away, the rest of the slide reacts.
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mobile) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 (left) … 0.5 (right)
    const py = (e.clientY - r.top) / r.height - 0.5; // -0.5 (top) … 0.5 (bottom)
    const rx = (-py * 2 * MAX_TILT).toFixed(2); // top cursor → top recedes
    const ry = (px * 2 * MAX_TILT).toFixed(2);
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = FLAT;
  };

  return (
    <div
      ref={cardRef}
      className={`relative aspect-[1412/739] w-full overflow-hidden bg-[#EFE2D1] ${
        mobile ? "rounded-2xl" : "rounded-[0.86vw]"
      }`}
    >
      {layout.map((s, i) => (
        <div
          key={i}
          onMouseMove={mobile ? undefined : handleMove}
          onMouseLeave={mobile ? undefined : handleLeave}
          className="absolute"
          style={{
            left: s.left,
            top: s.top,
            width: s.w,
            height: s.h,
            ...(mobile
              ? {}
              : {
                  perspective: "700px", // gives the inner reveal its 3D
                  transformStyle: "preserve-3d",
                  transform: FLAT,
                  willChange: "transform",
                  // eased follow gives the tilt "weight" — it settles rather than snapping
                  transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                }),
          }}
        >
          <div
            data-deck-slide={i}
            className={`size-full overflow-hidden ${mobile ? "deck-slide-m" : "deck-slide"}`}
            style={
              {
                borderRadius: mobile ? "1.5vw" : s.r,
                boxShadow: mobile
                  ? "1vw 1vw 2vw rgba(0,0,0,0.2)"
                  : "0.24vw 0.24vw 0.5vw rgba(0,0,0,0.22)",
                // stagger via custom prop → CSS transition-delay (no shorthand clash)
                "--deck-delay": `${i * (mobile ? 55 : 85)}ms`,
              } as React.CSSProperties
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${P}/${slug}/${s.file}`}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
