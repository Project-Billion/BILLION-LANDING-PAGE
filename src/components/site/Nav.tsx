"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hero, nav, newTabHint, whatsappUrl } from "@/content/site";
import { MobileMenu } from "./MobileMenu";
import { useFloatingNav } from "./useFloatingNav";

const linkClass =
  "inline-flex min-h-11 items-center px-3 font-mono text-meta uppercase text-fg-2 transition-colors duration-(--duration-hover) hover:text-fg";

function Wordmark() {
  return (
    <a href="#main" className="relative z-10 text-2xl font-medium tracking-[-0.01em] text-fg">
      Billion.
    </a>
  );
}

function TalkButton() {
  return (
    <Button href={whatsappUrl()} variant="accent" target="_blank" rel="noopener noreferrer">
      {hero.primaryCta}
      <span className="sr-only">{newTabHint}</span>
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
  const floating = useFloatingNav();

  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] md:pt-6">
      <Container className="pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))]">
        {/* Mobile: wordmark + menu, unchanged across both states. */}
        <nav aria-label="Main" className="flex h-(--nav-height) items-center justify-between md:hidden">
          <Wordmark />
          <MobileMenu />
        </nav>

        {/* Desktop, over the hero: transparent bar. */}
        {!floating && (
          <nav aria-label="Main" className="hidden h-(--nav-height) items-center md:grid md:grid-cols-[1fr_auto_1fr]">
            <ul className="flex items-center justify-self-start">
              {nav.links.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Wordmark />
            <div className="justify-self-end">
              <TalkButton />
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
              <Wordmark />
              <ul className="flex items-center">
                {nav.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <TalkButton />
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
