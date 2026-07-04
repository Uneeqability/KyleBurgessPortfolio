"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Presentation & Narrative Design — a stack of slides that shuffle: the front
 * card fades out, drops to the back, the rest slide forward, forever. Ported
 * from the Figma Make prototype (Card Shuffle Animation) to plain CSS
 * transitions so it needs no animation dependency.
 *
 * Positions are percentages of a 757×600 stage so the whole stack scales with
 * the card.
 */

const SLIDES = [0, 1, 2, 3, 4].map((i) => `/images/slides/slide-${i}.png`);

type Pos = {
  left: string;
  top: string;
  width: string;
  height: string;
  rotate: number;
  radius: string;
  shadow: string;
};

// slot 0 = back, slot 4 = front
const POSITIONS: Pos[] = [
  { left: "9.98%", top: "0%", width: "76.4%", height: "54.2%", rotate: -8.2, radius: "2.3%", shadow: "5px 5px 11px rgba(0,0,0,0.2)" },
  { left: "7.53%", top: "5.6%", width: "81.5%", height: "57.9%", rotate: -6.27, radius: "2.2%", shadow: "5px 5px 11px rgba(0,0,0,0.3)" },
  { left: "4.89%", top: "12%", width: "87%", height: "61.7%", rotate: -4.7, radius: "2.1%", shadow: "5px 5px 11px rgba(0,0,0,0.3)" },
  { left: "2.39%", top: "18.5%", width: "93.1%", height: "66.1%", rotate: -3.05, radius: "2%", shadow: "5px 5px 11px rgba(0,0,0,0.3)" },
  { left: "0%", top: "29.1%", width: "100%", height: "70.9%", rotate: 0, radius: "3.3%", shadow: "8px 8px 16px rgba(0,0,0,0.2)" },
];

const HOLD_MS = 3200;
const FADE_MS = 220;
// Shuffle vs. entrance ("deal out" from the collapsed stack) timings.
const SHUFFLE_DUR = "0.75s";
const SHUFFLE_EASE = "cubic-bezier(0.4,0,0.2,1)";
const ENTER_DUR = "1.15s";
const ENTER_EASE = "cubic-bezier(0.22,1,0.36,1)";
const COLLAPSED: Pos = { ...POSITIONS[4], rotate: 0 };

export default function CardShuffle({ intro = false }: { intro?: boolean }) {
  const [stackOrder, setStackOrder] = useState([0, 1, 2, 3, 4]);
  const [hiddenImg, setHiddenImg] = useState<number | null>(null);
  const [entered, setEntered] = useState(!intro);
  const latest = useRef<() => void>(() => {});

  const shuffle = useCallback(() => {
    const front = stackOrder[4];
    setHiddenImg(front); // fade out the front card
    setTimeout(() => {
      setStackOrder((prev) => [prev[4], prev[0], prev[1], prev[2], prev[3]]);
      setTimeout(() => setHiddenImg(null), 80); // fade back in at the back
    }, FADE_MS + 30);
  }, [stackOrder]);

  useEffect(() => {
    latest.current = shuffle;
  }, [shuffle]);

  // Fan open on mount (after the collapsed state paints once). Respects reduced motion.
  useEffect(() => {
    if (!intro) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEntered(true);
      return;
    }
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntered(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [intro]);

  useEffect(() => {
    const id = setInterval(() => latest.current(), HOLD_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full" style={{ aspectRatio: "757 / 600" }}>
      {SLIDES.map((src, imgIdx) => {
        const slot = stackOrder.indexOf(imgIdx);
        const pos = entered ? POSITIONS[slot] : COLLAPSED;
        const isHidden = imgIdx === hiddenImg;
        // During the fan-open use the slower entrance easing; normal SLIDE after.
        // Longhand (not the `transition` shorthand) so re-renders don't trip React's
        // shorthand/longhand style warning.
        const dur = entered ? SHUFFLE_DUR : ENTER_DUR;
        const ease = entered ? SHUFFLE_EASE : ENTER_EASE;
        const opDur = isHidden ? `${FADE_MS / 1000}s` : "0.3s";
        return (
          <div
            key={imgIdx}
            style={{
              position: "absolute",
              left: pos.left,
              top: pos.top,
              width: pos.width,
              height: pos.height,
              transform: `rotate(${pos.rotate}deg)`,
              borderRadius: pos.radius,
              opacity: isHidden ? 0 : 1,
              zIndex: slot,
              boxShadow: pos.shadow,
              overflow: "hidden",
              transitionProperty:
                "left, top, width, height, transform, border-radius, opacity",
              transitionDuration: `${dur}, ${dur}, ${dur}, ${dur}, ${dur}, ${dur}, ${opDur}`,
              transitionTimingFunction: `${ease}, ${ease}, ${ease}, ${ease}, ${ease}, ${ease}, ease-in-out`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              aria-hidden
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
