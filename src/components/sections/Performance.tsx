import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Counter } from "@/components/motion/Counter";
import { VitalValue } from "@/components/perf/VitalValue";
import { performance as performanceContent } from "@/content/site";

/** Matches a value that is purely numeric (integer or decimal), e.g. "96" or "38.2". */
const NUMERIC_VALUE = /^\d+(\.\d+)?$/;

/** 03 Performance: a ledger with targets, audit results and engineering principles. */
export function Performance() {
  const { section, vitals, audits, principles } = performanceContent;

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="py-40 lg:py-56">
      <Container>
        <SectionLabel index={section.index} label={section.label} />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id={`${section.id}-title`} className="max-w-[20ch] text-h2 text-fg">
              {performanceContent.title}
            </h2>
            <p className="mt-8 max-w-[48ch] text-body text-fg-2">{performanceContent.body}</p>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <dl className="border-t border-rule font-mono text-meta">
              {vitals.map((vital) => (
                <div
                  key={vital.key}
                  className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-rule py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
                >
                  <dt className="contents">
                    <span className="text-fg">{vital.key}</span>
                    <span className="text-fg-2">{vital.label}</span>
                  </dt>
                  <dd className="col-start-2 whitespace-nowrap text-fg sm:col-start-3">{vital.target}</dd>
                  <dd className="col-start-2 text-fg-2 sm:col-span-2">
                    <VitalValue metric={vital.key} />
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 font-mono text-meta text-fg-2">
              {audits.rows.length === 0 ? (
                <p>{audits.note}</p>
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
                    <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {audits.browser ? <span>{audits.browser}</span> : null}
                      {audits.date ? <span>{audits.date}</span> : null}
                    </p>
                  ) : null}
                </>
              )}
            </div>

            <ol role="list" className="mt-12 border-b border-rule">
              {principles.map((principle, i) => (
                <li key={principle.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-t border-rule py-6">
                  <span aria-hidden="true" className="pt-1 font-mono text-meta text-fg">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-h3 text-fg">{principle.title}</h3>
                    <p className="mt-4 text-body text-fg-2">{principle.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
