interface SectionLabelProps {
  /** Two-digit section index, e.g. "02". */
  index: string;
  /** Plain-language label, e.g. "What you get". Omit to show the index alone. */
  label?: string;
  /** Render as the section heading (h2) when the section has no other title. */
  as?: "p" | "h2";
  id?: string;
  /** Single palette now (v2): only alignment varies between sections. */
  align?: "left" | "center";
  className?: string;
}

/**
 * Mono metadata label for a numbered section, e.g. "02 — What you get".
 */
export function SectionLabel({
  index,
  label,
  as: Tag = "p",
  id,
  align = "left",
  className = "",
}: SectionLabelProps) {
  return (
    <Tag
      id={id}
      className={`font-mono text-meta uppercase text-fg-2 ${align === "center" ? "text-center" : ""} ${className}`}
    >
      <span className="text-fg">{index}</span>
      {label ? ` — ${label}` : null}
    </Tag>
  );
}
