import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { performance } from "@/content/site";

/** 03 Performance: an inverted ledger with targets, audit results and engineering principles. */
export function Performance() {
  const { section, vitals, audits, principles } = performance;

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="bg-ink py-24 text-paper lg:py-40">
      <Container>
        <SectionLabel index={section.index} label={section.label} tone="ink" />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id={`${section.id}-title`} className="max-w-[20ch] text-h2 text-paper">
              {performance.title}
            </h2>
            <p className="mt-8 max-w-[48ch] text-body text-paper/70">{performance.body}</p>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <dl className="border-t border-rule-dark font-mono text-meta">
              {vitals.map((vital) => (
                <div
                  key={vital.key}
                  className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-rule-dark py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
                >
                  <dt className="contents">
                    <span className="text-paper">{vital.key}</span>
                    <span className="text-paper/70">{vital.label}</span>
                  </dt>
                  <dd className="col-start-2 whitespace-nowrap text-paper sm:col-start-3">{vital.target}</dd>
                  <dd className="col-start-2 text-paper/70 sm:col-span-2">
                    <span data-vital={vital.key}>{performance.vitalStates.measuring}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 font-mono text-meta text-paper/70">
              {audits.rows.length === 0 ? (
                <p>{audits.note}</p>
              ) : (
                <>
                  <dl className="border-t border-rule-dark">
                    {audits.rows.map((row) => (
                      <div key={row.label} className="flex justify-between gap-6 border-b border-rule-dark py-4">
                        <dt>{row.label}</dt>
                        <dd className="text-right text-paper">{row.value}</dd>
                      </div>
                    ))}
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

            <ol role="list" className="mt-12 border-b border-rule-dark">
              {principles.map((principle, i) => (
                <li key={principle.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-t border-rule-dark py-6">
                  <span aria-hidden="true" className="pt-1 font-mono text-meta text-paper">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-h3 text-paper">{principle.title}</h3>
                    <p className="mt-4 text-body text-paper/70">{principle.body}</p>
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
