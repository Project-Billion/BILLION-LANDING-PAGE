import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cta, hero, howItWorks, industries, proof, valueProps } from "@/content/site";

/**
 * Page shell: section order, ids and headings only.
 * Full section designs land in src/components/sections/* (T3).
 */
export default function Home() {
  return (
    <>
      {/* 01 Hero: implemented in T3 */}
      <section aria-labelledby="hero-title" className="pt-[calc(var(--nav-height)+4.5rem+env(safe-area-inset-top,0px))] pb-24 md:pt-[calc(var(--nav-height)+6rem)]">
        <Container>
          <p className="font-mono text-meta uppercase text-ink-2">{hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-6 max-w-[18ch] text-h1">
            {hero.title}
          </h1>
        </Container>
      </section>

      {/* 02 Value props: implemented in T3 */}
      <section id={valueProps.section.id} aria-labelledby="what-we-do-label" className="bg-paper-2 py-24 lg:py-40">
        <Container>
          <SectionLabel index={valueProps.section.index} label={valueProps.section.label} tone="paper-2" />
          <h2 id="what-we-do-label" className="sr-only">
            {valueProps.section.label}
          </h2>
        </Container>
      </section>

      {/* 03 Industries: implemented in T3 */}
      <section id={industries.section.id} aria-labelledby="industries-label" className="py-24 lg:py-40">
        <Container>
          <SectionLabel index={industries.section.index} label={industries.section.label} />
          <h2 id="industries-label" className="sr-only">
            {industries.section.label}
          </h2>
        </Container>
      </section>

      {/* 04 How it works: implemented in T3 */}
      <section id={howItWorks.section.id} aria-labelledby="how-we-work-label" className="py-24 lg:py-40">
        <Container>
          <SectionLabel index={howItWorks.section.index} label={howItWorks.section.label} />
          <h2 id="how-we-work-label" className="sr-only">
            {howItWorks.section.label}
          </h2>
        </Container>
      </section>

      {/* 05 Proof: implemented in T3 */}
      <section id={proof.section.id} aria-labelledby="proof-title" className="bg-ink py-24 text-paper lg:py-40">
        <Container>
          <SectionLabel index={proof.section.index} label={proof.section.label} tone="ink" />
          <h2 id="proof-title" className="mt-12 max-w-[20ch] text-h2 text-paper">
            {proof.title}
          </h2>
        </Container>
      </section>

      {/* 06 CTA: implemented in T3 */}
      <section id={cta.section.id} aria-labelledby="contact-title" className="bg-paper-2 py-24 lg:py-40">
        <Container>
          <SectionLabel index={cta.section.index} tone="paper-2" />
          <h2 id="contact-title" className="mt-12 text-center text-h2">
            {cta.title}
          </h2>
        </Container>
      </section>
    </>
  );
}
