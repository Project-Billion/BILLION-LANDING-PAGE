import type { CSSProperties } from "react";
import { ProductionLine } from "@/components/drawings/Schematics";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";
import { hero, newTabHint, whatsappUrl } from "@/content/site";

/**
 * Stagger position for the one on-load reveal (.hero-in in globals.css). Only the eyebrow, H1 and
 * lower panel animate; the lead paragraph and CTAs paint immediately because the paragraph is the
 * mobile LCP element and hiding it behind opacity delayed LCP (QA03).
 */
function stagger(index: number): CSSProperties {
  return { "--reveal-index": index } as CSSProperties;
}

/** The H1 with a single Kiln underline under the emphasis word (decoration only, text stays Ink). */
function HeroTitle() {
  const [before, after] = hero.title.split(hero.titleEmphasis);
  return (
    <h1 id="hero-title" className="hero-in mt-5 max-w-[10.5em] text-h1 text-wrap" style={stagger(1)}>
      {before}
      <span className="underline decoration-kiln decoration-[0.04em] underline-offset-[0.14em] [text-decoration-skip-ink:none]">
        {hero.titleEmphasis}
      </span>
      {after}
    </h1>
  );
}

/** 01 Hero: top-left editorial lead, then a full-width rule with the schematic and inspection note low-right. */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="pt-[calc(var(--nav-height)+3.5rem+env(safe-area-inset-top,0px))] pb-24 md:pt-[calc(var(--nav-height)+5.5rem)] lg:pb-32"
    >
      <Container>
        <p className="hero-in font-mono text-meta uppercase text-ink-2" style={stagger(0)}>
          {hero.eyebrow}
        </p>
        <HeroTitle />
        <p className="mt-8 max-w-[53rem] text-body text-ink-2 md:text-[1.1875rem]">
          {hero.sub}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button href={whatsappUrl()} variant="accent" target="_blank" rel="noopener noreferrer">
            {hero.primaryCta}
            <ArrowRight />
            <span className="sr-only">{newTabHint}</span>
          </Button>
          <Button href={hero.secondaryCta.href} variant="secondary">
            {hero.secondaryCta.label}
          </Button>
        </div>
        <p className="mt-5 max-w-[60rem] text-ui text-graphite">
          {hero.trustLine}
        </p>

        <div className="hero-in mt-12 grid gap-10 border-t border-rule pt-8 md:mt-14 lg:grid-cols-12 lg:gap-12" style={stagger(2)}>
          <ProductionLine className="self-end text-ink-2 lg:col-span-8" />

          <aside
            aria-labelledby="hero-panel-title"
            className="rounded-sm border border-rule px-4 pt-4 pb-2 font-mono text-meta text-ink-2 lg:col-span-4 lg:mt-6"
          >
            <p className="flex items-baseline justify-between gap-4 uppercase">
              <span id="hero-panel-title" className="text-ink">
                {hero.panel.title}
              </span>
              <span aria-hidden="true">{hero.panel.index}</span>
            </p>
            <ul className="mt-3">
              {hero.panel.items.map((item) => (
                <li key={item} className="border-t border-rule py-2">
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </section>
  );
}
