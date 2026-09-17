import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Counter } from "@/components/motion/Counter";
import { VitalValue } from "@/components/perf/VitalValue";
import { performance as performanceContent } from "@/content/site";

/** Matches a value that is purely numeric (integer or decimal), e.g. "96" or "38.2". */
const NUMERIC_VALUE = /^\d+(\.\d+)?$/;

/**
 * 03 Performance, dark band: centred H2 + body, the live vitals as one floating tilted
 * card, then the audits ledger and the three engineering principles as plain typography.
 */
export function Performance() {
  const { section, vitals, audits, principles } = performanceContent;

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="py-40 lg:py-56">
      <Container>
        <SectionLabel index={section.index} label={section.label} align="center" />
        <h2 id={`${section.id}-title`} className="mx-auto mt-4 max-w-[20ch] text-center text-h2 text-fg">
          {performanceContent.title}
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch] text-center text-body text-fg-2">{performanceContent.body}</p>

        <div className="mx-auto mt-16 max-w-[720px]" style={{ perspective: "1400px" }}>
          <dl className="flex flex-col gap-10 rounded-lg border border-rule bg-bg-2 p-8 md:p-10 lg:[transform:rotateX(6deg)_rotateY(6deg)]">
            {vitals.map((vital) => (
              <div key={vital.key} className="relative flex items-baseline justify-between gap-4 pb-4 font-mono text-meta">
                <dt className="flex items-baseline gap-3">
                  <span className="text-fg">{vital.key}</span>
                  <span className="text-fg-2">{vital.label}</span>
                </dt>
                <dd>
                  <VitalValue metric={vital.key} bar />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto mt-16 max-w-[720px] font-mono text-meta text-fg-2">
          {audits.rows.length === 0 ? (
            <p className="text-center">{audits.note}</p>
          ) : (
            <>
              <dl className="border-t border-rule">
                {audits.rows.map((row) => {
                  const match = NUMERIC_VALUE.exec(row.value);
                  const decimals = match?.[1] ? match[1].length - 1 : 0;
                  return (
                    <div key={row.label} className="flex justify-between gap-6 border-b border-rule py-4">
                      <dt>{row.label}</dt>
                      <dd className="text-right text-fg">
                        {match ? <Counter to={Number(row.value)} decimals={decimals} /> : row.value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              {audits.browser || audits.date ? (
                <p className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                  {audits.browser ? <span>{audits.browser}</span> : null}
                  {audits.date ? <span>{audits.date}</span> : null}
                </p>
              ) : null}
            </>
          )}
        </div>

        <ol role="list" className="mx-auto mt-20 grid max-w-[960px] gap-10 lg:grid-cols-3 lg:gap-12">
          {principles.map((principle, i) => (
            <li key={principle.title}>
              <span aria-hidden="true" className="font-mono text-meta text-fg-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-h3 text-fg">{principle.title}</h3>
              <p className="mt-3 text-body text-fg-2">{principle.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
