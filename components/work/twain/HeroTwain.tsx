import Reveal from "@/components/Reveal";
import HeroPhones from "./HeroPhones";

/**
 * Twain case-study hero (Figma frame 291:194, header region). Same shell as the
 * MAI hero: header band + centered title/subtitle, then the beige hero card
 * with two "iPhone 15 Black 8K" mockups overlapping it (they bleed above the
 * card top). Placement mirrors the Figma exactly (px ÷ 19.2 → vw, main-y =
 * Figma-y − 137 for the in-flow nav). Desktop-exact for now.
 */
export default function HeroTwain() {
  return (
    <>
      <HeroMobile />
      <HeroDesktop />
    </>
  );
}

/* ----------------------------------------------------------------- mobile -- */

function HeroMobile() {
  return (
    <section className="relative sm:hidden">
      {/* Header band */}
      <div className="absolute inset-x-0 top-0 h-[86vw] bg-[#F7ECD9]" />

      <div className="relative px-5 pt-12 text-center">
        <Reveal>
          <h1 className="font-serif text-[2rem] font-normal leading-[1.15] text-espresso">
            Twain Dating App
          </h1>
        </Reveal>
        <Reveal className="mt-3" delay={120}>
          <p className="mx-auto max-w-[20rem] font-roboto text-[0.95rem] leading-[1.45] text-taupe">
            Dating apps suck, so I&rsquo;m creating one.
          </p>
        </Reveal>
      </div>

      {/* Hero card + phones (same %-based layout as desktop) */}
      <div className="relative mx-auto mt-[26vw] h-[32vw] w-[90vw] rounded-[4vw] bg-[#E1DBC6]">
        <HeroPhones />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- desktop -- */

function HeroDesktop() {
  return (
    <section className="relative hidden h-[60vw] sm:block">
      {/* Header band (#F7ECD9, ends Figma-y 1059) */}
      <div className="absolute inset-x-0 top-0 h-[48.02vw] bg-[#F7ECD9]" />

      {/* Title + subtitle */}
      <div className="absolute inset-x-0 top-[8.8vw] text-center">
        <Reveal>
          <h1 className="font-serif text-[min(3.125vw,60px)] font-normal leading-[1.2] text-espresso">
            Twain Dating App
          </h1>
        </Reveal>
        <Reveal className="mt-[1.8vw]" delay={120}>
          <p className="mx-auto max-w-[62vw] font-roboto text-[min(1.302vw,25px)] leading-[1.4] text-taupe">
            Dating apps suck, so I&rsquo;m creating one.
          </p>
        </Reveal>
      </div>

      {/* Hero card + phone mockups (Figma 291:285). Each phone is its own
          transparent mockup with the exact Figma fill crop; they bleed above
          the card top. */}
      <div className="absolute left-[12.71vw] top-[35.52vw] h-[24.37vw] w-[73.54vw] rounded-[1.47vw] bg-[#E1DBC6]">
        <HeroPhones />
      </div>
    </section>
  );
}
