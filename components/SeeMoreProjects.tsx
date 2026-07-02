import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * The "see more projects" link → /work. Shared between the homepage (in the
 * Recent Projects panel) and the case-study pages (just above the footer), so
 * it stays identical everywhere. Pass `className` for spacing.
 */
export default function SeeMoreProjects({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Reveal className={`text-center ${className}`}>
      <Link
        href="/work"
        className="font-mono text-[clamp(1.1rem,1.3vw,25px)] font-light text-[#3E2612] underline-offset-8 transition hover:underline"
      >
        see more projects
      </Link>
    </Reveal>
  );
}
