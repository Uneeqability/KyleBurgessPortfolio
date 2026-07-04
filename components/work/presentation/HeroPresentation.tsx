/**
 * Presentation & Narrative Design — case-study hero (Figma section 60:1000 +
 * header graphic 70:1195). Same structure/spacing as the other case-study heroes
 * (#F7ECD9 plate → title/subtitle → beige #E1DBC6 plate with the header graphic
 * peeking up on it). The header graphic is the shuffling slide stack (CardShuffle
 * from the homepage), sized to the Figma graphic (756.78×600 → 39.42vw wide).
 */
import Reveal from "@/components/Reveal";
import CardShuffle from "@/components/home/CardShuffle";

export default function HeroPresentation() {
  return (
    <>
      <HeroMobile />
      <HeroDesktop />
    </>
  );
}

function HeroMobile() {
  return (
    <section className="bg-[#F7ECD9] px-5 pb-10 pt-14 text-center sm:hidden">
      <Reveal>
        <h1 className="font-serif text-[2rem] font-normal leading-[1.15] text-espresso">
          Presentation &amp; Narrative Design
        </h1>
      </Reveal>
      <Reveal className="mt-4" delay={120}>
        <p className="mx-auto max-w-md font-roboto text-[0.95rem] leading-relaxed text-taupe">
          High-stakes presentation work for the rooms where decisions get made,
          from a CEO&rsquo;s keynote to network pitches and label rollouts. Built
          to hold a room and carry an idea, not just fill a screen.
        </p>
      </Reveal>
      <div className="relative mx-auto mt-6 w-[82vw]">
        <div className="absolute inset-x-[-6%] bottom-[-8%] top-[38%] rounded-[3vw] bg-[#E1DBC6]" />
        <div className="relative">
          <CardShuffle intro />
        </div>
      </div>
    </section>
  );
}

function HeroDesktop() {
  return (
    <section className="relative hidden h-[60.4vw] w-full overflow-hidden sm:block">
      {/* #F7ECD9 hero plate */}
      <div className="absolute inset-x-0 top-0 h-[47.6vw] bg-[#F7ECD9]" />

      {/* Title + subtitle */}
      <div className="absolute inset-x-0 top-[8.4vw] px-6 text-center">
        <Reveal>
          <h1 className="font-serif text-[min(3.125vw,60px)] font-normal leading-[1.2] text-espresso">
            Presentation &amp; Narrative Design
          </h1>
        </Reveal>
        <Reveal className="mt-[1.3vw]" delay={120}>
          <p className="mx-auto max-w-[54vw] font-roboto text-[min(1.302vw,25px)] leading-[1.4] text-taupe">
            High-stakes presentation work for the rooms where decisions get made,
            from a CEO&rsquo;s keynote to network pitches and label rollouts. Built
            to hold a room and carry an idea, not just fill a screen.
          </p>
        </Reveal>
      </div>

      {/* Beige plate (Figma "Hero image" 70:1186) */}
      <div className="absolute left-[12.71vw] top-[35.6vw] h-[24.38vw] w-[74.53vw] rounded-[1.47vw] bg-[#E1DBC6]" />

      {/* Shuffling slide stack (Figma 70:1195, 756.78×600), peeking up on the plate */}
      <div className="absolute left-1/2 top-[26.1vw] w-[39.42vw] -translate-x-1/2">
        <CardShuffle intro />
      </div>
    </section>
  );
}
