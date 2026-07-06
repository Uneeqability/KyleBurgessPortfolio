"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A production-reel video. Autoplays muted while in view (lazy — only loads and
 * plays once scrolled to, pauses when out of view), loops, and exposes two
 * controls: restart (⟲) and mute toggle. Default state is muted autoplay, so the
 * visitor can restart a clip and unmute it to actually hear it.
 *
 * `sources` (webm + HEVC/mp4) is used for the transparent header; a plain `src`
 * covers the project clips. `controls={false}` hides the buttons (header).
 */
type Src = { src: string; type: string };

export default function ProdVideo({
  src,
  sources,
  className = "size-full object-cover",
  poster,
  controls = true,
  loop = true,
}: {
  src?: string;
  sources?: Src[];
  className?: string;
  poster?: string;
  controls?: boolean;
  loop?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const restart = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };
  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <div className="group relative size-full">
      <video
        ref={ref}
        className={className}
        poster={poster}
        muted
        loop={loop}
        playsInline
        preload="metadata"
      >
        {sources
          ? sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)
          : src && <source src={src} type="video/mp4" />}
      </video>

      {controls && (
        <div className="absolute bottom-[4%] right-[4%] flex items-center gap-[0.5vw] opacity-70 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={restart}
            aria-label="Restart video"
            className="flex size-[2vw] max-h-[38px] min-h-[30px] min-w-[30px] max-w-[38px] items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform hover:scale-110"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-1/2">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="flex size-[2vw] max-h-[38px] min-h-[30px] min-w-[30px] max-w-[38px] items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform hover:scale-110"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="size-1/2">
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
      )}
    </div>
  );
}
