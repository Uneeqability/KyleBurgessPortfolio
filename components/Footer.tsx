import Image from "next/image";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";
import AnimatedCurve from "@/components/AnimatedCurve";

/**
 * Shared site footer / "Let's Connect" CTA, from the Figma frame (1920 wide):
 *
 *   Top    gradient 106.65deg #A08971→#917E6A→#7F6E5C, radius 60/60/0/0 — holds
 *          only the closing paragraph (no divider, no name).
 *   Bottom blurred portrait (1920×945), radius 60, overlapping the top panel.
 *          "Let's Connect" (120px) with the dashed trail drawing off its right
 *          edge, the email + LinkedIn buttons, then "Kyle Burgess" beneath them.
 */
export default function Footer() {
  return (
    <footer className="relative w-full text-[#EFE2D1]">
      {/* ---------- Top gradient panel (paragraph only) ---------- */}
      <div className="rounded-t-[40px] bg-[linear-gradient(106.65deg,#A08971_30.75%,#917E6A_59.92%,#7F6E5C_94.73%)] px-6 pb-[clamp(7rem,17vw,327px)] pt-[clamp(3rem,6.6vw,127px)] text-center sm:rounded-t-[60px]">
        <p className="mx-auto w-[48.3%] min-w-[280px] max-w-[927px] font-serif text-[clamp(1rem,1.25vw,24px)] font-normal leading-[1.5]">
          Thanks for scrolling this far. I built this site from scratch, which is
          more or less how I&rsquo;m built, concept to something real. If
          that&rsquo;s who you&rsquo;re looking for, drop me a line and let&rsquo;s
          get to work.
        </p>
      </div>

      {/* ---------- Bottom portrait panel (overlaps the gradient) ---------- */}
      <div className="relative -mt-[clamp(5rem,12vw,231px)] isolate overflow-hidden rounded-t-[40px] sm:rounded-t-[60px]">
        <Image
          src="/images/footer-bg.jpg"
          alt="Kyle Burgess"
          fill
          sizes="100vw"
          quality={90}
          className="-z-10 object-cover"
        />

        <div className="relative aspect-[1920/945] max-h-[920px] min-h-[480px] w-full">
          {/* Heading + the dashed trail running off its right edge */}
          <div className="absolute inset-x-0 top-[50%] flex -translate-y-1/2 justify-center">
            <h2 className="relative font-serif text-[clamp(3.25rem,6.25vw,120px)] leading-[0.85] tracking-[-0.03em] text-[#FFFFEB]">
              <BlurTextEffect
                segments={[
                  { text: "Let’s ", className: "font-light" },
                  { text: "Connect", className: "font-light italic" },
                ]}
              />
              <span className="pointer-events-none absolute left-full top-1/2 ml-[1.5vw] hidden w-[46vw] -translate-y-1/2 sm:block">
                <AnimatedCurve className="h-auto w-full" />
              </span>
            </h2>
          </div>

          {/* Email + LinkedIn */}
          <div className="absolute inset-x-0 top-[67.8%] flex -translate-y-1/2 items-center justify-center gap-3 sm:gap-4">
            <a
              href="mailto:Kyle@uneeqability.com"
              aria-label="Email me"
              className="flex items-center justify-center rounded-xl bg-[#FFFFEB] px-6 py-3 text-[#1A1A1A] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
                <path
                  d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/kyleburgess13190/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center justify-center rounded-xl bg-[#FFFFEB] px-6 py-3 text-[#1A1A1A] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
            </a>
          </div>

          {/* Name, beneath the buttons */}
          <div className="absolute inset-x-0 top-[84.3%] -translate-y-1/2 text-center">
            <h2 className="font-serif text-[clamp(1.5rem,2.6vw,50px)] leading-[1.5] text-[#FFFFEB]">
              <span className="font-light italic">Kyle</span>
              <span className="font-medium">Burgess</span>
            </h2>
          </div>
        </div>
      </div>
    </footer>
  );
}
