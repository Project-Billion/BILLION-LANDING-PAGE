import { SystemSchematic } from "@/components/drawings/Schematics";
import { HoverCard } from "@/components/motion/HoverCard";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { hero, whatWeBuild } from "@/content/site";

/** Desktop rows alternate 7/5, 5/7, 7/5 (layout only; the typographic list is a later task). */
const cardColumns = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7", "lg:col-span-7", "lg:col-span-5"] as const;

/**
 * 02 What we build: centred heading block (label, "What we build", the former hero
 * subline and trust line), six solution cards as bg-2 surfaces, then the system
 * schematic and the "what we optimize first" panel that used to live in the hero.
 */
export function WhatWeBuild() {
  const { section, items, closing } = whatWeBuild;

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="py-40 lg:py-56">
      <Container>
        <SectionLabel index={section.index} align="center" />
        <h2 id={`${section.id}-title`} className="mt-4 text-h2 text-center text-fg">
          {section.label}
        </h2>
        <p className="text-sub mx-auto mt-6 max-w-[60ch] text-center text-fg-2">{hero.sub}</p>
        <p className="mt-4 text-center text-ui text-fg-2">{hero.trustLine}</p>

        <ul role="list" className="mt-16 grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-12">
          {items.map((item, i) => (
            <li key={item.title} role="listitem" className={`flex ${cardColumns[i] ?? ""}`}>
              <HoverCard className="bg-bg-2">
                <Reveal index={i} className="flex w-full flex-col">
                  <span aria-hidden="true" className="font-mono text-meta uppercase text-fg">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-h3">{item.title}</h3>
                  <p className="mt-4 max-w-[46ch] text-body text-fg-2">{item.body}</p>
                </Reveal>
              </HoverCard>
            </li>
          ))}
        </ul>

        <Reveal>
          <p className="mt-12 max-w-[40rem] font-display text-h3 text-fg italic">{closing}</p>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <Reveal className="lg:col-span-8">
            <SystemSchematic className="self-end text-fg-2" />
          </Reveal>

          <Reveal index={1} className="lg:col-span-4">
            <aside
              aria-labelledby="optimize-panel-title"
              className="rounded-lg border border-rule bg-bg-2 px-4 pt-4 pb-2 font-mono text-meta text-fg-2 lg:mt-6"
            >
              <p className="flex items-baseline justify-between gap-4 uppercase">
                <span id="optimize-panel-title" className="text-fg">
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
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
