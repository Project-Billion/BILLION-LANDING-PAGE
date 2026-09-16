export type SectionTone = "light" | "ink";

interface SectionLabelProps {
  /** Two-digit section index, e.g. "02". */
  index: string;
  /** Plain-language label, e.g. "What you get". Omit to show the index alone. */
  label?: string;
  /** Render as the section heading (h2) when the section has no other title. */
  as?: "p" | "h2";
  id?: string;
  /**
   * Background the label sits on. Small text is never Kiln (fails AA on Paper-2 and is
   * marginal on Paper), so the index is Ink on light surfaces and Paper on Ink.
   */
  tone?: SectionTone;
  className?: string;
}

const toneClasses: Record<SectionTone, { text: string; index: string }> = {
  light: { text: "text-graphite", index: "text-ink" },
  ink: { text: "text-paper/70", index: "text-paper" },
};

/**
 * Mono metadata label for a numbered section, e.g. "02 — What you get".
 */
export function SectionLabel({
  index,
  label,
  as: Tag = "p",
  id,
  tone = "light",
  className = "",
}: SectionLabelProps) {
  const colors = toneClasses[tone];
  return (
    <Tag id={id} className={`font-mono text-meta uppercase ${colors.text} ${className}`}>
      <span className={colors.index}>{index}</span>
      {label ? ` — ${label}` : null}
    </Tag>
  );
}
