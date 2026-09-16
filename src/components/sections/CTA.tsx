import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cta, mailtoUrl, newTabHint, whatsappUrl } from "@/content/site";

/** 06 CTA: one quiet centered ask on Paper-2, framed by two hairlines with the index at the upper rule. */
export function CTA() {
  const { section } = cta;
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="bg-paper-2 py-24 lg:py-40">
      <Container>
        <div className="flex items-center gap-5">
          <SectionLabel index={section.index} />
          <span aria-hidden="true" className="h-px flex-1 bg-rule" />
        </div>

        <Reveal className="mx-auto max-w-[48rem] py-20 text-center md:py-28">
          <h2 id={`${section.id}-title`} className="text-h2">
            {cta.title}
          </h2>
          <p className="mx-auto mt-8 max-w-[46rem] text-body text-ink-2">{cta.body}</p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
            <Button href={whatsappUrl()} variant="accent" target="_blank" rel="noopener noreferrer">
              {cta.whatsappLabel}
              <ArrowRight className="w-5" />
              <span className="sr-only">{newTabHint}</span>
            </Button>
            <Button href={mailtoUrl()} variant="secondary" className="sm:min-w-44">
              {cta.emailLabel}
            </Button>
          </div>
          <p className="mt-6 font-mono text-meta uppercase text-graphite">{cta.responseNote}</p>
        </Reveal>

        <div aria-hidden="true" className="h-px bg-rule" />
      </Container>
    </section>
  );
}
