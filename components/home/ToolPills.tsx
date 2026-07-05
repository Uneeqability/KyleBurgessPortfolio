"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const TOOLS: { label: string; icon: string }[] = [
  { label: "Figma", icon: "figma" },
  { label: "Photoshop", icon: "photoshop" },
  { label: "Final Cut", icon: "finalcut" },
  { label: "After Effects", icon: "aftereffects" },
  { label: "Wordpress", icon: "wordpress" },
  { label: "Framer", icon: "framer" },
  { label: "VSCode", icon: "vscode" },
  { label: "Github", icon: "github" },
  { label: "Antigravity", icon: "antigravity" },
  { label: "Codex", icon: "codex" },
  { label: "Claude Code", icon: "claudecode" },
  { label: "Vercel", icon: "vercel" },
  { label: "Suno", icon: "suno" },
  { label: "Kling", icon: "kling" },
  { label: "Midjourney", icon: "midjourney" },
  { label: "Lovable", icon: "lovable" },
];

/**
 * The "My Full Range" tool pills. When the card scrolls into view each pill
 * drops into place — from just above its slot with a tiny random tilt, settling
 * with a back-ease bounce — cascading left-to-right in reading (DOM) order.
 */
export default function ToolPills() {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pills = Array.from(el.children);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(pills, { opacity: 1 });
      return;
    }

    gsap.set(pills, {
      opacity: 0,
      y: -18,
      rotate: () => gsap.utils.random(-4, 4),
    });

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(pills, {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.04,
          clearProps: "all",
        });
        obs.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <ul
      ref={ref}
      className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2.5"
    >
      {TOOLS.map((tool) => (
        <li
          key={tool.label}
          className="flex items-center gap-2 rounded-full border-2 border-espresso px-3.5 py-1.5 font-mono text-sm font-medium tracking-tight text-espresso"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/tools/${tool.icon}.svg`}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="size-[18px] shrink-0"
          />
          {tool.label}
        </li>
      ))}
    </ul>
  );
}
