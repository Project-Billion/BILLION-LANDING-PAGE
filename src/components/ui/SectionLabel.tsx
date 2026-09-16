export type SectionTone = "paper" | "paper-2" | "ink";

interface SectionLabelProps {
  /** Two-digit section index, e.g. "02". */
  index: string;
  /** Plain-language label, e.g. "What you get". Omit to show the index alone. */
  label?: string;
  /**
   * Background the label sits on. Kiln index text passes AA only on Paper (4.5:1),
   * so on Paper-2 the index falls back to Ink, and on Ink everything is Paper.
   */
  tone?: SectionTone;
  className?: string;
}

const toneClasses: Record<SectionTone, { text: string; index: string }> = {
  paper: { text: "text-graphite", index: "text-kiln" },
  "paper-2": { text: "text-graphite", index: "text-ink" },
  ink: { text: "text-paper/70", index: "text-paper" },
};

/**
 * Mono metadata label for a numbered section, e.g. "02 — What you get".
 */
export function SectionLabel({ index, label, tone = "paper", className = "" }: SectionLabelProps) {
  const colors = toneClasses[tone];
  return (
    <p className={`font-mono text-meta uppercase ${colors.text} ${className}`}>
      <span className={colors.index}>{index}</span>
      {label ? ` — ${label}` : null}
    </p>
  );
}
