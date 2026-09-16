import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { industries } from "@/content/site";

/** 03 Industries: a typographic ledger, label rail on the left, ruled rows on the right. */
export function Industries() {
  const { section, items, closing } = industries;
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="py-24 lg:py-40">
      <Container className="grid gap-10 md:grid-cols-12 md:gap-8">
        <SectionLabel
          as="h2"
          id={`${section.id}-title`}
          index={section.index}
          label={section.label}
          className="md:col-span-2"
        />

        <div className="md:col-span-10">
          <ul role="list" className="border-t border-rule">
            {items.map((item, i) => (
              <li key={item.name} className="border-b border-rule">
                <Reveal
                  index={i}
                  className="grid gap-2 py-6 md:grid-cols-[47fr_53fr] md:items-center md:gap-8 md:py-5"
                >
                  <h3 className="text-[clamp(1.5rem,2.3vw,1.875rem)] leading-[1.15]">{item.name}</h3>
                  <p className="text-body text-graphite">{item.leaks}</p>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal>
            <p className="mt-12 font-display text-[clamp(1.75rem,2.7vw,2.125rem)] leading-[1.15] tracking-[-0.02em] text-balance text-ink">
              {closing}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
