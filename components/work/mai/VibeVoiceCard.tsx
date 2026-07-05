"use client";

import { useRef, useState } from "react";

/**
 * "Vibe Code" row 1, right card (Figma frame 586:1273) — kept as true layers, not
 * a flattened image:
 *   1. card background #F7ECD9
 *   2. the cafe sketch on mix-blend-mode: darken over the background
 *   3. the "My voiceover" label above the sketch (never clipped)
 *   4. a functional audio bar over the sketch — the transcript marquees
 *      right-to-left inside its box, and play/mute drive the cafe.mp3 voiceover.
 */
export default function VibeVoiceCard() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      void a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  return (
    <div className="relative aspect-[614/559] w-full overflow-hidden rounded-[8px] bg-[#F7ECD9] [container-type:inline-size] sm:rounded-[1.47vw]">
      <audio
        ref={audioRef}
        src="/audio/cafe.mp3"
        preload="none"
        onEnded={() => setPlaying(false)}
      />

      {/* Cafe sketch — blended into the card background (Figma: blend darken) */}
      <img
        src="/images/mai/cafe-sketch.png"
        alt="Hand-drawn sketch of a busy cafe"
        loading="lazy"
        decoding="async"
        className="absolute left-[17%] top-[13%] aspect-[405/463] w-[66%] object-cover mix-blend-darken"
      />

      {/* Label — above the sketch, never overlapped/clipped */}
      <span className="absolute left-1/2 top-[7.5%] z-20 -translate-x-1/2 font-serif text-[min(3.63cqw,22.3px)] font-light italic text-black">
        My voiceover
      </span>

      {/* Functional audio bar */}
      <div className="absolute left-[13.84%] top-[51%] z-20 flex h-[7.01cqw] w-[72.3%] items-center rounded-[0.85cqw] bg-[#FEF9ED] pl-[2.35cqw] pr-[1.38cqw]">
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-[marquee-left_11s_linear_infinite] whitespace-nowrap font-mono text-[2.28cqw] tracking-[-0.16px] text-[#5D524B]">
            <span className="pr-[2.5vw]">
              Hey, so I was hoping to change my flight, if that&rsquo;s possible?
            </span>
            <span className="pr-[2.5vw]" aria-hidden>
              Hey, so I was hoping to change my flight, if that&rsquo;s possible?
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-[1.69cqw] pl-[1.57cqw]">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute voiceover" : "Mute voiceover"}
            className="flex h-[4.26cqw] w-[4.26cqw] items-center justify-center rounded-full bg-[#F7F1E3]"
          >
            <svg viewBox="0 0 26 26" className="h-[2.66cqw] w-[2.66cqw]" fill="none" aria-hidden>
              <path d="M8 10.5H10.5L14 7.5V18.5L10.5 15.5H8V10.5Z" stroke="#5D524B" strokeWidth="1.3" strokeLinejoin="round" />
              {muted ? (
                <path d="M17 10.5L21 15.5M21 10.5L17 15.5" stroke="#5D524B" strokeWidth="1.3" strokeLinecap="round" />
              ) : (
                <path d="M16.5 9.5C17.5 11 17.5 15 16.5 16.5M18.5 8C20 10 20 16 18.5 18" stroke="#5D524B" strokeWidth="1.3" strokeLinecap="round" />
              )}
            </svg>
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause voiceover" : "Play voiceover"}
            className="flex h-[4.26cqw] w-[4.26cqw] items-center justify-center rounded-full bg-[#F7F1E3]"
          >
            <svg viewBox="0 0 26 26" className="h-[2.25cqw] w-[2.25cqw]" aria-hidden>
              {playing ? (
                <path d="M9 7H11.5V19H9V7ZM14.5 7H17V19H14.5V7Z" fill="#5D524B" />
              ) : (
                <path d="M10 8L18 13L10 18V8Z" fill="#5D524B" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
