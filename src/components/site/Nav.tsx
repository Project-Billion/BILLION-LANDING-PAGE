import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { brand, nav, newTabHint, whatsappUrl } from "@/content/site";
import { MobileMenu } from "./MobileMenu";

/**
 * Inset floating navigation bar (not glued edge to edge). Fixed so the WhatsApp
 * action and menu stay reachable; sections must leave room for --nav-height at the top.
 */
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] md:pt-6">
      <Container className="pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))]">
        <nav
          aria-label="Main"
          className="flex h-(--nav-height) items-center justify-between rounded-sm border border-rule bg-paper pl-5 pr-2 md:pl-7 md:pr-3"
        >
          <a
            href="#main"
            className="relative z-10 font-display text-[1.875rem] leading-none tracking-[-0.02em] text-ink"
          >
            {brand.name}
          </a>

          <div className="hidden items-center gap-2 md:flex">
            <ul className="flex items-center">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center px-4 text-ui text-ink-2 transition-colors duration-(--duration-hover) hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button href={whatsappUrl()} variant="accent" target="_blank" rel="noopener noreferrer">
              {nav.whatsappLabel}
              <span className="sr-only">{newTabHint}</span>
            </Button>
          </div>

          <MobileMenu />
        </nav>
      </Container>
    </header>
  );
}
