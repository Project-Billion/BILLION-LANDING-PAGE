import type { CSSProperties } from "react";
import { SystemSchematic } from "@/components/drawings/Schematics";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { hero, whatWeBuild } from "@/content/site";

/** Static CSS tilt (design spec section 10): no JS, no scroll-linking. */
const SCHEMATIC_TILT: CSSProperties = { transform: "rotateX(8deg) rotateY(-10deg)" };

/**
 * 02 What we build: centred heading block (label, "What we build", the former hero
 * subline and trust line), six solutions as a plain typographic list (no card
 * surfaces), the system schematic tilted in a CSS perspective wrapper with the
 * "what we optimize first" panel underneath, and the closing line under everything.
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

        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start lg:gap-12">
          <ul role="list" className="order-2 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:order-1 lg:col-span-7">
            {items.map((item, i) => (
              <li key={item.title} role="listitem">
                <Reveal index={i} className="wwb-row">
                  <p className="flex items-baseline justify-between gap-4">
                    <span className="text-h3 font-medium text-fg">{item.title}</span>
                    <span aria-hidden="true" className="wwb-chevron shrink-0 text-xl text-fg-2">
                      &rsaquo;
                    </span>
                  </p>
                  <p className="mt-3 max-w-[46ch] text-body text-fg-2">{item.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="order-1 lg:order-2 lg:col-span-5">
            <Reveal>
              <div style={{ perspective: "1200px" }}>
                <div style={SCHEMATIC_TILT}>
                  <SystemSchematic className="text-fg-2" />
                </div>
              </div>
            </Reveal>

            <Reveal index={1}>
              <aside
                aria-labelledby="optimize-panel-title"
                className="mt-6 rounded-lg border border-rule bg-bg-2 px-4 pt-4 pb-2 font-mono text-meta text-fg-2"
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
        </div>

        <Reveal>
          <p className="mx-auto mt-16 max-w-[40rem] text-center text-sub font-normal text-fg-2">{closing}</p>
        </Reveal>
      </Container>
    </section>
  );
}
