import Link from "next/link";
import ContactLink from "./ContactLink";

type NavTone = "cream" | "ink" | "bar";

const LINKS = [
  { label: "home", href: "/" },
  { label: "work", href: "/work" },
  { label: "contact", href: "#connect" },
];

/**
 * Shared site navigation, reused across all 9 portfolio pages.
 *
 *  - `cream` / `ink`  → transparent floating nav (homepage over the hero).
 *  - `bar`            → solid dark-green gradient bar with the KyleBurgess
 *                       wordmark on the left, used by the interior/case-study
 *                       pages. Matches the Figma header (1920×137, gradient
 *                       270deg #2E351B→#4F5633).
 */
export default function Nav({ tone = "cream" }: { tone?: NavTone }) {
  if (tone === "bar") return <NavBar />;

  const isCream = tone === "cream";
  const text = isCream ? "text-cream/85" : "text-ink/80";
  const textHover = isCream ? "hover:text-cream" : "hover:text-ink";
  const pillBorder = isCream ? "border-cream/40" : "border-ink/25";

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="container-content flex items-center justify-end gap-1 py-6 font-sans text-[0.8rem] sm:gap-4 sm:py-7 sm:text-[0.95rem]">
        <ul className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => {
            const cls = `rounded-full px-3 py-2 transition-colors sm:px-4 ${text} ${textHover}`;
            return (
              <li key={link.href}>
                {link.label === "contact" ? (
                  <ContactLink className={cls} />
                ) : (
                  <Link href={link.href} className={cls}>
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
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

/**
 * Solid green header bar for interior pages. The wordmark links home; the link
 * cluster + resume pill sit on the right, matching the homepage nav's items.
 */
function NavBar() {
  return (
    <header className="relative z-50 w-full bg-[linear-gradient(270deg,#2E351B_23.87%,#4F5633_84.35%)]">
      <nav className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-6 py-6 font-sans text-[0.8rem] text-cream/85 sm:py-7 sm:pl-16 sm:pr-14 sm:text-[0.95rem]">
        <Link
          href="/"
          aria-label="Kyle Burgess — home"
          className="font-serif text-[1.35rem] leading-none text-cream sm:text-[1.65rem]"
        >
          <span className="font-light italic">Kyle</span>
          <span className="font-medium">Burgess</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <ul className="hidden items-center gap-1 sm:flex sm:gap-2">
            {LINKS.map((link) => {
              const cls =
                "rounded-full px-3 py-2 transition-colors hover:text-cream sm:px-4";
              return (
                <li key={link.href}>
                  {link.label === "contact" ? (
                    <ContactLink className={cls} />
                  ) : (
                    <Link href={link.href} className={cls}>
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <a
            href="/Kyle-Burgess-Resume.pdf"
            className="whitespace-nowrap rounded-full border border-cream/40 px-4 py-2 transition-colors hover:border-[#FFE2A8] hover:bg-[#FFE2A8] hover:text-[#1B200F] sm:px-5"
          >
            download resume
          </a>
        </div>
      </nav>
    </header>
  );
}
