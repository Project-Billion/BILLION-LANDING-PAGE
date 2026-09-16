import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { howItWorks } from "@/content/site";

/**
 * Desktop waypoint on the horizontal datum: Kiln square, a short leader toward the
 * text, and the step index on the text side. Row height is fixed at 5.5rem (88px),
 * so the datum sits at 44px.
 */
function Waypoint({ index, textAbove, isLast }: { index: string; textAbove: boolean; isLast: boolean }) {
  return (
    <div aria-hidden="true" className="relative hidden h-22 lg:row-start-2 lg:block">
      <span className={`absolute top-[44px] left-0 h-px bg-graphite/60 ${isLast ? "right-0" : "-right-8"}`} />
      <span className="absolute top-[40px] left-4 size-2 bg-kiln" />
      <span className={`absolute left-5 w-px bg-graphite/60 ${textAbove ? "top-[20px] h-5" : "top-[48px] h-5"}`} />
      <span
        className={`absolute left-5 -translate-x-1/2 font-mono text-meta leading-none text-ink ${textAbove ? "top-[4px]" : "top-[72px]"}`}
      >
        {index}
      </span>
    </div>
  );
}

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

        <ol
          role="list"
          className="mt-16 ml-1 space-y-12 border-l border-graphite/60 pl-8 lg:ml-0 lg:grid lg:grid-cols-4 lg:grid-rows-[auto_5.5rem_auto] lg:gap-x-8 lg:space-y-0 lg:border-l-0 lg:pl-0"
        >
          {steps.map((step, i) => {
            const textAbove = i % 2 === 1;
            return (
              <li
                key={step.index}
                className="relative before:absolute before:top-2.5 before:-left-[calc(2rem+4.5px)] before:size-2 before:bg-kiln lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:before:hidden"
              >
                <Waypoint index={step.index} textAbove={textAbove} isLast={i === steps.length - 1} />
                <Reveal
                  index={i}
                  className={textAbove ? "lg:row-start-1 lg:self-end lg:pb-6" : "lg:row-start-3 lg:pt-6"}
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
      </Container>
    </section>
  );
}
