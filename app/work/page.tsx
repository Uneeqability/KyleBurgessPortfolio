import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import WorkCard from "@/components/work/index/WorkCard";
import {
  BuildVisual,
  MaiVisual,
  TwainVisual,
  ProductionVisual,
  PresentationVisual,
  BidBudVisual,
} from "@/components/work/index/CardVisuals";

export default function WorkIndex() {
  return (
    <>
      <Nav tone="bar" />
      <main className="relative">
        {/* Header band (Figma #F7ECD9, ends at y=1059) */}
        <div className="absolute inset-x-0 top-0 h-[62vw] bg-[#F7ECD9] sm:h-[48.02vw]" />

        {/* Title + subtitle */}
        <div className="relative px-6 pt-14 text-center sm:pt-[11.15vw]">
          <Reveal>
            <h1 className="font-serif text-[2rem] font-normal leading-[1.2] text-espresso sm:text-[min(3.125vw,60px)]">
              My Work
            </h1>
          </Reveal>
          <Reveal className="mt-4 sm:mt-[3.3vw]" delay={120}>
            <p className="mx-auto max-w-[22rem] font-roboto text-[0.95rem] leading-[1.45] text-taupe sm:max-w-[61vw] sm:text-[min(1.25vw,24px)]">
              Creative direction, production, and design, across entertainment
              and tech.
            </p>
          </Reveal>
        </div>

        {/* Cards grid */}
        <div className="relative mx-auto mt-10 grid w-[89vw] grid-cols-1 gap-y-6 pb-16 sm:mt-[6.8vw] sm:w-[74.27vw] sm:grid-cols-2 sm:gap-x-[2.4vw] sm:gap-y-[3.07vw] sm:pb-[12vw]">
          <Reveal blur>
            <WorkCard
              href="/work/microsoft-build"
              title="Microsoft Build"
              description="Design and motion direction for the Microsoft Build 2026 keynote, launching Microsoft AI’s new model family"
            >
              <BuildVisual />
            </WorkCard>
          </Reveal>
          <Reveal blur delay={130}>
            <WorkCard
              href="/work/microsoft-ai-website"
              title="Microsoft.ai Website Relaunch"
              description="Producer and DRI on the site-wide relaunch, shipped on Microsoft’s biggest stage of the year."
              tint="rgba(255, 230, 183, 0.75)"
            >
              <MaiVisual />
            </WorkCard>
          </Reveal>
          <Reveal blur>
            <WorkCard
              href="/work/twain"
              title="Twain Dating App"
              description="A dating app I’ve built from the ground up."
              tint="rgba(142, 157, 134, 0.65)"
            >
              <TwainVisual />
            </WorkCard>
          </Reveal>
          <Reveal blur delay={130}>
            <WorkCard
              href="/work/production"
              title="Production, Creation & Editing"
              description="Thirteen years producing and cutting for Netflix, Amazon, Meta, and more."
              tint="rgba(218, 226, 227, 0.71)"
            >
              <ProductionVisual />
            </WorkCard>
          </Reveal>
          <Reveal blur>
            <WorkCard
              href="/work/presentation"
              title="Presentation & Narrative Design"
              description="High-stakes decks that hold a room, from CEO keynotes to network pitches."
              tint="#E1DBC6"
            >
              <PresentationVisual />
            </WorkCard>
          </Reveal>
          <Reveal blur delay={130}>
            <WorkCard
              href="/work/bidbud"
              title="BidBud"
              description="An AI-powered tool for contractors. Founder, creative director, and product architect."
              tint="rgba(214, 110, 69, 0.45)"
            >
              <BidBudVisual />
            </WorkCard>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
