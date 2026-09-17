import { Container } from "@/components/ui/Container";
import { ArrowUpRight } from "@/components/ui/Icons";
import { brand, footer, mailtoUrl, newTabHint, siteConfig, whatsappUrl } from "@/content/site";
import { FooterWordmark } from "./FooterWordmark";

const linkClass =
  "inline-flex min-h-11 items-center text-ui text-fg underline decoration-rule decoration-1 underline-offset-4 transition-colors duration-(--duration-hover) hover:decoration-fg";

/** Minimal colophon footer (BRIEF section 07), with the ghosted wordmark cut off at the page end. */
export function Footer() {
  return (
    <footer className="overflow-hidden">
      {/* Bottom padding sits on the real content, not the footer box, so the ghosted
          wordmark below can bleed to the footer's own edge and get clipped there. */}
      <Container className="pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
        <div className="grid gap-8 border-t border-rule pt-12 pb-10 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <p className="font-display text-[2.5rem] leading-none tracking-[-0.02em] text-fg md:text-5xl">
              {brand.name}
            </p>
            <p className="mt-4 text-body text-fg-2">{footer.tagline}</p>
          </div>

          <address className="flex flex-col items-start gap-1 not-italic md:col-span-3">
            <a href={mailtoUrl()} className={linkClass}>
              {siteConfig.contact.email}
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {footer.whatsappLabel}
              <ArrowUpRight className="ml-2" />
              <span className="sr-only">{newTabHint}</span>
            </a>
            <p className="mt-2 font-mono text-meta text-fg-2">{footer.location}</p>
          </address>

          <ul className="flex flex-col items-start gap-1 md:col-span-3">
            <li>
              <a href={footer.links.valor.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {footer.links.valor.label}
                <ArrowUpRight className="ml-2" />
                <span className="sr-only">{newTabHint}</span>
              </a>
            </li>
            <li>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {footer.links.linkedin.label}
                <span className="sr-only">{newTabHint}</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between border-t border-rule pt-6 font-mono text-meta text-fg-2">
          <span aria-hidden="true">{footer.index}</span>
          <p>{footer.copyright}</p>
        </div>
      </Container>

      <FooterWordmark />
    </footer>
  );
}
