import Link from "next/link";
import SeeMoreProjects from "@/components/SeeMoreProjects";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";

/**
 * Recent Projects — a #F7ECD9 panel (rounded top & bottom) holding three project
 * cards that STACK on scroll: each card is sticky, so the next scrolls up and
 * covers the previous. Each card has a dark overlay and an infinite
 * left-scrolling title marquee (per the Figma banners).
 *
 * Card images are positioned with the exact Figma crop (not object-cover), and
 * the Twain card sits at 85% opacity over #D2E0CA so the green tints through.
 */

type Project = {
  title: string;
  img: string;
  href: string;
  bg?: string;
  /** exact Figma image crop within the 1511×912 card */
  imgClass: string;
  /** dark overlay over the card */
  overlay: string;
};

const PROJECTS: Project[] = [
  {
    title: "Microsoft Build",
    img: "/images/card-keynote.jpg",
    href: "/work",
    imgClass: "absolute left-0 top-[-10.49%] h-[110.48%] w-full object-cover",
    overlay: "bg-black/30",
  },
  {
    title: "Microsoft AI Website",
    img: "/images/card-mai.png",
    href: "/work/microsoft-ai-website",
    bg: "#F7ECD9",
    imgClass: "absolute left-[6.2%] top-[3.16%] w-[87.7%]",
    overlay: "bg-black/30",
  },
  {
    title: "Twain Dating App",
    img: "/images/card-twain.png",
    href: "/work",
    bg: "#D2E0CA",
    imgClass: "absolute left-[-32.98%] top-[-60.57%] w-[172.05%] max-w-none opacity-85",
    overlay: "bg-black/20",
  },
];

function Banner({ title }: { title: string }) {
  const Unit = () => (
    <span className="flex shrink-0 items-center whitespace-nowrap font-mono [font-size:clamp(11px,1.77vw,34px)] text-white">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="flex items-center">
          <span>{title}</span>
          <span className="px-[1.82vw]">·</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 overflow-hidden">
      <div className="flex animate-marquee">
        <Unit />
        <Unit />
      </div>
    </div>
  );
}

function Card({ project }: { project: Project }) {
  return (
    <Link
      href={project.href}
      aria-label={project.title}
      className="group relative block aspect-[1511/912] w-full overflow-hidden rounded-[1.94vw] shadow-[0_30px_60px_-20px_rgba(62,38,18,0.25)]"
      style={{ background: project.bg }}
    >
      <img
        src={project.img}
        alt={project.title}
        className={`${project.imgClass} transition-transform duration-700 group-hover:scale-[1.03]`}
      />
      <div className={`absolute inset-0 ${project.overlay}`} />
      <Banner title={project.title} />
    </Link>
  );
}

export default function RecentProjects() {
  return (
    <section className="w-full pb-24 sm:pb-32">
      <div className="w-full rounded-[5.2vw] bg-[#F7ECD9] py-[7vw]">
        <div className="mx-auto max-w-[1352px] px-6">
          <h2 className="text-center font-serif text-[clamp(1.6rem,2.5vw,48px)] leading-tight text-[#3E2612]">
            <BlurTextEffect>Recent Projects</BlurTextEffect>
          </h2>

          {/* Sticky-stacking cards. Each card gets a trailing slug of scroll
              room (the last one too) so it can fully cover the card below. */}
          <div className="relative mx-auto mt-[clamp(2rem,4vw,4.5rem)] w-full sm:w-[82.5%]">
            {PROJECTS.map((project) => (
              <div key={project.title} className="sticky top-[6vh] pb-[clamp(1.65rem,4.13vw,4.5rem)]">
                <Card project={project} />
              </div>
            ))}
          </div>

          <SeeMoreProjects className="mt-[7vw]" />
        </div>
      </div>
    </section>
  );
}
