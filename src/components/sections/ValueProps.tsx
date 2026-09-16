import type { ReactNode } from "react";
import { CircuitPath, DataFlow } from "@/components/drawings/Schematics";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { valueProps } from "@/content/site";

interface CellLayout {
  /** Column span on the 12-column desktop grid: rows split 8/4 then 5/7 so the T-junctions offset. */
  span: string;
  surface: string;
  drawing?: ReactNode;
}

const cellLayouts: readonly CellLayout[] = [
  { span: "md:col-span-8", surface: "bg-paper", drawing: <DataFlow className="mt-8 max-w-[30rem] text-ink-2 md:mx-auto" /> },
  { span: "md:col-span-4", surface: "bg-paper-2" },
  { span: "md:col-span-5", surface: "bg-paper-2" },
  { span: "md:col-span-7", surface: "bg-paper", drawing: <CircuitPath className="mt-8 ml-auto max-w-[10rem] text-ink-2" /> },
];

/** 02 What you get: gapless asymmetric bento, hairlines drawn by a 1px grid gap over the Rule color. */
export function ValueProps() {
  const { section, items } = valueProps;
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="bg-paper-2 py-24 lg:py-40">
      <Container>
        <SectionLabel as="h2" id={`${section.id}-title`} index={section.index} label={section.label} />

        <ul role="list" className="mt-12 grid gap-px border border-rule bg-rule md:grid-cols-12">
          {items.map((item, i) => {
            const layout = cellLayouts[i];
            return (
              <li key={item.title} className={`flex ${layout?.span ?? ""} ${layout?.surface ?? "bg-paper"}`}>
                <Reveal index={i} className="flex w-full flex-col p-6 md:p-10">
                  <span aria-hidden="true" className="font-mono text-meta text-graphite">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-h3">{item.title}</h3>
                  <p className="mt-4 max-w-[46ch] text-body text-ink-2">{item.body}</p>
                  {layout?.drawing}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
