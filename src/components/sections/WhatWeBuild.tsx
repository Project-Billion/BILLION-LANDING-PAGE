import { HoverCard } from "@/components/motion/HoverCard";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { whatWeBuild } from "@/content/site";

/** Desktop rows alternate 7/5, 5/7, 7/5; the wider cards use the Paper-2 surface. */
const cardLayouts = [
  { surface: "bg-paper-2", columns: "lg:col-span-7" },
  { surface: "bg-white", columns: "lg:col-span-5" },
  { surface: "bg-white", columns: "lg:col-span-5" },
  { surface: "bg-paper-2", columns: "lg:col-span-7" },
  { surface: "bg-paper-2", columns: "lg:col-span-7" },
  { surface: "bg-white", columns: "lg:col-span-5" },
] as const;

/** 02 What we build: six solution cards with explicit list semantics and a closing line. */
export function WhatWeBuild() {
  const { section, items, closing } = whatWeBuild;

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="py-24 lg:py-40">
      <Container>
        <SectionLabel as="h2" id={`${section.id}-title`} index={section.index} label={section.label} />

        <ul role="list" className="mt-12 grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-12">
          {items.map((item, i) => (
            <li key={item.title} role="listitem" className={`flex ${cardLayouts[i]?.columns ?? ""}`}>
              <HoverCard className={cardLayouts[i]?.surface}>
                <Reveal index={i} className="flex w-full flex-col">
                  <span aria-hidden="true" className="font-mono text-meta uppercase text-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-h3">{item.title}</h3>
                  <p className="mt-4 max-w-[46ch] text-body text-ink-2">{item.body}</p>
                </Reveal>
              </HoverCard>
            </li>
          ))}
        </ul>

        <Reveal>
          <p className="mt-12 max-w-[40rem] font-display text-h3 text-ink italic">{closing}</p>
        </Reveal>
      </Container>
    </section>
  );
}
