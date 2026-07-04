"use client";

import type Lenis from "lenis";

/**
 * The nav "contact" item. Instead of a (non-existent) /contact page, it
 * smooth-scrolls to the footer's "Let's Connect" panel (id="connect") on the
 * current page — via Lenis when available, otherwise a native smooth scroll.
 */
export default function ContactLink({ className }: { className?: string }) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("connect");
    if (!target) return; // let the href fall through if the footer isn't present
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <a href="#connect" onClick={onClick} className={className}>
      contact
    </a>
  );
}
