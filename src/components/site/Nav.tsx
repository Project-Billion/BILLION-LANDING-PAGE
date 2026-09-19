"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { nav } from "@/content/site";
import { MobileMenu } from "./MobileMenu";
import { useFloatingNav } from "./useFloatingNav";

const linkClass =
  "inline-flex min-h-11 items-center px-3 font-sans text-sm font-normal normal-case text-fg-2 transition-colors duration-(--duration-hover) hover:text-fg";

/** In-page anchors ("#what-we-build") point at the home page, so off the home page they become "/#what-we-build". */
function NavAnchor({ href, isHome, className, children }: { href: string; isHome: boolean; className: string; children: ReactNode }) {
  if (isHome) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <a href={`/${href}`} className={className}>
      {children}
    </a>
  );
}

function Wordmark({ isHome }: { isHome: boolean }) {
  return (
    <NavAnchor href={isHome ? "#main" : ""} isHome={isHome} className="relative z-10 text-2xl font-medium tracking-[-0.01em] text-fg">
      Billion.
    </NavAnchor>
  );
}

/** On /book the button points at the current page, so it is marked as such and drawn quiet. */
function TalkButton({ onBook }: { onBook: boolean }) {
  return (
    <Button href="/book" variant={onBook ? "secondary" : "accent"} aria-current={onBook ? "page" : undefined}>
      {nav.bookLabel}
    </Button>
  );
}

/**
 * Two states (design spec section 10, v2): a transparent bar over the hero, three tiny
 * links top-left, the wordmark centred and a pill CTA top-right; once the hero scrolls
 * out, a centred floating pill carries the wordmark, all four links and the CTA. Driven
 * by useFloatingNav (an IntersectionObserver on a sentinel Hero renders, no scroll
 * listeners). Mobile keeps a plain wordmark + menu button in both states.
 */
export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const onBook = pathname === "/book";
  const observedFloating = useFloatingNav();
  // Only the home page has the hero sentinel; every other page starts with the solid nav.
  const floating = observedFloating || !isHome;

  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] md:pt-6">
      <Container className="pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))]">
        {/* Mobile: wordmark + menu, unchanged across both states. */}
        <nav
          aria-label="Main"
          className={`flex h-(--nav-height) items-center justify-between md:hidden ${isHome ? "" : "nav-pill -mx-3 rounded-md border border-rule px-3"}`}
        >
          <Wordmark isHome={isHome} />
          <MobileMenu />
        </nav>

        {/* Desktop, over the hero: transparent bar. */}
        {!floating && (
          <nav aria-label="Main" className="hidden h-(--nav-height) items-center md:grid md:grid-cols-[1fr_auto_1fr]">
            <ul className="flex items-center justify-self-start">
              {nav.links.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <NavAnchor href={link.href} isHome={isHome} className={linkClass}>
                    {link.label}
                  </NavAnchor>
                </li>
              ))}
            </ul>
            <Wordmark isHome={isHome} />
            <div className="justify-self-end">
              <TalkButton onBook={onBook} />
            </div>
          </nav>
        )}

        {/* Desktop, after the hero: centred floating pill. */}
        {floating && (
          <div className="hidden justify-center md:flex">
            <nav
              aria-label="Main"
              className="nav-pill nav-pill-in flex items-center gap-6 rounded-pill border border-rule py-2 pr-2 pl-6"
            >
              <Wordmark isHome={isHome} />
              <ul className="flex items-center">
                {nav.links.map((link) => (
                  <li key={link.href}>
                    <NavAnchor href={link.href} isHome={isHome} className={linkClass}>
                      {link.label}
                    </NavAnchor>
                  </li>
                ))}
              </ul>
              <TalkButton onBook={onBook} />
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
