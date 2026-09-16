import { Container } from "@/components/ui/Container";
import { brand, footer, mailtoUrl, siteConfig, whatsappUrl } from "@/content/site";

const linkClass =
  "inline-flex min-h-11 items-center text-ui text-ink underline decoration-rule decoration-1 underline-offset-4 transition-colors duration-(--duration-hover) hover:decoration-ink";

/** Hairline arrow for external links, drawn from line primitives. */
function ExternalArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="ml-2 size-3" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M3 9 9 3M4 3h5v5" />
    </svg>
  );
}

/** Minimal colophon footer (BRIEF section 07). */
export function Footer() {
  return (
    <footer className="bg-paper pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
      <Container>
        <div className="grid gap-8 border-t border-rule pt-12 pb-10 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <p className="font-display text-[2.5rem] leading-none tracking-[-0.02em] text-ink md:text-5xl">
              {brand.name}
            </p>
            <p className="mt-4 text-body text-graphite">{footer.tagline}</p>
          </div>

          <address className="flex flex-col items-start gap-1 not-italic md:col-span-3">
            <a href={mailtoUrl()} className={linkClass}>
              {siteConfig.contact.email}
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {footer.whatsappLabel}
              <ExternalArrow />
            </a>
            <p className="mt-2 font-mono text-meta text-graphite">{footer.location}</p>
          </address>

          <ul className="flex flex-col items-start gap-1 md:col-span-3">
            <li>
              <a href={footer.links.valor.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {footer.links.valor.label}
                <ExternalArrow />
              </a>
            </li>
            <li>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {footer.links.linkedin.label}
              </a>
            </li>
            <li>
              <a href={footer.links.privacy.href} className={linkClass}>
                {footer.links.privacy.label}
              </a>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between border-t border-rule pt-6 font-mono text-meta text-graphite">
          <span aria-hidden="true">{footer.index}</span>
          <p>{footer.copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
