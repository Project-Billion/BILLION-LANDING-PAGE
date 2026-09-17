import { DrawPath } from "@/components/motion/DrawPath";
import { Reveal } from "@/components/motion/Reveal";
import { Waypoint } from "@/components/motion/Waypoint";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { howItWorks } from "@/content/site";

/**
 * 04 How we work: staggered editorial timeline on one datum from lg up (01/03 below,
 * 02/04 above); under lg a single vertical line at the start edge. DOM order stays 01 to 04.
 */
export function HowItWorks() {
  const { section, steps } = howItWorks;
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="py-24 lg:py-40">
      <Container>
        <SectionLabel as="h2" id={`${section.id}-title`} index={section.index} label={section.label} />

        <DrawPath>
          <ol
            role="list"
            className="space-y-12 pl-8 lg:row-span-3 lg:grid lg:grid-cols-4 lg:grid-rows-subgrid lg:gap-x-8 lg:space-y-0 lg:pl-0"
          >
            {steps.map((step, i) => {
              const textAbove = i % 2 === 1;
              return (
                <li
                  key={step.index}
                  className="relative lg:row-span-3 lg:grid lg:grid-rows-subgrid"
                >
                  <Waypoint index={step.index} textAbove={textAbove} />
                  <Reveal
                    index={i}
                    className={`relative before:absolute before:top-2.5 before:-left-9 before:size-2 before:bg-kiln lg:before:hidden ${textAbove ? "lg:row-start-1 lg:self-end lg:pb-6" : "lg:row-start-3 lg:pt-6"}`}
                  >
                    <span aria-hidden="true" className="font-mono text-meta text-ink lg:hidden">
                      {step.index}
                    </span>
                    <h3 className="mt-2 text-[clamp(1.625rem,2.3vw,2rem)] leading-[1.1] lg:mt-0">{step.title}</h3>
                    <p className="mt-4 max-w-[34ch] text-body text-ink-2">{step.body}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </DrawPath>
      </Container>
    </section>
  );
}
