"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

/**
 * The challenge-card phones (Figma 601:2169). Left phone = the "old way":
 * gradient wallpaper with the chat bubbles, arrow and "end of love story"
 * script. Right phone = the twain answer screen behind the white iPhone frame.
 *
 * While in view the left phone plays a slow, LOOPING "chat" progression: blank →
 * "hey" → "hey whats up?" → "u up?" → the scribble circles the 2:13am timestamp
 * → "end of love story" → the arrow draws up toward the bubbles → hold → repeat.
 * The circle/arrow are filled SVGs, so they "draw" via animated masks (conic
 * sweep + linear wipe). Respects prefers-reduced-motion (shows the full state).
 */
const DURATIONS = [900, 1100, 1100, 1100, 1300, 1200, 1500, 2400]; // per phase, ms

export default function ChallengePhones() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setPhase(7);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => setInView(entries[0].isIntersecting),
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !inView) return;
    let p = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setPhase(p);
      timer = setTimeout(() => {
        p = (p + 1) % DURATIONS.length;
        tick();
      }, DURATIONS[p]);
    };
    tick();
    return () => clearTimeout(timer);
  }, [inView, reduced]);

  // bubbles: pop (scale + fade) once their phase is reached
  const pop = (min: number) => ({
    opacity: phase >= min ? 1 : 0,
    transform: phase >= min ? "none" : "scale(0.82)",
  });

  return (
    <div ref={ref} className="absolute inset-0">
      {/* ---- Left phone: gradient wallpaper base ---- */}
      <img
        src="/images/twain/challenge-left-phone.png"
        alt=""
        aria-hidden
        className="absolute left-[45.18%] top-[6.37%] h-[88.14%] w-[22.27%] object-contain"
      />

      {/* hey chat ("hey / 3w ago") */}
      <div
        className="absolute left-[48.36%] top-[22.81%] h-[12.91%] w-[17.44%] origin-bottom-left overflow-hidden transition-[transform,opacity] duration-[420ms] ease-out"
        style={pop(1)}
      >
        <img
          src="/images/twain/bubble-heychat.png"
          alt=""
          aria-hidden
          className="absolute left-[-74.28%] top-[-59.22%] h-[360%] w-[248.56%] max-w-none"
        />
      </div>
      {/* hey whats up ("hey whats up? / 2w ago") */}
      <div
        className="absolute left-[47.58%] top-[32.68%] h-[10.05%] w-[14.95%] origin-bottom-left overflow-hidden transition-[transform,opacity] duration-[420ms] ease-out"
        style={pop(2)}
      >
        <img
          src="/images/twain/bubble-heywhatsup.png"
          alt=""
          aria-hidden
          className="absolute left-[-82.96%] top-[-167.25%] h-[462.47%] w-[289.91%] max-w-none"
        />
      </div>
      {/* u up ("u up? / 2:13am") */}
      <div
        className="absolute left-[49.67%] top-[41.52%] h-[8.94%] w-[14.81%] origin-bottom-left overflow-hidden transition-[transform,opacity] duration-[420ms] ease-out"
        style={pop(3)}
      >
        <img
          src="/images/twain/bubble-uup.png"
          alt=""
          aria-hidden
          className="absolute left-[-95.26%] top-[-274.79%] h-[520.11%] w-[292.76%] max-w-none"
        />
      </div>
      {/* scribble circling the 2:13am timestamp (conic-sweep "draw") */}
      <img
        src="/images/twain/challenge-vector2.svg"
        alt=""
        aria-hidden
        className="absolute left-[58.95%] top-[45.09%] h-[3.95%] w-[3.66%]"
        style={
          {
            opacity: phase >= 4 ? 1 : 0,
            "--draw-angle": phase >= 4 ? "375deg" : "0deg",
            WebkitMaskImage:
              "conic-gradient(from -95deg, #000 var(--draw-angle), transparent var(--draw-angle))",
            maskImage:
              "conic-gradient(from -95deg, #000 var(--draw-angle), transparent var(--draw-angle))",
            transition: "opacity 300ms ease-out, --draw-angle 1000ms ease-in-out",
          } as React.CSSProperties
        }
      />
      {/* "end of love story." script */}
      <p
        className="absolute left-[54.6%] top-[57.72%] w-[9.28%] text-[1.217vw] leading-none text-[#373228] transition-[transform,opacity] duration-[500ms] ease-out [font-family:var(--font-loved)]"
        style={{
          opacity: phase >= 5 ? 1 : 0,
          transform: phase >= 5 ? "none" : "translateY(0.4vw)",
        }}
      >
        end of love story.
      </p>
      {/* curved arrow from the sign-off up to the bubbles (linear-wipe "draw") */}
      <div className="absolute left-[50.31%] top-[50.27%] flex h-[11.52%] w-[5.95%] items-center justify-center">
        <div className="-scale-y-100 rotate-[-143.36deg]">
          <div className="relative h-[3.28vw] w-[3.02vw]">
            <div className="absolute inset-[-0.6%_-4.02%_-0.6%_-0.39%]">
              <img
                src="/images/twain/challenge-arrow.svg"
                alt=""
                aria-hidden
                className="block size-full max-w-none"
                style={
                  {
                    opacity: phase >= 6 ? 1 : 0,
                    "--draw-pct": phase >= 6 ? "100%" : "0%",
                    WebkitMaskImage:
                      "linear-gradient(35deg, #000 var(--draw-pct), transparent var(--draw-pct))",
                    maskImage:
                      "linear-gradient(35deg, #000 var(--draw-pct), transparent var(--draw-pct))",
                    transition: "opacity 250ms ease-out, --draw-pct 1100ms ease-out",
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---- Right phone: answer screen behind the white frame ---- */}
      <div className="absolute left-[68.91%] top-[6.37%] h-[88.13%] w-[22.27%] drop-shadow-[0.52vw_0.52vw_0.39vw_rgba(0,0,0,0.1)]">
        <div className="absolute inset-y-[1.55%] left-1/2 aspect-[402/874] -translate-x-1/2 overflow-hidden rounded-[8%]">
          <img
            src="/images/twain/challenge-screen.png"
            alt="Twain answer screen — Chemistry doesn't live in a chat box"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/twain/iphone-white-frame.png"
            alt=""
            aria-hidden
            className="absolute left-[-1.53%] top-[-0.96%] h-[101.92%] w-[103.05%] max-w-none"
          />
        </div>
      </div>
    </div>
  );
}
