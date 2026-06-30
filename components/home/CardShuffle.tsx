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
const SLIDE = "0.75s cubic-bezier(0.4,0,0.2,1)";

export default function CardShuffle() {
  const [stackOrder, setStackOrder] = useState([0, 1, 2, 3, 4]);
  const [hiddenImg, setHiddenImg] = useState<number | null>(null);
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

  useEffect(() => {
    const id = setInterval(() => latest.current(), HOLD_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full" style={{ aspectRatio: "757 / 600" }}>
      {SLIDES.map((src, imgIdx) => {
        const slot = stackOrder.indexOf(imgIdx);
        const pos = POSITIONS[slot];
        const isHidden = imgIdx === hiddenImg;
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
              transition: `left ${SLIDE}, top ${SLIDE}, width ${SLIDE}, height ${SLIDE}, transform ${SLIDE}, border-radius ${SLIDE}, opacity ${
                isHidden ? FADE_MS / 1000 : 0.3
              }s ease-in-out`,
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
