"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero keynote video. It autoplays muted (so it reliably starts) and loops,
 * with a sound on/off toggle so the visitor can choose to hear it. Only the
 * visible instance (mobile vs desktop hero) autoplays — a display:none copy has
 * a null offsetParent, so it's skipped to avoid a hidden video buffering.
 */
export default function BuildHeroVideo({
  className = "",
  poster,
  buttonSize = "2.5vw",
}: {
  className?: string;
  poster: string;
  buttonSize?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v || v.offsetParent === null) return;
    v.play().catch(() => {});
  }, []);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (!next) v.play().catch(() => {}); // resume in case it was paused
  };

  return (
    <div className="relative size-full">
      <video
        ref={ref}
        className={className}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/videos/build-hero.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Unmute keynote video" : "Mute keynote video"}
        className="absolute right-[3%] top-[6%] flex items-center justify-center rounded-full bg-black/45 text-white shadow-[0_0.15vw_0.6vw_rgba(0,0,0,0.35)] backdrop-blur-sm transition-transform hover:scale-105"
        style={{ width: buttonSize, height: buttonSize }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-1/2 w-1/2">
          <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
          {muted ? (
            <path d="m22 9-6 6M16 9l6 6" />
          ) : (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 6a9 9 0 0 1 0 12" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
