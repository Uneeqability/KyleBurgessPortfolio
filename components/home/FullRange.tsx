import Image from "next/image";
import Link from "next/link";
import CardShuffle from "./CardShuffle";
import ToolPills from "./ToolPills";
import Reveal from "@/components/Reveal";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";

function FeatureBlock({
  title,
  body,
  href,
  children,
}: {
  title: string;
  body: string;
  href?: string;
  children: React.ReactNode;
}) {
  const inner = (
    <article className="mx-auto flex w-full max-w-[403px] flex-col items-center text-center">
      <h3 className="font-serif text-[clamp(1.4rem,1.875vw,36px)] leading-tight text-espresso">
        {title}
      </h3>
      <p className="mt-3 max-w-[360px] font-mono text-[clamp(0.85rem,0.85vw,15px)] font-light leading-snug text-ink">
        {body}
      </p>
      <div className="mt-6 w-full">{children}</div>
    </article>
  );
  return href ? (
    <Link
      href={href}
      className="block transition-opacity duration-300 hover:opacity-90"
    >
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default function FullRange() {
  return (
    <section className="pb-28 sm:pb-36">
      {/* Tools card */}
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="rounded-[2rem] bg-sand px-6 py-16 text-center sm:py-20">
          <h2 className="font-serif text-[clamp(2rem,3.125vw,60px)] italic tracking-tight text-espresso">
            <BlurTextEffect>My Full Range</BlurTextEffect>
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-lg font-medium leading-snug text-espresso">
            A producer, editor, and designer, fluent across the full arc of a
            project, from strategy to craft.
          </p>
          <ToolPills />
        </div>
      </div>

      {/* Feature blocks — narrower, centered, offset zigzag */}
      <div className="mx-auto mt-20 max-w-[934px] px-6 sm:mt-28">
        <div className="grid gap-x-12 gap-y-[4.5rem] sm:grid-cols-2">
          <div className="flex flex-col gap-[4.5rem]">
            <Reveal>
              <FeatureBlock
                title="Presentation & Narrative Design"
                body="High-stakes decks that hold a room, from CEO keynotes to pitches. Narrative and design, handled together."
                href="/work/presentation"
              >
                <div className="relative aspect-[537/527] w-full overflow-hidden rounded-[30px] bg-[#E1DBC6]">
                  <div className="absolute left-[10.9%] top-[16%] w-[78.4%]">
                    <CardShuffle />
                  </div>
                </div>
              </FeatureBlock>
            </Reveal>

            <Reveal delay={80} className="sm:mt-[clamp(2rem,5vw,4rem)]">
              <FeatureBlock
                title="Brand Identity & Web Design"
                body="Brand identity and the sites that carry it, designed end to end. From first logo to live build."
                href="/work/bidbud"
              >
                <div className="overflow-hidden rounded-[30px] bg-[#DFC4A6]">
                  <Image
                    src="/images/range-ipad.png"
                    alt="Brand identity and web design — iPad mockup"
                    width={537}
                    height={544}
                    sizes="(max-width: 640px) 100vw, 537px"
                    className="h-auto w-full"
                  />
                </div>
              </FeatureBlock>
            </Reveal>
          </div>

          <div className="flex flex-col gap-[4.5rem] sm:pt-[clamp(9rem,24vw,353px)]">
            <Reveal delay={120}>
              <FeatureBlock
                title="Producing & Editing"
                body="Thirteen years producing and cutting for Netflix, Amazon, and Meta. Original series and campaigns, concept to final cut."
                href="/work/production"
              >
                <div className="relative aspect-[537/597] w-full overflow-hidden rounded-[30px] bg-[#ADA59C]">
                {/* Looping footage UNDER the TV — black fill + luminosity = B&W.
                    Sized to the footage's own 480×270 ratio so it isn't cropped;
                    the TV's transparent screen reveals it. */}
                <div className="absolute left-[-21.8%] top-[37.7%] h-[45.2%] w-[89.4%] bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/videos/hollywood.webp"
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover opacity-[0.65] mix-blend-luminosity"
                  />
                </div>
                {/* Retro TV PNG with a cut-out screen, on top */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/retro-tv.png"
                  alt="Producing and editing — retro TV"
                  loading="lazy"
                  decoding="async"
                  className="absolute left-[-58.9%] top-[-25.8%] w-[163.5%] max-w-none"
                />
              </div>
              </FeatureBlock>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
