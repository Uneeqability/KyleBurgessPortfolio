"use client";

import Link from "next/link";
import { useRef } from "react";

/**
 * A project card on the /work index (Figma frame 2147265594 etc.): a #FFF9F2
 * card holding a tinted image area (with layered mockups passed as children —
 * kept as separate layers for animation, never flattened) plus title +
 * description. Internal sizing uses container-query units so the card scales in
 * the desktop grid and full-width on mobile.
 *
 * On hover the card tilts toward the cursor as if its weight pressed the card
 * down at that point — the edge under the cursor sinks away. The transform is
 * written inline on mousemove and eased back on leave; the transition gives the
 * lean a heavy, trailing settle. Disabled under prefers-reduced-motion.
 */
const MAX_TILT = 7; // degrees at the card's edges
const FLAT = "perspective(1100px) rotateX(0deg) rotateY(0deg)";

export default function WorkCard({
  href,
  title,
  description,
  tint,
  children,
}: {
  href: string;
  title: string;
  description: string;
  /** CSS background of the image area (tint colour) */
  tint?: string;
  /** the layered image content of the image area */
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 (left) .. 0.5 (right)
    const py = (e.clientY - r.top) / r.height - 0.5; // -0.5 (top) .. 0.5 (bottom)
    // The edge under the cursor sinks away: top cursor → top recedes, etc.
    const rx = (-py * 2 * MAX_TILT).toFixed(2);
    const ry = (px * 2 * MAX_TILT).toFixed(2);
    el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = FLAT;
  };

  return (
    <Link
      ref={ref}
      href={href}
      aria-label={title}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: FLAT,
        transformStyle: "preserve-3d",
        transition:
          "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.32s ease",
        willChange: "transform",
      }}
      className="group relative block aspect-[690/783] overflow-hidden rounded-[10px] bg-[#FFF9F2] shadow-[8px_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[16px_24px_48px_rgba(0,0,0,0.18)] [container-type:inline-size]"
    >
      {/* Image area — tint + layered mockups */}
      <div
        className="absolute left-[2.17%] top-[2.43%] h-[67.18%] w-[95.65%] overflow-hidden rounded-[8px]"
        style={tint ? { background: tint } : undefined}
      >
        {children}
      </div>

      <h3 className="absolute left-[6.23%] top-[72.8%] font-serif text-[5.07cqw] font-normal leading-[1.45] text-[#3B230E]">
        {title}
      </h3>
      <p className="absolute left-[6.23%] top-[84.5%] w-[81.9%] font-roboto text-[2.9cqw] leading-[1.45] text-[#72675B]">
        {description}
      </p>
    </Link>
  );
}
