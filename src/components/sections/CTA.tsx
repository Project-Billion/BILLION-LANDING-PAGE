import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cta, mailtoUrl, newTabHint, whatsappUrl } from "@/content/site";

/** 06 CTA: one quiet centred closing statement with two pill buttons underneath. */
export function CTA() {
  const { section } = cta;
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="py-40 lg:py-56">
      <Container>
        <SectionLabel index={section.index} align="center" />

        <Reveal className="mx-auto max-w-[48rem] pt-8 text-center">
          <h2 id={`${section.id}-title`} className="text-h2">
            {cta.title}
          </h2>
          <p className="mx-auto mt-8 max-w-[50ch] text-body text-fg-2">{cta.body}</p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
            <Magnetic>
              <Button href={whatsappUrl()} variant="accent" target="_blank" rel="noopener noreferrer" className="w-full">
                {cta.whatsappLabel}
                <ArrowRight className="w-5" />
                <span className="sr-only">{newTabHint}</span>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href={mailtoUrl()} variant="secondary" className="w-full sm:min-w-44">
                {cta.emailLabel}
              </Button>
            </Magnetic>
          </div>
          <p className="mt-6 font-mono text-meta uppercase text-fg-2">{cta.responseNote}</p>
        </Reveal>
      </Container>
    </section>
  );
}
