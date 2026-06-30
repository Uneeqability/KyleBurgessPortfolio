import Link from "next/link";

type NavTone = "cream" | "ink";

const LINKS = [
  { label: "home", href: "/" },
  { label: "work", href: "/work" },
  { label: "contact", href: "/contact" },
];

/**
 * Shared site navigation. Absolutely positioned so it floats over the hero of
 * each page. `tone` switches text colour for light vs. dark backgrounds.
 * Reused across all 9 portfolio pages.
 */
export default function Nav({ tone = "cream" }: { tone?: NavTone }) {
  const isCream = tone === "cream";
  const text = isCream ? "text-cream/85" : "text-ink/80";
  const textHover = isCream ? "hover:text-cream" : "hover:text-ink";
  const pillBorder = isCream ? "border-cream/40" : "border-ink/25";

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="container-content flex items-center justify-end gap-1 py-6 font-sans text-[0.8rem] sm:gap-4 sm:py-7 sm:text-[0.95rem]">
        <ul className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-full px-3 py-2 transition-colors sm:px-4 ${text} ${textHover}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href="/Kyle-Burgess-Resume.pdf"
          className={`whitespace-nowrap rounded-full border px-4 py-2 transition-colors sm:px-5 ${pillBorder} ${text} hover:border-[#FFE2A8] hover:bg-[#FFE2A8] hover:text-[#1B200F]`}
        >
          download resume
        </a>
      </nav>
    </header>
  );
}
